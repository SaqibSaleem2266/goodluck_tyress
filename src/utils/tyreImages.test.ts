import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TYRE_STUDIO_ASSETS,
  resolveBrandImage,
  resolveCategoryImage,
} from './tyreImages';

test('resolveBrandImage ignores external unsplash placeholders and maps brands to local tyre photography', () => {
  assert.equal(
    resolveBrandImage({
      slug: 'samson-tyre',
      name: 'Samson Tyre',
      coverImage: 'https://images.unsplash.com/photo-123456',
    }),
    TYRE_STUDIO_ASSETS.otr
  );

  assert.equal(
    resolveBrandImage({
      slug: 'advance-tyre',
      name: 'Advance Tyre',
      coverImage: '',
    }),
    TYRE_STUDIO_ASSETS.tbr
  );

  assert.equal(
    resolveBrandImage({
      slug: 'runway-tyre',
      name: 'Runway Tyre',
    }),
    TYRE_STUDIO_ASSETS.pcr
  );

  assert.equal(
    resolveBrandImage({
      slug: 'custom',
      name: 'Custom Brand',
      coverImage: '/uploads/custom-brand.png',
    }),
    '/uploads/custom-brand.png'
  );
});

test('resolveCategoryImage maps category slugs and names to matching tyre photographs', () => {
  assert.equal(
    resolveCategoryImage({ slug: 'otr-off-the-road', name: 'OTR – Off The Road' }),
    TYRE_STUDIO_ASSETS.otr
  );
  assert.equal(
    resolveCategoryImage({ slug: 'agriculture', name: 'Agriculture' }),
    TYRE_STUDIO_ASSETS.agri
  );
  assert.equal(
    resolveCategoryImage({ slug: 'industrial', name: 'Industrial' }),
    TYRE_STUDIO_ASSETS.industrial
  );
  assert.equal(
    resolveCategoryImage({ slug: 'suv-4x4', name: 'SUV / 4x4' }),
    TYRE_STUDIO_ASSETS.suv
  );
  assert.equal(
    resolveCategoryImage({ slug: 'light-truck-radial', name: 'Light Truck Radial' }),
    TYRE_STUDIO_ASSETS.lightTruck
  );
  assert.equal(
    resolveCategoryImage({ slug: 'pcr-passenger', name: 'PCR – Passenger Car Radial' }),
    TYRE_STUDIO_ASSETS.pcr
  );
  assert.equal(
    resolveCategoryImage({ slug: 'tbr-truck-bus-radial', name: 'TBR – Truck & Bus Radial' }),
    TYRE_STUDIO_ASSETS.tbr
  );
});
