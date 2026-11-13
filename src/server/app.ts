import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import {
  getDb,
  saveDb,
  recordActivityLog,
  getDashboardStats,
} from './db.ts';
import { calculateStockStatus, generateInventoryCSV, generateSlug } from '../utils/inventory.ts';
import { TYRE_STUDIO_ASSETS, normalizeAssetUrl } from '../utils/tyreImages.ts';
import { Banner, Tyre } from '../types/index.ts';

export const app = express();
app.use(express.json({ limit: '10mb' }));

// Ensure uploads directory exists (use /tmp on Vercel read-only filesystem)
const UPLOADS_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'good-luck-tyres-uploads')
  : path.resolve(process.cwd(), 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Ignore if running in read-only environment
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer config for image/document uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
    } catch {
      // handled by multer if un-writable
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '');
    const safeName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    cb(null, safeName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Stateless HMAC-signed Admin Tokens (works reliably across serverless & restarts)
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.JWT_SECRET ||
  'glt-commercial-radial-hmac-secret-2026';
const revokedTokens = new Set<string>();

interface SessionRecord {
  userId: string;
  name: string;
  email: string;
  role: string;
  expiresAt: number;
}

function signSessionToken(session: SessionRecord): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string): SessionRecord | null {
  if (!token || revokedTokens.has(token)) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as SessionRecord;
    if (!parsed || typeof parsed.expiresAt !== 'number' || Date.now() > parsed.expiresAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function getSessionFromRequest(req: Request): SessionRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return verifySessionToken(token);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  (req as Request & { adminUser?: SessionRecord }).adminUser = session;
  next();
}

// SSE Clients for real-time inventory & banner updates
const sseClients = new Set<Response>();

function broadcastEvent(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

app.get('/api/inventory/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);
  sseClients.add(res);

  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// ================= AUTH ENDPOINTS =================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const db = getDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
  );

  if (!user || !bcrypt.compareSync(String(password), user.passwordHash)) {
    res.status(401).json({ error: 'Invalid admin credentials' });
    return;
  }

  const session: SessionRecord = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
  };
  const token = signSessionToken(session);

  recordActivityLog(db, user.name, 'ADMIN_LOGIN', 'Auth', user.id, `Signed in (${user.email})`);
  saveDb(db);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  res.json({
    user: {
      id: adminUser.userId,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    },
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    revokedTokens.add(authHeader.slice(7).trim());
  }
  res.json({ ok: true });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters' });
    return;
  }

  const db = getDb();
  const user = db.users.find((u) => u.id === adminUser.userId);
  if (!user || !bcrypt.compareSync(String(currentPassword), user.passwordHash)) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }

  user.passwordHash = bcrypt.hashSync(String(newPassword), 10);
  recordActivityLog(
    db,
    adminUser.name,
    'CHANGE_PASSWORD',
    'Auth',
    user.id,
    'Updated administrator password'
  );
  saveDb(db);
  res.json({ ok: true });
});

// ================= TYRES ENDPOINTS =================
function hydrateTyre(tyre: Tyre): Tyre {
  const db = getDb();
  const brand = db.brands.find((b) => b.id === tyre.brandId);
  const categoryIds = Array.isArray(tyre.categoryIds) ? tyre.categoryIds : [];
  const categoryNames = categoryIds
    .map((cid) => db.categories.find((c) => c.id === cid)?.name)
    .filter((n): n is string => Boolean(n));

  return {
    ...tyre,
    categoryIds,
    mainImage: normalizeAssetUrl(tyre.mainImage) || TYRE_STUDIO_ASSETS.tbr,
    galleryImages: Array.isArray(tyre.galleryImages)
      ? tyre.galleryImages.map((img) => normalizeAssetUrl(img) || img)
      : [],
    brandName: brand?.name || tyre.brandName || 'Unknown Brand',
    categoryNames: categoryNames.length > 0 ? categoryNames : tyre.categoryNames || [],
  };
}

