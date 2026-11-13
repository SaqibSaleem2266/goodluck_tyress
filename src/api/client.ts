import {
  ActivityLog,
  ApplicationType,
  Banner,
  Brand,
  Category,
  CorporateClient,
  DashboardStats,
  Dealer,
  DownloadItem,
  Enquiry,
  InventoryHistory,
  StockStatus,
  Tyre,
  WebsiteSettings,
} from '../types/index.ts';

const TOKEN_KEY = 'glt_admin_token';
const USER_KEY = 'glt_admin_user';

export interface StoredAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: (): StoredAdminUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: StoredAdminUser) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && path.startsWith('/api/') && !path.includes('/api/auth/login')) {
      authStorage.clearAll();
    }
    let message = `Request failed (${res.status})`;
    try {
      const errData = await res.json();
      if (errData?.error) message = errData.error;
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: StoredAdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  verifySession: () => request<{ user: StoredAdminUser }>('/api/auth/verify'),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Tyres
  getTyres: (includeDrafts = false) =>
    request<Tyre[]>(`/api/tyres${includeDrafts ? '?includeDrafts=true' : ''}`),
  getTyre: (idOrSlug: string) => request<Tyre>(`/api/tyres/${encodeURIComponent(idOrSlug)}`),
  createTyre: (data: Partial<Tyre>) =>
    request<Tyre>('/api/tyres', { method: 'POST', body: JSON.stringify(data) }),
  updateTyre: (id: string, data: Partial<Tyre>) =>
    request<Tyre>(`/api/tyres/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTyre: (id: string) => request<{ ok: boolean }>(`/api/tyres/${id}`, { method: 'DELETE' }),
  duplicateTyre: (id: string) =>
    request<Tyre>(`/api/tyres/${id}/duplicate`, { method: 'POST' }),

  // Stock & Inventory
  updateStock: (
    id: string,
    payload: { stockQuantity?: number; stockStatus?: StockStatus; reason?: string }
  ) =>
    request<{ tyre: Tyre; historyEntry: InventoryHistory }>(`/api/tyres/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getInventoryHistory: () => request<InventoryHistory[]>('/api/inventory/history'),
  exportInventoryCsvUrl: () => '/api/inventory/export',

  // Brands
  getBrands: (includeInactive = false) =>
    request<Brand[]>(`/api/brands${includeInactive ? '?includeInactive=true' : ''}`),
  createBrand: (data: Partial<Brand>) =>
    request<Brand>('/api/brands', { method: 'POST', body: JSON.stringify(data) }),
  updateBrand: (id: string, data: Partial<Brand>) =>
    request<Brand>(`/api/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBrand: (id: string) =>
    request<{ ok: boolean }>(`/api/brands/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (includeInactive = false) =>
    request<Category[]>(`/api/categories${includeInactive ? '?includeInactive=true' : ''}`),
  createCategory: (data: Partial<Category>) =>
    request<Category>('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<Category>) =>
    request<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    request<{ ok: boolean }>(`/api/categories/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: () => request<ApplicationType[]>('/api/applications'),

  // Dealers
  getDealers: (includeInactive = false) =>
    request<Dealer[]>(`/api/dealers${includeInactive ? '?includeInactive=true' : ''}`),
  createDealer: (data: Partial<Dealer>) =>
    request<Dealer>('/api/dealers', { method: 'POST', body: JSON.stringify(data) }),
  updateDealer: (id: string, data: Partial<Dealer>) =>
    request<Dealer>(`/api/dealers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDealer: (id: string) =>
    request<{ ok: boolean }>(`/api/dealers/${id}`, { method: 'DELETE' }),

  // Corporate Clients
  getCorporateClients: (includeInactive = false) =>
    request<CorporateClient[]>(
      `/api/clients${includeInactive ? '?includeInactive=true' : ''}`
    ),
  createCorporateClient: (data: Partial<CorporateClient>) =>
    request<CorporateClient>('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateCorporateClient: (id: string, data: Partial<CorporateClient>) =>
    request<CorporateClient>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCorporateClient: (id: string) =>
    request<{ ok: boolean }>(`/api/clients/${id}`, { method: 'DELETE' }),

  // Enquiries
  getEnquiries: () => request<Enquiry[]>('/api/enquiries'),
  submitEnquiry: (data: Partial<Enquiry>) =>
    request<Enquiry>('/api/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateEnquiryStatus: (id: string, status: Enquiry['status']) =>
    request<Enquiry>(`/api/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  addEnquiryNote: (id: string, note: string) =>
    request<Enquiry>(`/api/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  exportEnquiriesCsvUrl: () => '/api/enquiries/export',

  // Downloads
  getDownloads: (includeUnpublished = false) =>
    request<DownloadItem[]>(
      `/api/downloads${includeUnpublished ? '?includeUnpublished=true' : ''}`
    ),
  createDownload: (data: Partial<DownloadItem>) =>
    request<DownloadItem>('/api/downloads', { method: 'POST', body: JSON.stringify(data) }),
  deleteDownload: (id: string) =>
    request<{ ok: boolean }>(`/api/downloads/${id}`, { method: 'DELETE' }),

  // Banners
  getBanners: (includeInactive = false) =>
    request<Banner[]>(`/api/banners${includeInactive ? '?includeInactive=true' : ''}`),
  updateBanners: (banners: Banner[]) =>
    request<Banner[]>('/api/banners', { method: 'PUT', body: JSON.stringify({ banners }) }),

  // Settings
  getSettings: () => request<WebsiteSettings>('/api/settings'),
  updateSettings: (settings: Partial<WebsiteSettings>) =>
    request<WebsiteSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Dashboard & Activity
  getDashboardStats: () => request<DashboardStats>('/api/stats'),
  getActivityLogs: () => request<ActivityLog[]>('/api/activity-logs'),

  // File Upload
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
