import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStockStatus,
  filterTyres,
  generateInventoryCSV,
  generateSlug,
} from './inventory';
import {
  COMPANY_STATS,
  computeAnimatedStatValue,
  formatAnimatedStat,
} from './statsFormat';
import { Tyre } from '../types/index';

const sampleTyres: Tyre[] = [
  {
    id: 't1',
    name: 'Advance GL285A Steer Radial',
    slug: 'advance-gl285a',
    sku: 'ADV-285A-12R',
    brandId: 'brand-advance',
    brandName: 'Advance Tyre',
    categoryIds: ['cat-tbr'],
    categoryNames: ['TBR – Truck & Bus Radial'],
    sizes: ['12R22.5', '295/80R22.5'],
    plyRating: '18PR',
    loadIndex: '152/149',
    speedRating: 'M',
    treadPattern: 'GL285A',
    treadDepth: '16.5mm',
    constructionType: 'Radial',
    application: 'Long Haul / Steer Axle',
    shortDescription: 'Highway steer radial',
    fullDescription: 'Full description',
    features: ['Cool running'],
    technicalSpecs: {},
    stockStatus: 'in_stock',
    stockQuantity: 120,
    minimumStockAlert: 20,
    mainImage: '/images/tyre_tbr_commercial_1794552282686.jpg',
    galleryImages: [],
    publishingStatus: 'published',
    isFeatured: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 't2',
    name: 'Samson GL699D Draft Loader',
    slug: 'samson-gl699d',
    sku: 'SAM-699D-235',
    brandId: 'brand-samson',
    brandName: 'Samson Tyre',
    categoryIds: ['cat-otr'],
    categoryNames: ['OTR – Off The Road'],
    sizes: ['23.5R25'],
    plyRating: '2 Star',
    loadIndex: '195',
    speedRating: 'A2',
    treadPattern: 'GL699D',
    treadDepth: '38mm',
    constructionType: 'Radial',
    application: 'Mining & Quarry',
    shortDescription: 'Quarry L-5 loader tyre',
    fullDescription: 'Full quarry description',
    features: ['Cut resistant'],
    technicalSpecs: {},
    stockStatus: 'out_of_stock',
    stockQuantity: 0,
    minimumStockAlert: 5,
    mainImage: '/images/tyre_otr_earthmover_1794552282861.jpg',
    galleryImages: [],
    publishingStatus: 'draft',
    isFeatured: false,
    displayOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

test('calculateStockStatus returns in_stock for positive quantities and out_of_stock for zero or negative', () => {
  assert.equal(calculateStockStatus(45), 'in_stock');
  assert.equal(calculateStockStatus(0), 'out_of_stock');
  assert.equal(calculateStockStatus(-3), 'out_of_stock');
});

test('filterTyres filters out drafts by default and matches brand, size, and query', () => {
  assert.equal(filterTyres(sampleTyres, {}).length, 1);
  assert.equal(filterTyres(sampleTyres, { includeDrafts: true }).length, 2);
  assert.equal(
    filterTyres(sampleTyres, { size: '295/80R22.5' }).map((t) => t.id).join(','),
    't1'
  );
  assert.equal(
    filterTyres(sampleTyres, { searchQuery: 'steer' }).map((t) => t.id).join(','),
    't1'
  );
  assert.equal(filterTyres(sampleTyres, { brandId: 'brand-samson' }).length, 0);
});

test('generateSlug and generateInventoryCSV produce valid escaped output', () => {
  assert.equal(generateSlug('Advance GL285A / Steer!'), 'advance-gl285a-steer');
  const csv = generateInventoryCSV(sampleTyres);
  assert.match(csv, /ADV-285A-12R/);
  assert.match(csv, /12R22\.5 \| 295\/80R22\.5/);
});

test('statsFormat computes strictly ascending numbers ending at target values', () => {
  const yearsStat = COMPANY_STATS[0];
  const atStart = computeAnimatedStatValue(yearsStat.target, 0);
  const atMid = computeAnimatedStatValue(yearsStat.target, 0.5);
  const atEnd = computeAnimatedStatValue(yearsStat.target, 1);

  assert.equal(atStart, 0);
  assert.ok(atMid > atStart && atMid < atEnd);
  assert.equal(atEnd, 35);
  assert.equal(formatAnimatedStat(atEnd, yearsStat.suffix), '35+');
});