app.get('/api/tyres', (req, res) => {
  const db = getDb();
  const includeDrafts = req.query.includeDrafts === 'true' && Boolean(getSessionFromRequest(req));
  const list = db.tyres
    .filter((t) => includeDrafts || t.publishingStatus === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(hydrateTyre);
  res.json(list);
});

app.get('/api/tyres/:idOrSlug', (req, res) => {
  const db = getDb();
  const key = req.params.idOrSlug;
  const tyre = db.tyres.find((t) => t.id === key || t.slug === key);
  if (!tyre) {
    res.status(404).json({ error: 'Tyre not found' });
    return;
  }
  res.json(hydrateTyre(tyre));
});

app.post('/api/tyres', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const body = req.body || {};
  if (!body.name || !body.brandId || !Array.isArray(body.categoryIds) || body.categoryIds.length === 0) {
    res.status(400).json({ error: 'Name, brand, and at least one category are required' });
    return;
  }

  const db = getDb();
  const now = new Date().toISOString();
  const qty = Math.max(0, Number(body.stockQuantity) || 0);
  const status =
    body.stockStatus === 'on_order' ? 'on_order' : calculateStockStatus(qty);

  const newTyre: Tyre = {
    id: `tyre-${Date.now()}`,
    name: String(body.name).trim(),
    slug: body.slug ? generateSlug(body.slug) : `${generateSlug(body.name)}-${Date.now().toString().slice(-4)}`,
    sku: String(body.sku || `GLT-${Date.now().toString().slice(-6)}`).trim(),
    brandId: String(body.brandId),
    categoryIds: body.categoryIds,
    sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ['12R22.5'],
    plyRating: String(body.plyRating || '18PR'),
    loadIndex: String(body.loadIndex || '152/149'),
    speedRating: String(body.speedRating || 'M'),
    treadPattern: String(body.treadPattern || 'Commercial Radial'),
    treadDepth: String(body.treadDepth || '16.0mm'),
    constructionType: body.constructionType === 'Bias' ? 'Bias' : 'Radial',
    application: String(body.application || 'Long Haul / Steer Axle'),
    shortDescription: String(body.shortDescription || ''),
    fullDescription: String(body.fullDescription || body.shortDescription || ''),
    features: Array.isArray(body.features) ? body.features : [],
    technicalSpecs: body.technicalSpecs || {},
    stockStatus: status,
    stockQuantity: qty,
    minimumStockAlert: Math.max(0, Number(body.minimumStockAlert) || 10),
    pricePkr: body.pricePkr ? Number(body.pricePkr) : undefined,
    mainImage: normalizeAssetUrl(body.mainImage) || TYRE_STUDIO_ASSETS.tbr,
    galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
    brochureUrl: body.brochureUrl,
    publishingStatus: body.publishingStatus === 'draft' ? 'draft' : 'published',
    isFeatured: Boolean(body.isFeatured),
    displayOrder: Number(body.displayOrder) || db.tyres.length + 1,
    createdAt: now,
    updatedAt: now,
  };

  db.tyres.unshift(newTyre);
  recordActivityLog(
    db,
    adminUser.name,
    'CREATE_TYRE',
    'Tyre',
    newTyre.id,
    `Created tyre ${newTyre.name} (${newTyre.sku})`
  );
  saveDb(db);

  const hydrated = hydrateTyre(newTyre);
  broadcastEvent('tyre_updated', hydrated);
  res.status(201).json(hydrated);
});

