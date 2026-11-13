export const TYRE_STUDIO_ASSETS = {
  heroWarehouse: '/images/hero_tyres_warehouse_1794552283485.jpg',
  tbr: '/images/tyre_tbr_commercial_1794552282686.jpg',
  otr: '/images/tyre_otr_earthmover_1794552282861.jpg',
  pcr: '/images/tyre_pcr_passenger_1794552283585.jpg',
  agri: '/images/tyre_agri_tractor_1794552283155.jpg',
  industrial: '/images/tyre_industrial_forklift_1794552284170.jpg',
  lightTruck: '/images/tyre_light_truck_1794552283312.jpg',
  suv: '/images/tyre_suv_allterrain_1794552285744.jpg',
} as const;

const KNOWN_CURRENT_ASSETS = new Set<string>(Object.values(TYRE_STUDIO_ASSETS));

export function normalizeAssetUrl(url?: string): string | undefined {
  if (!url) return url;
  const trimmed = url.trim();
  if (trimmed.startsWith('/src/assets/images/')) {
    const mapped = `/images/${trimmed.slice('/src/assets/images/'.length)}`;
    if (KNOWN_CURRENT_ASSETS.has(mapped)) return mapped;
  }
  return trimmed;
}

function isValidLocalOrUploadedImage(url?: string): boolean {
  const normalized = normalizeAssetUrl(url);
  if (!normalized) return false;
  if (normalized.includes('images.unsplash.com') || normalized.includes('unsplash.com')) return false;
  if (normalized.startsWith('/uploads/') || normalized.startsWith('data:image/')) return true;
  if (normalized.startsWith('/images/')) {
    return KNOWN_CURRENT_ASSETS.has(normalized);
  }
  return normalized.startsWith('http://') || normalized.startsWith('https://');
}

export function resolveBrandImage(brand: {
  slug?: string;
  name?: string;
  coverImage?: string;
}): string {
  const normalized = normalizeAssetUrl(brand.coverImage);
  if (isValidLocalOrUploadedImage(normalized)) {
    return normalized!;
  }

  const key = `${brand.slug || ''} ${brand.name || ''}`.toLowerCase();
  if (key.includes('super-samson') || key.includes('super samson')) return TYRE_STUDIO_ASSETS.agri;
  if (key.includes('samson')) return TYRE_STUDIO_ASSETS.otr;
  if (key.includes('runway')) return TYRE_STUDIO_ASSETS.pcr;
  if (key.includes('gt-radial') || key.includes('gt radial')) return TYRE_STUDIO_ASSETS.suv;
  if (key.includes('magnum')) return TYRE_STUDIO_ASSETS.lightTruck;
  if (key.includes('advance')) return TYRE_STUDIO_ASSETS.tbr;
  return TYRE_STUDIO_ASSETS.tbr;
}

export function resolveCategoryImage(category: {
  slug?: string;
  name?: string;
  image?: string;
}): string {
  const normalized = normalizeAssetUrl(category.image);
  if (isValidLocalOrUploadedImage(normalized)) {
    return normalized!;
  }

  const key = `${category.slug || ''} ${category.name || ''}`.toLowerCase();
  if (key.includes('otr') || key.includes('off the road') || key.includes('earth')) {
    return TYRE_STUDIO_ASSETS.otr;
  }
  if (key.includes('agri') || key.includes('tractor') || key.includes('farm')) {
    return TYRE_STUDIO_ASSETS.agri;
  }
  if (key.includes('industrial') || key.includes('forklift') || key.includes('port')) {
    return TYRE_STUDIO_ASSETS.industrial;
  }
  if (key.includes('suv') || key.includes('4x4') || key.includes('terrain')) {
    return TYRE_STUDIO_ASSETS.suv;
  }
  if (
    key.includes('light-truck') ||
    key.includes('light truck') ||
    key.includes('van') ||
    key.includes('ultra')
  ) {
    return TYRE_STUDIO_ASSETS.lightTruck;
  }
  if (key.includes('pcr') || key.includes('passenger')) {
    return TYRE_STUDIO_ASSETS.pcr;
  }
  return TYRE_STUDIO_ASSETS.tbr;
}
