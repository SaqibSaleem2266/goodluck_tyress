export type StockStatus = 'in_stock' | 'out_of_stock' | 'on_order';
export type PublishingStatus = 'published' | 'draft';

export interface TechnicalSpecs {
  rimSize?: string;
  overallDiameter?: string;
  sectionWidth?: string;
  maxLoadSingle?: string;
  maxLoadDual?: string;
  inflationPressure?: string;
  tkph?: string;
  originCountry?: string;
}

export interface Tyre {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  brandName?: string;
  categoryIds: string[];
  categoryNames?: string[];
  sizes: string[];
  plyRating: string;
  loadIndex: string;
  speedRating: string;
  treadPattern: string;
  treadDepth: string;
  constructionType: 'Radial' | 'Bias';
  application: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  technicalSpecs: TechnicalSpecs;
  stockStatus: StockStatus;
  stockQuantity: number;
  minimumStockAlert: number;
  pricePkr?: number;
  mainImage: string;
  galleryImages: string[];
  brochureUrl?: string;
  publishingStatus: PublishingStatus;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  websiteUrl?: string;
  isActive: boolean;
  isPublished: boolean;
  displayOrder: number;
  tyreCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  brandIds: string[];
  isActive: boolean;
  isPublished: boolean;
  displayOrder: number;
  tyreCount?: number;
}

export interface ApplicationType {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Dealer {
  id: string;
  companyName: string;
  city: string;
  region: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CorporateClient {
  id: string;
  name: string;
  sector: string;
  description: string;
  logo: string;
  isActive: boolean;
  displayOrder: number;
}

export interface EnquiryNote {
  id: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  type: 'quote' | 'contact' | 'dealer';
  customerName: string;
  companyName?: string;
  phone: string;
  email: string;
  city: string;
  tyreId?: string;
  tyreName?: string;
  requestedSize?: string;
  quantity?: number;
  message: string;
  status: 'new' | 'in_review' | 'quoted' | 'closed';
  notes: EnquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  brandName?: string;
  fileUrl: string;
  fileSize: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export interface WebsiteSettings {
  companyName: string;
  tagline: string;
  announcementText: string;
  primaryPhone: string;
  whatsappNumber: string;
  primaryEmail: string;
  headquartersAddress: string;
  portDepotAddress: string;
  businessHours: string;
  primaryColor: string;
  accentColor: string;
  footerAbout: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager';
  passwordHash: string;
  createdAt: string;
}

export interface InventoryHistory {
  id: string;
  tyreId: string;
  tyreName: string;
  sku: string;
  previousQuantity: number;
  newQuantity: number;
  changeDelta: number;
  previousStatus: StockStatus;
  newStatus: StockStatus;
  reason: string;
  updatedBy: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalTyres: number;
  publishedTyres: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockUnits: number;
  totalBrands: number;
  totalCategories: number;
  totalEnquiries: number;
  newEnquiriesCount: number;
  totalDealers: number;
}