app.put('/api/tyres/:id', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const idx = db.tyres.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Tyre not found' });
    return;
  }

  const prev = db.tyres[idx];
  const body = req.body || {};
  const qty = body.stockQuantity !== undefined ? Math.max(0, Number(body.stockQuantity)) : prev.stockQuantity;
  const nextStatus =
    body.stockStatus === 'on_order'
      ? 'on_order'
      : body.stockStatus && body.stockQuantity === undefined
        ? body.stockStatus
        : calculateStockStatus(qty);

  const updated: Tyre = {
    ...prev,
    ...body,
    id: prev.id,
    stockQuantity: qty,
    stockStatus: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  db.tyres[idx] = updated;
  recordActivityLog(
    db,
    adminUser.name,
    'UPDATE_TYRE',
    'Tyre',
    updated.id,
    `Updated ${updated.name}`
  );
  saveDb(db);

  const hydrated = hydrateTyre(updated);
  broadcastEvent('tyre_updated', hydrated);
  res.json(hydrated);
});

app.delete('/api/tyres/:id', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const idx = db.tyres.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Tyre not found' });
    return;
  }

  const [removed] = db.tyres.splice(idx, 1);
  recordActivityLog(
    db,
    adminUser.name,
    'DELETE_TYRE',
    'Tyre',
    removed.id,
    `Deleted tyre ${removed.name}`
  );
  saveDb(db);
  broadcastEvent('tyre_updated', { deletedId: removed.id });
  res.json({ ok: true });
});

app.post('/api/tyres/:id/duplicate', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const source = db.tyres.find((t) => t.id === req.params.id);
  if (!source) {
    res.status(404).json({ error: 'Source tyre not found' });
    return;
  }

  const now = new Date().toISOString();
  const clone: Tyre = {
    ...source,
    id: `tyre-${Date.now()}`,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    sku: `${source.sku}-CPY`,
    publishingStatus: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  db.tyres.unshift(clone);
  recordActivityLog(
    db,
    adminUser.name,
    'DUPLICATE_TYRE',
    'Tyre',
    clone.id,
    `Duplicated ${source.name}`
  );
  saveDb(db);
  res.status(201).json(hydrateTyre(clone));
});

// ================= INVENTORY ENDPOINTS =================
app.patch('/api/tyres/:id/stock', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const tyre = db.tyres.find((t) => t.id === req.params.id);
  if (!tyre) {
    res.status(404).json({ error: 'Tyre not found' });
    return;
  }

  const prevQty = tyre.stockQuantity;
  const prevStatus = tyre.stockStatus;
  const nextQty =
    req.body?.stockQuantity !== undefined
      ? Math.max(0, Number(req.body.stockQuantity) || 0)
      : prevQty;

  const nextStatus =
    req.body?.stockStatus === 'on_order'
      ? 'on_order'
      : req.body?.stockStatus && req.body?.stockQuantity === undefined
        ? req.body.stockStatus
        : calculateStockStatus(nextQty);

  tyre.stockQuantity = nextQty;
  tyre.stockStatus = nextStatus;
  tyre.updatedAt = new Date().toISOString();

  const historyEntry = {
    id: `hist-${Date.now()}`,
    tyreId: tyre.id,
    tyreName: tyre.name,
    sku: tyre.sku,
    previousQuantity: prevQty,
    newQuantity: nextQty,
    changeDelta: nextQty - prevQty,
    previousStatus: prevStatus,
    newStatus: nextStatus,
    reason: String(req.body?.reason || 'Manual warehouse stock adjustment'),
    updatedBy: adminUser.name,
    timestamp: tyre.updatedAt,
  };

  db.inventoryHistory.unshift(historyEntry);
  if (db.inventoryHistory.length > 200) {
    db.inventoryHistory = db.inventoryHistory.slice(0, 200);
  }

  recordActivityLog(
    db,
    adminUser.name,
    'ADJUST_STOCK',
    'Inventory',
    tyre.id,
    `${tyre.sku}: ${prevQty} -> ${nextQty} units (${nextStatus})`
  );
  saveDb(db);

  const hydrated = hydrateTyre(tyre);
  broadcastEvent('inventory_updated', hydrated);
  res.json({ tyre: hydrated, historyEntry });
});

app.get('/api/inventory/history', requireAuth, (_req, res) => {
  const db = getDb();
  res.json(db.inventoryHistory);
});

