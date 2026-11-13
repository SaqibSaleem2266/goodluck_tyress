import { StockStatus, Tyre } from '../types/index.ts';

export function calculateStockStatus(quantity: number): 'in_stock' | 'out_of_stock' {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 'out_of_stock';
  }
  return 'in_stock';
}

export interface TyreFilterCriteria {
  brandId?: string;
  categoryId?: string;
  application?: string;
  size?: string;
  constructionType?: string;
  stockStatus?: StockStatus | 'all';
  searchQuery?: string;
  includeDrafts?: boolean;
}

export function filterTyres(tyres: Tyre[], criteria: TyreFilterCriteria): Tyre[] {
  const query = criteria.searchQuery?.trim().toLowerCase() || '';

  return tyres.filter((tyre) => {
    if (!criteria.includeDrafts && tyre.publishingStatus !== 'published') {
      return false;
    }

    if (criteria.brandId && criteria.brandId !== 'all' && tyre.brandId !== criteria.brandId) {
      return false;
    }

    if (
      criteria.categoryId &&
      criteria.categoryId !== 'all' &&
      !tyre.categoryIds.includes(criteria.categoryId)
    ) {
      return false;
    }

    if (
      criteria.application &&
      criteria.application !== 'all' &&
      tyre.application.toLowerCase() !== criteria.application.toLowerCase()
    ) {
      return false;
    }

    if (
      criteria.size &&
      criteria.size !== 'all' &&
      !tyre.sizes.some((s) => s.toLowerCase() === criteria.size!.toLowerCase())
    ) {
      return false;
    }

    if (
      criteria.constructionType &&
      criteria.constructionType !== 'all' &&
      tyre.constructionType.toLowerCase() !== criteria.constructionType.toLowerCase()
    ) {
      return false;
    }

    if (
      criteria.stockStatus &&
      criteria.stockStatus !== 'all' &&
      tyre.stockStatus !== criteria.stockStatus
    ) {
      return false;
    }

    if (query) {
      const searchable = [
        tyre.name,
        tyre.sku,
        tyre.brandName || '',
        tyre.treadPattern,
        tyre.application,
        tyre.shortDescription,
        ...tyre.sizes,
        ...(tyre.categoryNames || []),
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeCsvCell(value: string | number | undefined): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateInventoryCSV(tyres: Tyre[]): string {
  const headers = [
    'SKU',
    'Model Name',
    'Brand',
    'Categories',
    'Sizes',
    'Construction',
    'Ply Rating',
    'Load/Speed Index',
    'Stock Quantity',
    'Min Alert',
    'Stock Status',
    'Publishing Status',
  ];

  const rows = tyres.map((tyre) => [
    escapeCsvCell(tyre.sku),
    escapeCsvCell(tyre.name),
    escapeCsvCell(tyre.brandName || tyre.brandId),
    escapeCsvCell((tyre.categoryNames || tyre.categoryIds).join(' | ')),
    escapeCsvCell(tyre.sizes.join(' | ')),
    escapeCsvCell(tyre.constructionType),
    escapeCsvCell(tyre.plyRating),
    escapeCsvCell(`${tyre.loadIndex}${tyre.speedRating}`),
    escapeCsvCell(tyre.stockQuantity),
    escapeCsvCell(tyre.minimumStockAlert),
    escapeCsvCell(tyre.stockStatus),
    escapeCsvCell(tyre.publishingStatus),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