app.get('/api/inventory/export', requireAuth, (_req, res) => {
  const db = getDb();
  const hydrated = db.tyres.map(hydrateTyre);
  const csv = generateInventoryCSV(hydrated);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="good-luck-tyres-inventory.csv"');
  res.send(csv);
});

// ================= BRANDS ENDPOINTS =================
app.get('/api/brands', (req, res) => {
  const db = getDb();
  const includeInactive =
    req.query.includeInactive === 'true' && Boolean(getSessionFromRequest(req));
  const brands = db.brands
    .filter((b) => includeInactive || (b.isActive && b.isPublished))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((b) => ({
      ...b,
      logo: normalizeAssetUrl(b.logo) || '',
      coverImage: normalizeAssetUrl(b.coverImage) || '',
      tyreCount: db.tyres.filter(
        (t) => t.brandId === b.id && t.publishingStatus === 'published'
      ).length,
    }));
  res.json(brands);
});

app.post('/api/brands', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const body = req.body || {};
  if (!body.name) {
    res.status(400).json({ error: 'Brand name is required' });
    return;
  }

  const db = getDb();
  const newBrand = {
    id: `brand-${Date.now()}`,
    name: String(body.name).trim(),
    slug: body.slug ? generateSlug(body.slug) : generateSlug(body.name),
    description: String(body.description || ''),
    logo: String(body.logo || ''),
    coverImage: String(body.coverImage || ''),
    websiteUrl: body.websiteUrl,
    isActive: body.isActive !== false,
    isPublished: body.isPublished !== false,
    displayOrder: Number(body.displayOrder) || db.brands.length + 1,
  };
  db.brands.push(newBrand);
  recordActivityLog(
    db,
    adminUser.name,
    'CREATE_BRAND',
    'Brand',
    newBrand.id,
    `Created brand ${newBrand.name}`
  );
  saveDb(db);
  res.status(201).json(newBrand);
});

app.put('/api/brands/:id', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const idx = db.brands.findIndex((b) => b.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  db.brands[idx] = { ...db.brands[idx], ...req.body, id: db.brands[idx].id };
  recordActivityLog(
    db,
    adminUser.name,
    'UPDATE_BRAND',
    'Brand',
    db.brands[idx].id,
    `Updated brand ${db.brands[idx].name}`
  );
  saveDb(db);
  res.json(db.brands[idx]);
});

app.delete('/api/brands/:id', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const linkedCount = db.tyres.filter((t) => t.brandId === req.params.id).length;
  if (linkedCount > 0) {
    res.status(400).json({
      error: `Cannot delete brand: ${linkedCount} tyre(s) are still assigned to it.`,
    });
    return;
  }

  const idx = db.brands.findIndex((b) => b.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const [removed] = db.brands.splice(idx, 1);
  recordActivityLog(
    db,
    adminUser.name,
    'DELETE_BRAND',
    'Brand',
    removed.id,
    `Deleted brand ${removed.name}`
  );
  saveDb(db);
  res.json({ ok: true });
});

// ================= CATEGORIES ENDPOINTS =================
app.get('/api/categories', (req, res) => {
  const db = getDb();
  const includeInactive =
    req.query.includeInactive === 'true' && Boolean(getSessionFromRequest(req));
  const list = db.categories
    .filter((c) => includeInactive || (c.isActive && c.isPublished))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((c) => ({
      ...c,
      image: normalizeAssetUrl(c.image) || '',
      tyreCount: db.tyres.filter(
        (t) => Array.isArray(t.categoryIds) && t.categoryIds.includes(c.id) && t.publishingStatus === 'published'
      ).length,
    }));
  res.json(list);
});

app.post('/api/categories', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const body = req.body || {};
  if (!body.name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  const db = getDb();
  const newCategory = {
    id: `cat-${Date.now()}`,
    name: String(body.name).trim(),
    slug: body.slug ? generateSlug(body.slug) : generateSlug(body.name),
    description: String(body.description || ''),
    image: String(body.image || ''),
    brandIds: Array.isArray(body.brandIds) ? body.brandIds : [],
    isActive: body.isActive !== false,
    isPublished: body.isPublished !== false,
    displayOrder: Number(body.displayOrder) || db.categories.length + 1,
  };
  db.categories.push(newCategory);
  recordActivityLog(
    db,
    adminUser.name,
    'CREATE_CATEGORY',
    'Category',
    newCategory.id,
    `Created category ${newCategory.name}`
  );
  saveDb(db);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const idx = db.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  db.categories[idx] = { ...db.categories[idx], ...req.body, id: db.categories[idx].id };
  recordActivityLog(
    db,
    adminUser.name,
    'UPDATE_CATEGORY',
    'Category',
    db.categories[idx].id,
    `Updated category ${db.categories[idx].name}`
  );
  saveDb(db);
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const linkedCount = db.tyres.filter(
    (t) => Array.isArray(t.categoryIds) && t.categoryIds.includes(req.params.id)
  ).length;
  if (linkedCount > 0) {
    res.status(400).json({
      error: `Cannot delete category: ${linkedCount} tyre(s) are still assigned to it.`,
    });
    return;
  }

  const idx = db.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  const [removed] = db.categories.splice(idx, 1);
  recordActivityLog(
    db,
    adminUser.name,
    'DELETE_CATEGORY',
    'Category',
    removed.id,
    `Deleted category ${removed.name}`
  );
  saveDb(db);
  res.json({ ok: true });
});

// ================= APPLICATIONS, DEALERS, CLIENTS =================
app.get('/api/applications', (_req, res) => {
  res.json(getDb().applications);
});

app.get('/api/dealers', (req, res) => {
  const db = getDb();
  const includeInactive =
    req.query.includeInactive === 'true' && Boolean(getSessionFromRequest(req));
  res.json(
    db.dealers
      .filter((d) => includeInactive || d.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  );
});

app.post('/api/dealers', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const body = req.body || {};
  if (!body.companyName || !body.city) {
    res.status(400).json({ error: 'Company name and city are required' });
    return;
  }
  const db = getDb();
  const dealer = {
    id: `dlr-${Date.now()}`,
    companyName: String(body.companyName).trim(),
    city: String(body.city).trim(),
    region: String(body.region || ''),
    address: String(body.address || ''),
    phone: String(body.phone || ''),
    whatsapp: String(body.whatsapp || ''),
    email: String(body.email || ''),
    hours: String(body.hours || 'Mon–Sat: 9:30 AM – 7:30 PM'),
    isActive: body.isActive !== false,
    displayOrder: Number(body.displayOrder) || db.dealers.length + 1,
  };
  db.dealers.push(dealer);
  recordActivityLog(
    db,
    adminUser.name,
    'CREATE_DEALER',
    'Dealer',
    dealer.id,
    `Added dealer ${dealer.companyName}`
  );
  saveDb(db);
  res.status(201).json(dealer);
});

app.put('/api/dealers/:id', requireAuth, (req, res) => {
  const db = getDb();
  const idx = db.dealers.findIndex((d) => d.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Dealer not found' });
    return;
  }
  db.dealers[idx] = { ...db.dealers[idx], ...req.body, id: db.dealers[idx].id };
  saveDb(db);
  res.json(db.dealers[idx]);
});

app.delete('/api/dealers/:id', requireAuth, (req, res) => {
  const db = getDb();
  const idx = db.dealers.findIndex((d) => d.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Dealer not found' });
    return;
  }
  db.dealers.splice(idx, 1);
  saveDb(db);
  res.json({ ok: true });
});

app.get('/api/clients', (req, res) => {
  const db = getDb();
  const includeInactive =
    req.query.includeInactive === 'true' && Boolean(getSessionFromRequest(req));
  res.json(
    db.corporateClients
      .filter((c) => includeInactive || c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  );
});

app.post('/api/clients', requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body.name) {
    res.status(400).json({ error: 'Client name is required' });
    return;
  }
  const db = getDb();
  const client = {
    id: `cli-${Date.now()}`,
    name: String(body.name).trim(),
    sector: String(body.sector || 'Commercial Logistics'),
    description: String(body.description || ''),
    logo: String(body.logo || ''),
    isActive: body.isActive !== false,
    displayOrder: Number(body.displayOrder) || db.corporateClients.length + 1,
  };
  db.corporateClients.push(client);
  saveDb(db);
  res.status(201).json(client);
});

app.put('/api/clients/:id', requireAuth, (req, res) => {
  const db = getDb();
  const idx = db.corporateClients.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }
  db.corporateClients[idx] = {
    ...db.corporateClients[idx],
    ...req.body,
    id: db.corporateClients[idx].id,
  };
  saveDb(db);
  res.json(db.corporateClients[idx]);
});

app.delete('/api/clients/:id', requireAuth, (req, res) => {
  const db = getDb();
  const idx = db.corporateClients.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }
  db.corporateClients.splice(idx, 1);
  saveDb(db);
  res.json({ ok: true });
});

// ================= ENQUIRIES ENDPOINTS =================
app.get('/api/enquiries', requireAuth, (_req, res) => {
  res.json(getDb().enquiries);
});

app.post('/api/enquiries', (req, res) => {
  const body = req.body || {};
  if (!body.customerName || !body.phone || !body.message) {
    res.status(400).json({ error: 'Name, phone number, and message are required' });
    return;
  }
  const db = getDb();
  const now = new Date().toISOString();
  const enquiry = {
    id: `enq-${Date.now()}`,
    type: body.type === 'contact' || body.type === 'dealer' ? body.type : 'quote',
    customerName: String(body.customerName).trim(),
    companyName: body.companyName ? String(body.companyName).trim() : '',
    phone: String(body.phone).trim(),
    email: String(body.email || '').trim(),
    city: String(body.city || 'Karachi').trim(),
    tyreId: body.tyreId,
    tyreName: body.tyreName,
    requestedSize: body.requestedSize,
    quantity: body.quantity ? Number(body.quantity) : undefined,
    message: String(body.message).trim(),
    status: 'new' as const,
    notes: [],
    createdAt: now,
    updatedAt: now,
  };
  db.enquiries.unshift(enquiry);
  saveDb(db);
  res.status(201).json(enquiry);
});

app.patch('/api/enquiries/:id', requireAuth, (req, res) => {
  const db = getDb();
  const enquiry = db.enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }
  if (req.body?.status) {
    enquiry.status = req.body.status;
  }
  enquiry.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json(enquiry);
});

app.post('/api/enquiries/:id/notes', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  const enquiry = db.enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }
  if (!req.body?.note) {
    res.status(400).json({ error: 'Note text is required' });
    return;
  }
  enquiry.notes.push({
    id: `note-${Date.now()}`,
    author: adminUser.name,
    note: String(req.body.note).trim(),
    createdAt: new Date().toISOString(),
  });
  enquiry.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json(enquiry);
});

app.get('/api/enquiries/export', requireAuth, (_req, res) => {
  const db = getDb();
  const headers = ['ID', 'Type', 'Customer', 'Company', 'Phone', 'Email', 'City', 'Tyre', 'Size', 'Qty', 'Status', 'Created At'];
  const rows = db.enquiries.map((e) => [
    e.id,
    e.type,
    e.customerName,
    e.companyName || '',
    e.phone,
    e.email,
    e.city,
    e.tyreName || '',
    e.requestedSize || '',
    e.quantity || '',
    e.status,
    e.createdAt,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="good-luck-tyres-enquiries.csv"');
  res.send(csv);
});

// ================= DOWNLOADS, BANNERS, SETTINGS, STATS, LOGS =================
app.get('/api/downloads', (req, res) => {
  const db = getDb();
  const includeUnpublished =
    req.query.includeUnpublished === 'true' && Boolean(getSessionFromRequest(req));
  res.json(db.downloads.filter((d) => includeUnpublished || d.isPublished));
});

app.post('/api/downloads', requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.fileUrl) {
    res.status(400).json({ error: 'Title and file URL are required' });
    return;
  }
  const db = getDb();
  const item = {
    id: `dl-${Date.now()}`,
    title: String(body.title).trim(),
    description: String(body.description || ''),
    category: String(body.category || 'Technical Manual'),
    brandName: body.brandName,
    fileUrl: String(body.fileUrl).trim(),
    fileSize: String(body.fileSize || 'PDF Spec'),
    isPublished: body.isPublished !== false,
    createdAt: new Date().toISOString(),
  };
  db.downloads.unshift(item);
  saveDb(db);
  res.status(201).json(item);
});

app.delete('/api/downloads/:id', requireAuth, (req, res) => {
  const db = getDb();
  const idx = db.downloads.findIndex((d) => d.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Download item not found' });
    return;
  }
  db.downloads.splice(idx, 1);
  saveDb(db);
  res.json({ ok: true });
});

app.get('/api/banners', (req, res) => {
  const db = getDb();
  const includeInactive =
    req.query.includeInactive === 'true' && Boolean(getSessionFromRequest(req));
  const list = [...db.banners]
    .filter((b) => includeInactive || b.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((b) => ({
      ...b,
      imageUrl: normalizeAssetUrl(b.imageUrl) || TYRE_STUDIO_ASSETS.heroWarehouse,
    }));
  res.json(list);
});

app.put('/api/banners', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const incoming = req.body?.banners;
  if (!Array.isArray(incoming)) {
    res.status(400).json({ error: 'Banners array is required' });
    return;
  }

  const db = getDb();
  const normalized: Banner[] = incoming.map((b: Partial<Banner>, idx: number) => ({
    id: b.id || `bnr-${Date.now()}-${idx}`,
    title: String(b.title || 'Good Luck Tyres Commercial Stock').trim(),
    subtitle: String(b.subtitle || ''),
    ctaText: String(b.ctaText || 'Explore Tyre Catalogue'),
    ctaLink: String(b.ctaLink || '/tyres'),
    secondaryCtaText: b.secondaryCtaText || undefined,
    secondaryCtaLink: b.secondaryCtaLink || undefined,
    imageUrl: normalizeAssetUrl(b.imageUrl) || TYRE_STUDIO_ASSETS.heroWarehouse,
    isActive: b.isActive !== false,
    displayOrder: typeof b.displayOrder === 'number' ? b.displayOrder : idx + 1,
  }));

  normalized.sort((a, b) => a.displayOrder - b.displayOrder);
  db.banners = normalized;

  recordActivityLog(
    db,
    adminUser.name,
    'UPDATE_BANNERS',
    'Banner',
    'hero-slider',
    `Saved ${normalized.length} homepage slide(s) (${normalized.filter((x) => x.isActive).length} published)`
  );
  saveDb(db);

  const activeBanners = normalized.filter((b) => b.isActive);
  broadcastEvent('banners_updated', activeBanners);
  res.json(normalized);
});

app.get('/api/settings', (_req, res) => {
  res.json(getDb().settings);
});

app.put('/api/settings', requireAuth, (req, res) => {
  const adminUser = (req as Request & { adminUser?: SessionRecord }).adminUser!;
  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  recordActivityLog(
    db,
    adminUser.name,
    'UPDATE_SETTINGS',
    'Settings',
    'site',
    'Updated website branding & contact settings'
  );
  saveDb(db);
  broadcastEvent('settings_updated', db.settings);
  res.json(db.settings);
});

app.get('/api/stats', requireAuth, (_req, res) => {
  res.json(getDashboardStats(getDb()));
});

app.get('/api/activity-logs', requireAuth, (_req, res) => {
  res.json(getDb().activityLogs);
});

app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});
