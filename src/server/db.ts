import fs from 'fs';
import os from 'os';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  ActivityLog,
  AdminUser,
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
  Tyre,
  WebsiteSettings,
} from '../types/index.ts';
import { TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';

export interface DatabaseSchema {
  users: AdminUser[];
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  tyres: Tyre[];
  dealers: Dealer[];
  corporateClients: CorporateClient[];
  enquiries: Enquiry[];
  downloads: DownloadItem[];
  banners: Banner[];
  settings: WebsiteSettings;
  inventoryHistory: InventoryHistory[];
  activityLogs: ActivityLog[];
}

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'good-luck-tyres-data')
  : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function createInitialDatabase(): DatabaseSchema {
  const now = new Date().toISOString();
  const defaultPasswordHash = bcrypt.hashSync('Admin@GLT2026!', 10);

  const brands: Brand[] = [
    {
      id: 'brand-advance',
      name: 'Advance Tyre',
      slug: 'advance-tyre',
      description:
        'Flagship commercial TBR and heavy industrial radial engineering designed for high-tonnage long-haul transport and multi-retread casing endurance.',
      logo: TYRE_STUDIO_ASSETS.tbr,
      coverImage: TYRE_STUDIO_ASSETS.tbr,
      websiteUrl: 'https://www.advancetyre.com',
      isActive: true,
      isPublished: true,
      displayOrder: 1,
    },
    {
      id: 'brand-samson',
      name: 'Samson Tyre',
      slug: 'samson-tyre',
      description:
        'Heavy-duty Off-The-Road (OTR), mining dumper, wheel loader, and port logistics tyres compounded for extreme quarry and civil works.',
      logo: TYRE_STUDIO_ASSETS.otr,
      coverImage: TYRE_STUDIO_ASSETS.otr,
      websiteUrl: 'https://www.samsontyre.com',
      isActive: true,
      isPublished: true,
      displayOrder: 2,
    },
    {
      id: 'brand-runway',
      name: 'Runway Tyre',
      slug: 'runway-tyre',
      description:
        'Precision passenger car radials, light commercial van tyres, and highway touring patterns balancing wet braking grip and tread longevity.',
      logo: TYRE_STUDIO_ASSETS.pcr,
      coverImage: TYRE_STUDIO_ASSETS.pcr,
      websiteUrl: 'https://www.runwaytyres.com',
      isActive: true,
      isPublished: true,
      displayOrder: 3,
    },
    {
      id: 'brand-gt-radial',
      name: 'GT Radial',
      slug: 'gt-radial',
      description:
        'Global tier-one passenger, SUV/4x4 all-terrain, and regional commercial radial engineering certified to ECE and DOT international standards.',
      logo: TYRE_STUDIO_ASSETS.suv,
      coverImage: TYRE_STUDIO_ASSETS.suv,
      websiteUrl: 'https://www.gtradial.com',
      isActive: true,
      isPublished: true,
      displayOrder: 4,
    },
    {
      id: 'brand-magnum',
      name: 'Magnum-V',
      slug: 'magnum-v',
      description:
        'Reinforced light truck radial and bias-ply tyres engineered for urban cargo vans, intercity pick-ups, and regional shuttle fleets.',
      logo: TYRE_STUDIO_ASSETS.lightTruck,
      coverImage: TYRE_STUDIO_ASSETS.lightTruck,
      websiteUrl: 'https://www.goodlucktyres.com',
      isActive: true,
      isPublished: true,
      displayOrder: 5,
    },
    {
      id: 'brand-super-samson',
      name: 'Super Samson',
      slug: 'super-samson',
      description:
        'High-flotation agricultural tractor lug tyres, harvester radials, and deep-tread earthmoving implements built for maximum drawbar traction.',
      logo: TYRE_STUDIO_ASSETS.agri,
      coverImage: TYRE_STUDIO_ASSETS.agri,
      websiteUrl: 'https://www.goodlucktyres.com',
      isActive: true,
      isPublished: true,
      displayOrder: 6,
    },
  ];

  const categories: Category[] = [
    {
      id: 'cat-tbr',
      name: 'TBR – Truck & Bus Radial',
      slug: 'tbr-truck-bus-radial',
      description:
        'All-steel radial tyres for highway tractor heads, semi-trailers, cargo haulers, and intercity passenger coaches.',
      image: TYRE_STUDIO_ASSETS.tbr,
      brandIds: ['brand-advance', 'brand-samson', 'brand-gt-radial'],
      isActive: true,
      isPublished: true,
      displayOrder: 1,
    },
    {
      id: 'cat-otr',
      name: 'OTR – Off The Road',
      slug: 'otr-off-the-road',
      description:
        'Cut-resistant E-3, E-4, and L-5 tyres for articulated dump trucks, wheel loaders, graders, and quarry earthmovers.',
      image: TYRE_STUDIO_ASSETS.otr,
      brandIds: ['brand-samson', 'brand-advance', 'brand-super-samson'],
      isActive: true,
      isPublished: true,
      displayOrder: 2,
    },
    {
      id: 'cat-pcr',
      name: 'PCR – Passenger Car Radial',
      slug: 'pcr-passenger-car-radial',
      description:
        'Low-noise touring and ultra-high-performance radials for sedans, fleet vehicles, and executive transport.',
      image: TYRE_STUDIO_ASSETS.pcr,
      brandIds: ['brand-runway', 'brand-gt-radial'],
      isActive: true,
      isPublished: true,
      displayOrder: 3,
    },
    {
      id: 'cat-agri',
      name: 'Agriculture',
      slug: 'agriculture',
      description:
        'Deep R-1 and R-1W traction lugs for heavy farm tractors, combine harvesters, and irrigation trailers.',
      image: TYRE_STUDIO_ASSETS.agri,
      brandIds: ['brand-super-samson', 'brand-advance'],
      isActive: true,
      isPublished: true,
      displayOrder: 4,
    },
    {
      id: 'cat-industrial',
      name: 'Industrial',
      slug: 'industrial',
      description:
        'Heavy-ply pneumatic and solid resilient tyres for forklifts, reach stackers, empty container handlers, and port cranes.',
      image: TYRE_STUDIO_ASSETS.industrial,
      brandIds: ['brand-advance', 'brand-samson'],
      isActive: true,
      isPublished: true,
      displayOrder: 5,
    },
    {
      id: 'cat-suv',
      name: 'SUV / 4x4',
      slug: 'suv-4x4',
      description:
        'All-Terrain (A/T) and Mud-Terrain (M/T) reinforced sidewall tyres for utility pickups and off-road project vehicles.',
      image: TYRE_STUDIO_ASSETS.suv,
      brandIds: ['brand-gt-radial', 'brand-runway'],
      isActive: true,
      isPublished: true,
      displayOrder: 6,
    },
    {
      id: 'cat-ltr',
      name: 'Light Truck Radial',
      slug: 'light-truck-radial',
      description:
        'Commercial LT steel-belted radials for 1-to-5 ton delivery vans, urban logistics trucks, and shuttle buses.',
      image: TYRE_STUDIO_ASSETS.lightTruck,
      brandIds: ['brand-magnum', 'brand-gt-radial', 'brand-runway'],
      isActive: true,
      isPublished: true,
      displayOrder: 7,
    },
    {
      id: 'cat-ltb',
      name: 'Light Truck Bias',
      slug: 'light-truck-bias',
      description:
        'Heavy nylon-cord bias tyres built for overload resilience on rugged rural and municipal service routes.',
      image: TYRE_STUDIO_ASSETS.lightTruck,
      brandIds: ['brand-magnum', 'brand-samson'],
      isActive: true,
      isPublished: true,
      displayOrder: 8,
    },
    {
      id: 'cat-otr-radial',
      name: 'OTR Radial',
      slug: 'otr-radial',
      description:
        'High-TKPH all-steel OTR radials engineered for continuous shift quarry haulage and port straddle carriers.',
      image: TYRE_STUDIO_ASSETS.otr,
      brandIds: ['brand-samson', 'brand-advance'],
      isActive: true,
      isPublished: true,
      displayOrder: 9,
    },
  ];

  const applications: ApplicationType[] = [
    {
      id: 'app-long-haul',
      name: 'Long Haul / Steer Axle',
      slug: 'long-haul-steer',
      description: 'Highway prime movers and interstate cargo fleets',
    },
    {
      id: 'app-drive-axle',
      name: 'Drive Axle / Regional',
      slug: 'drive-axle-regional',
      description: 'High-torque drive axle traction on mixed paved and regional routes',
    },
    {
      id: 'app-mining',
      name: 'Mining & Quarry',
      slug: 'mining-quarry',
      description: 'Severe rocky quarry faces, coal pits, and cement plants',
    },
    {
      id: 'app-port',
      name: 'Port & Industrial Handling',
      slug: 'port-industrial',
      description: 'Container yards, reach stackers, and factory forklifts',
    },
    {
      id: 'app-agriculture',
      name: 'Agricultural Field',
      slug: 'agricultural-field',
      description: 'Soft soil traction for tractors and heavy harvesters',
    },
    {
      id: 'app-urban',
      name: 'Urban Commercial Van',
      slug: 'urban-commercial',
      description: 'High-stop distribution vans and light freight trucks',
    },
    {
      id: 'app-all-terrain',
      name: 'SUV & 4x4 All-Terrain',
      slug: 'suv-all-terrain',
      description: 'On-road comfort combined with gravel and trail durability',
    },
  ];

  const tyres: Tyre[] = [
    {
      id: 'tyre-1',
      name: 'Advance GL285A Long-Haul Steer Radial',
      slug: 'advance-gl285a-steer-radial',
      sku: 'ADV-GL285A-12R',
      brandId: 'brand-advance',
      brandName: 'Advance Tyre',
      categoryIds: ['cat-tbr'],
      categoryNames: ['TBR – Truck & Bus Radial'],
      sizes: ['12R22.5', '295/80R22.5', '315/80R22.5'],
      plyRating: '18PR',
      loadIndex: '152/149',
      speedRating: 'M',
      treadPattern: 'GL285A Rib Steer',
      treadDepth: '16.5mm',
      constructionType: 'Radial',
      application: 'Long Haul / Steer Axle',
      shortDescription:
        'Four-groove highway steer & all-position radial engineered for straight tracking, low rolling resistance, and cool casing operation.',
      fullDescription:
        'The Advance GL285A delivers exceptional directional stability on Pakistani national highways (M-2 / N-5). Built with a 4-belt all-steel carcass and stone-ejector rib geometry to guard against belt corrosion and permit up to 3 retread cycles.',
      features: [
        'Stone-ejector platform protects belt package from highway gravel damage',
        'Cool-running tread compound minimizes heat buildup under heavy summer loads',
        'High-tensile bead bundle reinforces rim seating for dual or steer fitment',
        'Multi-retreadable 4-belt all-steel casing',
      ],
      technicalSpecs: {
        rimSize: '9.00 x 22.5',
        overallDiameter: '1084 mm',
        sectionWidth: '300 mm',
        maxLoadSingle: '3550 kg',
        maxLoadDual: '3250 kg',
        inflationPressure: '930 kPa (135 PSI)',
        tkph: 'Highway Rated',
        originCountry: 'China / Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 184,
      minimumStockAlert: 25,
      pricePkr: 98500,
      mainImage: TYRE_STUDIO_ASSETS.tbr,
      galleryImages: [TYRE_STUDIO_ASSETS.tbr],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-2',
      name: 'Advance GL672D Heavy Drive Traction',
      slug: 'advance-gl672d-drive-traction',
      sku: 'ADV-GL672D-315',
      brandId: 'brand-advance',
      brandName: 'Advance Tyre',
      categoryIds: ['cat-tbr'],
      categoryNames: ['TBR – Truck & Bus Radial'],
      sizes: ['315/80R22.5', '12.00R20'],
      plyRating: '20PR',
      loadIndex: '156/150',
      speedRating: 'K',
      treadPattern: 'GL672D Open Shoulder Lug',
      treadDepth: '22.0mm',
      constructionType: 'Radial',
      application: 'Drive Axle / Regional',
      shortDescription:
        'Aggressive open-shoulder drive lug radial built for steep gradients, high-torque prime movers, and mixed highway/regional haulage.',
      fullDescription:
        'Designed for 6x4 prime movers operating along the Karakoram and CPEC corridors. Deep 22mm directional blocks optimize traction under wet or loose aggregate surfaces while resisting heel-toe irregular wear.',
      features: [
        '22.0mm deep traction lug extends first-life mileage by 25%',
        'Open shoulder grooves maximize mud and water evacuation',
        'Cut-resistant regional compound resists tearing on gravel yards',
      ],
      technicalSpecs: {
        rimSize: '9.00 x 22.5',
        overallDiameter: '1076 mm',
        sectionWidth: '312 mm',
        maxLoadSingle: '4000 kg',
        maxLoadDual: '3350 kg',
        inflationPressure: '850 kPa (123 PSI)',
        tkph: 'Regional Rated',
        originCountry: 'China / Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 112,
      minimumStockAlert: 20,
      pricePkr: 109000,
      mainImage: TYRE_STUDIO_ASSETS.tbr,
      galleryImages: [TYRE_STUDIO_ASSETS.tbr],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-3',
      name: 'Samson GL699A Mining & Quarry E-4',
      slug: 'samson-gl699a-mining-e4',
      sku: 'SAM-GL699A-235',
      brandId: 'brand-samson',
      brandName: 'Samson Tyre',
      categoryIds: ['cat-otr', 'cat-otr-radial'],
      categoryNames: ['OTR – Off The Road', 'OTR Radial'],
      sizes: ['23.5R25', '26.5R25', '29.5R25'],
      plyRating: '2 Star (E-4)',
      loadIndex: '201/195',
      speedRating: 'B',
      treadPattern: 'GL699A Deep Rock Lug',
      treadDepth: '38.0mm',
      constructionType: 'Radial',
      application: 'Mining & Quarry',
      shortDescription:
        'Extra-deep E-4/L-4 mining rock-lug radial engineered for articulated dumpers and wheel loaders operating on abrasive granite and limestone.',
      fullDescription:
        'Samson GL699A features a massive 38mm non-directional lug pattern paired with reinforced sidewall protectors to guard against rock cuts in cement quarries and hydropower excavation sites.',
      features: [
        'Heavy-duty cut and chip resistant mining compound',
        'Reinforced shoulder and sidewall buttress against sharp rock punctures',
        'Wide flat footprint stabilizes 40-ton dump truck cornering',
      ],
      technicalSpecs: {
        rimSize: '19.50 / 2.5-25',
        overallDiameter: '1615 mm',
        sectionWidth: '595 mm',
        maxLoadSingle: '14500 kg',
        maxLoadDual: 'N/A',
        inflationPressure: '650 kPa',
        tkph: '260 TKPH',
        originCountry: 'China / Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 34,
      minimumStockAlert: 8,
      pricePkr: 545000,
      mainImage: TYRE_STUDIO_ASSETS.otr,
      galleryImages: [TYRE_STUDIO_ASSETS.otr],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-4',
      name: 'Samson GL073A Wheel Loader L-5 Smooth Lug',
      slug: 'samson-gl073a-loader-l5',
      sku: 'SAM-GL073A-175',
      brandId: 'brand-samson',
      brandName: 'Samson Tyre',
      categoryIds: ['cat-otr', 'cat-otr-radial'],
      categoryNames: ['OTR – Off The Road', 'OTR Radial'],
      sizes: ['17.5R25', '20.5R25', '23.5R25'],
      plyRating: '2 Star (L-5)',
      loadIndex: '182',
      speedRating: 'A2',
      treadPattern: 'GL073A Extra-Deep L-5',
      treadDepth: '56.0mm',
      constructionType: 'Radial',
      application: 'Mining & Quarry',
      shortDescription:
        'Severe-service L-5 quarry loader radial with extra-thick undertread protection for crushing plants and slag handling.',
      fullDescription:
        'Engineered specifically for front-end wheel loaders operating in extreme quarry face and hot slag applications. Its 56mm L-5 tread delivers maximum puncture immunity.',
      features: [
        '56mm L-5 extreme depth reduces downtime at crusher hoppers',
        'Thickened bead guard prevents rim flange debris intrusion',
        'All-steel radial belt assembly cushions severe loader bucket loads',
      ],
      technicalSpecs: {
        rimSize: '14.00 / 1.5-25',
        overallDiameter: '1365 mm',
        sectionWidth: '445 mm',
        maxLoadSingle: '8500 kg',
        maxLoadDual: 'N/A',
        inflationPressure: '575 kPa',
        tkph: '195 TKPH',
        originCountry: 'China / Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 16,
      minimumStockAlert: 6,
      pricePkr: 365000,
      mainImage: TYRE_STUDIO_ASSETS.otr,
      galleryImages: [TYRE_STUDIO_ASSETS.otr],
      publishingStatus: 'published',
      isFeatured: false,
      displayOrder: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-5',
      name: 'Advance OB-502 Port Reach Stacker Heavy Ply',
      slug: 'advance-ob502-port-reach-stacker',
      sku: 'ADV-OB502-1800',
      brandId: 'brand-advance',
      brandName: 'Advance Tyre',
      categoryIds: ['cat-industrial'],
      categoryNames: ['Industrial'],
      sizes: ['18.00-25', '12.00-20', '7.00-12'],
      plyRating: '40PR',
      loadIndex: '207',
      speedRating: 'A5',
      treadPattern: 'OB-502 IND-4 Block',
      treadDepth: '48.0mm',
      constructionType: 'Bias',
      application: 'Port & Industrial Handling',
      shortDescription:
        '40-Ply industrial port terminal tyre engineered for 45-ton container reach stackers, empty container handlers, and dock cranes.',
      fullDescription:
        'Built for continuous container lifting operations at Port Qasim and KICT terminals. Massive square shoulder profile maximizes lateral stability when lifting high-cube containers.',
      features: [
        'Heavy 40PR nylon casing prevents sidewall flex during high lifts',
        'Abrasion-resistant port tarmac rubber compound',
        'Thick rim-guard bead protects against curb impacts',
      ],
      technicalSpecs: {
        rimSize: '13.00-25',
        overallDiameter: '1645 mm',
        sectionWidth: '498 mm',
        maxLoadSingle: '17500 kg',
        maxLoadDual: 'N/A',
        inflationPressure: '1000 kPa',
        tkph: 'Port Rated',
        originCountry: 'China / Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 14,
      minimumStockAlert: 10,
      pricePkr: 418000,
      mainImage: TYRE_STUDIO_ASSETS.industrial,
      galleryImages: [TYRE_STUDIO_ASSETS.industrial],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-6',
      name: 'Runway Enduro HP Highway Touring Radial',
      slug: 'runway-enduro-hp-touring',
      sku: 'RUN-ENDURO-205',
      brandId: 'brand-runway',
      brandName: 'Runway Tyre',
      categoryIds: ['cat-pcr'],
      categoryNames: ['PCR – Passenger Car Radial'],
      sizes: ['195/65R15', '205/55R16', '215/60R16'],
      plyRating: '4PR (XL)',
      loadIndex: '94',
      speedRating: 'V',
      treadPattern: 'Enduro Asymmetric',
      treadDepth: '8.2mm',
      constructionType: 'Radial',
      application: 'Urban Commercial Van',
      shortDescription:
        'Quiet asymmetric silica-compound passenger radial offering crisp wet braking performance and extended commuter mileage.',
      fullDescription:
        'Runway Enduro HP combines four wide circumferential drainage channels with variable-pitch shoulder blocks to keep executive sedans and fleet passenger vehicles stable and quiet at motorway speeds.',
      features: [
        'Silica-enriched compound shortens wet braking distance',
        'Continuous center rib improves high-speed steering response',
        'Low acoustic pitch geometry reduces cabin road hum',
      ],
      technicalSpecs: {
        rimSize: '6.5J x 16',
        overallDiameter: '632 mm',
        sectionWidth: '214 mm',
        maxLoadSingle: '670 kg',
        maxLoadDual: 'N/A',
        inflationPressure: '340 kPa (50 PSI)',
        originCountry: 'Indonesia / China',
      },
      stockStatus: 'in_stock',
      stockQuantity: 240,
      minimumStockAlert: 40,
      pricePkr: 19800,
      mainImage: TYRE_STUDIO_ASSETS.pcr,
      galleryImages: [TYRE_STUDIO_ASSETS.pcr],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 6,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-7',
      name: 'GT Radial Adventuro AT3 All-Terrain 4x4',
      slug: 'gt-radial-adventuro-at3',
      sku: 'GTR-AT3-265',
      brandId: 'brand-gt-radial',
      brandName: 'GT Radial',
      categoryIds: ['cat-suv'],
      categoryNames: ['SUV / 4x4'],
      sizes: ['265/65R17', '265/70R16', '285/70R17'],
      plyRating: '10PR (LT)',
      loadIndex: '121/118',
      speedRating: 'S',
      treadPattern: 'Adventuro AT3',
      treadDepth: '12.8mm',
      constructionType: 'Radial',
      application: 'SUV & 4x4 All-Terrain',
      shortDescription:
        'Dual-purpose on-road and off-road 4x4 radial engineered for survey pickups, project double-cabs, and northern terrain fleets.',
      fullDescription:
        'Built for demanding field engineering vehicles, the GT Radial Adventuro AT3 features interlocked tread blocks, 3D chamfered sipes, and dual-steel carcass belts that conquer unpaved gravel trails without sacrificing highway comfort.',
      features: [
        'Interlocking center blocks enhance dry and wet stability',
        'Scalloped shoulder lugs boost traction in deep mud and loose gravel',
        'Protected lower sidewall resists rock grazing on project sites',
      ],
      technicalSpecs: {
        rimSize: '8.0J x 17',
        overallDiameter: '776 mm',
        sectionWidth: '272 mm',
        maxLoadSingle: '1450 kg',
        maxLoadDual: '1320 kg',
        inflationPressure: '550 kPa (80 PSI)',
        originCountry: 'Indonesia',
      },
      stockStatus: 'in_stock',
      stockQuantity: 78,
      minimumStockAlert: 15,
      pricePkr: 54500,
      mainImage: TYRE_STUDIO_ASSETS.suv,
      galleryImages: [TYRE_STUDIO_ASSETS.suv],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 7,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-8',
      name: 'Magnum-V MV860 Light Truck Cargo Radial',
      slug: 'magnum-v-mv860-light-truck',
      sku: 'MAG-MV860-750',
      brandId: 'brand-magnum',
      brandName: 'Magnum-V',
      categoryIds: ['cat-ltr', 'cat-ltb'],
      categoryNames: ['Light Truck Radial', 'Light Truck Bias'],
      sizes: ['7.50R16', '7.00R16', '195R15C'],
      plyRating: '14PR',
      loadIndex: '122/118',
      speedRating: 'L',
      treadPattern: 'MV860 Commercial Rib',
      treadDepth: '13.5mm',
      constructionType: 'Radial',
      application: 'Urban Commercial Van',
      shortDescription:
        'High-load-capacity light commercial radial designed for box trucks, refrigerated distribution vans, and municipal shuttles.',
      fullDescription:
        'Magnum-V MV860 maximizes payload capacity with a reinforced 14PR steel-belt structure that suppresses tread squirm under frequent urban stop-and-go braking.',
      features: [
        'Deep straight ribs promote crisp steering and even wear',
        'High bead durability minimizes rim chaffing under heavy cargo loads',
        'Siped shoulder blocks improve monsoon water dispersion',
      ],
      technicalSpecs: {
        rimSize: '6.00G x 16',
        overallDiameter: '802 mm',
        sectionWidth: '215 mm',
        maxLoadSingle: '1500 kg',
        maxLoadDual: '1320 kg',
        inflationPressure: '770 kPa',
        originCountry: 'Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 96,
      minimumStockAlert: 20,
      pricePkr: 38200,
      mainImage: TYRE_STUDIO_ASSETS.lightTruck,
      galleryImages: [TYRE_STUDIO_ASSETS.lightTruck],
      publishingStatus: 'published',
      isFeatured: true,
      displayOrder: 8,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-9',
      name: 'Super Samson R-1W Farm Tractor Traction',
      slug: 'super-samson-r1w-farm-tractor',
      sku: 'SSAM-R1W-184',
      brandId: 'brand-super-samson',
      brandName: 'Super Samson',
      categoryIds: ['cat-agri'],
      categoryNames: ['Agriculture'],
      sizes: ['18.4-30', '16.9-28', '14.9-28'],
      plyRating: '12PR',
      loadIndex: '146',
      speedRating: 'A8',
      treadPattern: '45-Degree High Cleat R-1W',
      treadDepth: '42.0mm',
      constructionType: 'Bias',
      application: 'Agricultural Field',
      shortDescription:
        'Self-cleaning 45-degree bar lug tractor tyre built for heavy tillage, rotary cultivators, and wet paddy field haulage.',
      fullDescription:
        'Engineered with thick overlapping center bars for smooth road transport between fields while delivering superior drawbar pull and minimal soil compaction on farmland.',
      features: [
        '45-degree curved cleats shed wet clay and mud continuously',
        'Stubble-resistant rubber compound protects against crop stalk punctures',
        'Reinforced bead toe prevents rim slippage under high torque',
      ],
      technicalSpecs: {
        rimSize: 'W16L x 30',
        overallDiameter: '1550 mm',
        sectionWidth: '467 mm',
        maxLoadSingle: '3000 kg',
        maxLoadDual: 'N/A',
        inflationPressure: '230 kPa',
        originCountry: 'Export Spec',
      },
      stockStatus: 'in_stock',
      stockQuantity: 42,
      minimumStockAlert: 10,
      pricePkr: 138000,
      mainImage: TYRE_STUDIO_ASSETS.agri,
      galleryImages: [TYRE_STUDIO_ASSETS.agri],
      publishingStatus: 'published',
      isFeatured: false,
      displayOrder: 9,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tyre-10',
      name: 'GT Radial Maxmiler Pro Commercial Van',
      slug: 'gt-radial-maxmiler-pro',
      sku: 'GTR-MAXMILER-225',
      brandId: 'brand-gt-radial',
      brandName: 'GT Radial',
      categoryIds: ['cat-ltr', 'cat-pcr'],
      categoryNames: ['Light Truck Radial', 'PCR – Passenger Car Radial'],
      sizes: ['225/70R15C', '215/75R16C', '195R14C'],
      plyRating: '8PR (C)',
      loadIndex: '112/110',
      speedRating: 'R',
      treadPattern: 'Maxmiler Pro Rib',
      treadDepth: '10.2mm',
      constructionType: 'Radial',
      application: 'Urban Commercial Van',
      shortDescription:
        'High-mileage European-spec commercial van radial delivering reinforced sidewall scuff resistance and predictable wet braking.',
      fullDescription:
        'Ideal for courier express vans, ambulances, and commuter coasters. Double steel belt construction handles full commercial payloads while delivering quiet passenger-like ride comfort.',
      features: [
        'Flat tread contour maximizes contact patch mileage',
        'Reinforced curb-rib protects sidewall against urban pavement impacts',
        'High-density siping boosts wet braking confidence',
      ],
      technicalSpecs: {
        rimSize: '6.5J x 15',
        overallDiameter: '697 mm',
        sectionWidth: '228 mm',
        maxLoadSingle: '1120 kg',
        maxLoadDual: '1060 kg',
        inflationPressure: '450 kPa',
        originCountry: 'Indonesia',
      },
      stockStatus: 'on_order',
      stockQuantity: 0,
      minimumStockAlert: 15,
      pricePkr: 34500,
      mainImage: TYRE_STUDIO_ASSETS.lightTruck,
      galleryImages: [TYRE_STUDIO_ASSETS.lightTruck],
      publishingStatus: 'published',
      isFeatured: false,
      displayOrder: 10,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const dealers: Dealer[] = [
    {
      id: 'dlr-karachi-hq',
      companyName: 'Good Luck Tyres Central Head Office',
      city: 'Karachi',
      region: 'Sindh',
      address: 'Plaza Quarters, M.A. Jinnah Road, Karachi',
      phone: '+92-21-32724810',
      whatsapp: '+92-300-2194810',
      email: 'karachi@goodlucktyres.com',
      hours: 'Mon–Sat: 9:30 AM – 7:30 PM',
      isActive: true,
      displayOrder: 1,
    },
    {
      id: 'dlr-port-qasim',
      companyName: 'Port Qasim Customs-Bonded Logistics Hub',
      city: 'Karachi',
      region: 'Sindh',
      address: 'Plot B-14, North Western Industrial Zone, Port Qasim',
      phone: '+92-21-34152290',
      whatsapp: '+92-300-8241920',
      email: 'logistics@goodlucktyres.com',
      hours: 'Mon–Sat: 8:00 AM – 8:00 PM',
      isActive: true,
      displayOrder: 2,
    },
    {
      id: 'dlr-lahore',
      companyName: 'Badami Bagh Commercial Radial Depot',
      city: 'Lahore',
      region: 'Punjab',
      address: 'Circular Road, Badami Bagh Auto Market, Lahore',
      phone: '+92-42-37721940',
      whatsapp: '+92-321-4198220',
      email: 'lahore@goodlucktyres.com',
      hours: 'Mon–Sat: 9:30 AM – 7:30 PM',
      isActive: true,
      displayOrder: 3,
    },
    {
      id: 'dlr-rawalpindi',
      companyName: 'Twin Cities Fleet & OTR Center',
      city: 'Rawalpindi',
      region: 'Punjab / Federal',
      address: 'Pirwadhai Transport Terminal Road, Rawalpindi',
      phone: '+92-51-5478120',
      whatsapp: '+92-333-5128840',
      email: 'rwp@goodlucktyres.com',
      hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
      isActive: true,
      displayOrder: 4,
    },
    {
      id: 'dlr-faisalabad',
      companyName: 'Faisalabad Industrial & Agri Distribution',
      city: 'Faisalabad',
      region: 'Punjab',
      address: 'Sargodha Road Freight Corridor, Faisalabad',
      phone: '+92-41-8812490',
      whatsapp: '+92-300-6612490',
      email: 'faisalabad@goodlucktyres.com',
      hours: 'Mon–Sat: 9:30 AM – 7:00 PM',
      isActive: true,
      displayOrder: 5,
    },
    {
      id: 'dlr-multan',
      companyName: 'South Punjab Highway Supply Point',
      city: 'Multan',
      region: 'Punjab',
      address: 'Vehari Chowk Transport Market, Multan',
      phone: '+92-61-6528190',
      whatsapp: '+92-301-7419080',
      email: 'multan@goodlucktyres.com',
      hours: 'Mon–Sat: 9:30 AM – 7:00 PM',
      isActive: true,
      displayOrder: 6,
    },
    {
      id: 'dlr-peshawar',
      companyName: 'Khyber CPEC Transit Tyre Hub',
      city: 'Peshawar',
      region: 'Khyber Pakhtunkhwa',
      address: 'Ring Road Truck Terminal, Peshawar',
      phone: '+92-91-2614900',
      whatsapp: '+92-313-9904410',
      email: 'peshawar@goodlucktyres.com',
      hours: 'Mon–Sat: 9:00 AM – 6:30 PM',
      isActive: true,
      displayOrder: 7,
    },
  ];

  const corporateClients: CorporateClient[] = [
    {
      id: 'cli-1',
      name: 'National Logistics Corporation (NLC) Contractors',
      sector: 'Long-Haul Freight & Container Transit',
      description: 'Supplying 12R22.5 and 315/80R22.5 all-steel radials for highway prime mover fleets.',
      logo: '',
      isActive: true,
      displayOrder: 1,
    },
    {
      id: 'cli-2',
      name: 'Indus Quarry & Cement Mining Consortium',
      sector: 'Mining & Civil Earthmoving',
      description: 'Contracted supplier of Samson E-4 and L-5 OTR earthmover radials with TKPH fleet audits.',
      logo: '',
      isActive: true,
      displayOrder: 2,
    },
    {
      id: 'cli-3',
      name: 'Qasim International Port Handling',
      sector: 'Marine Terminal & Container Logistics',
      description: '40PR industrial pneumatic tyres for heavy container reach stackers and terminal tractors.',
      logo: '',
      isActive: true,
      displayOrder: 3,
    },
    {
      id: 'cli-4',
      name: 'Green Crescent Intercity Express Coaches',
      sector: 'Passenger Bus Transport',
      description: 'High-speed steer and drive highway radial supply for 250+ luxury express buses.',
      logo: '',
      isActive: true,
      displayOrder: 4,
    },
    {
      id: 'cli-5',
      name: 'Punjab mechanized Agri Co-op',
      sector: 'Commercial Agriculture',
      description: 'Super Samson high-traction tractor radials and implement tyres for large-scale farms.',
      logo: '',
      isActive: true,
      displayOrder: 5,
    },
    {
      id: 'cli-6',
      name: 'SwiftCold FMCG Cold-Chain Distribution',
      sector: 'Urban & Regional Cold Freight',
      description: 'Magnum-V and GT Radial commercial light-truck tyres for refrigerated delivery fleets.',
      logo: '',
      isActive: true,
      displayOrder: 6,
    },
  ];

  const enquiries: Enquiry[] = [
    {
      id: 'enq-1',
      type: 'quote',
      customerName: 'Tariq Mahmood',
      companyName: 'Al-Fatah Freight Carriers',
      phone: '+92-300-4412890',
      email: 'procurement@alfatahfreight.pk',
      city: 'Lahore',
      tyreId: 'tyre-1',
      tyreName: 'Advance GL285A Long-Haul Steer Radial',
      requestedSize: '295/80R22.5',
      quantity: 40,
      message: 'Need CIF Lahore Badami Bagh rate for 40 steer radial units for monthly fleet rotation.',
      status: 'new',
      notes: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'enq-2',
      type: 'quote',
      customerName: 'Engr. Kamran Siddiqui',
      companyName: 'Khewra Stone & Aggregates',
      phone: '+92-321-8891204',
      email: 'fleet@khewraaggregates.com',
      city: 'Chakwal',
      tyreId: 'tyre-3',
      tyreName: 'Samson GL699A Mining & Quarry E-4',
      requestedSize: '23.5R25',
      quantity: 12,
      message: 'Requesting batch availability and TKPH test chart for 3 wheel loaders.',
      status: 'in_review',
      notes: [
        {
          id: 'note-1',
          author: 'Admin',
          note: 'Confirmed 34 units available at Port Qasim Hub.',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const downloads: DownloadItem[] = [
    {
      id: 'dl-1',
      title: 'Good Luck Tyres 2026 Master Commercial Catalogue',
      description: 'Full product lineup across TBR, OTR, PCR, Industrial, Light Truck, and Agriculture segments.',
      category: 'Master Catalogue',
      brandName: 'All Brands',
      fileUrl: '/api/tyres',
      fileSize: '4.8 MB PDF Spec',
      isPublished: true,
      createdAt: now,
    },
    {
      id: 'dl-2',
      title: 'Advance & Samson TBR Engineering Load-Inflation Table',
      description: 'Single/dual axle weight limits, recommended rim widths, and cold inflation pressures.',
      category: 'Technical Manual',
      brandName: 'Advance Tyre',
      fileUrl: '/api/tyres',
      fileSize: '2.1 MB PDF Spec',
      isPublished: true,
      createdAt: now,
    },
    {
      id: 'dl-3',
      title: 'Samson OTR Mining & Quarry TKPH Selection Guide',
      description: 'Ton-Kilometer-Per-Hour heat calculation charts for E-4 dump trucks and L-5 loaders.',
      category: 'OTR Field Guide',
      brandName: 'Samson Tyre',
      fileUrl: '/api/tyres',
      fileSize: '3.4 MB PDF Spec',
      isPublished: true,
      createdAt: now,
    },
    {
      id: 'dl-4',
      title: 'GT Radial & Runway Fleet Passenger Size Chart',
      description: 'Speed ratings, UTQG wear grades, and commercial van C-rated fitment guide.',
      category: 'Size Matrix',
      brandName: 'GT Radial',
      fileUrl: '/api/tyres',
      fileSize: '1.7 MB PDF Spec',
      isPublished: true,
      createdAt: now,
    },
  ];

  const banners: Banner[] = [
    {
      id: 'bnr-1',
      title: 'Direct Importers & National Distributors of Commercial Tyres',
      subtitle:
        'Factory-certified TBR, OTR Earthmover, Industrial, and Agricultural radials stocked in volume at Port Qasim for immediate nationwide fleet dispatch.',
      ctaText: 'Browse Tyre Catalogue',
      ctaLink: '/tyres',
      secondaryCtaText: 'Request Bulk Quote',
      secondaryCtaLink: 'modal:quote',
      imageUrl: TYRE_STUDIO_ASSETS.heroWarehouse,
      isActive: true,
      displayOrder: 1,
    },
    {
      id: 'bnr-2',
      title: 'Advance & Samson Mining & Quarry OTR Radials',
      subtitle:
        'Engineered cut-resistant E-4 and L-5 compounds verified for extreme quarry heat, heavy articulated haulers, and container reach stackers.',
      ctaText: 'Explore OTR & Industrial',
      ctaLink: '/categories/cat-otr',
      secondaryCtaText: 'Find Your Tyre',
      secondaryCtaLink: '/find-tyre',
      imageUrl: TYRE_STUDIO_ASSETS.otr,
      isActive: true,
      displayOrder: 2,
    },
    {
      id: 'bnr-3',
      title: 'Multi-Life Highway Fleet Casings Built for Lower CPK',
      subtitle:
        'All-steel 4-belt TBR architectures across 12R22.5, 295/80R22.5, and 315/80R22.5 backed by 7 national regional depots.',
      ctaText: 'View Dealer Network',
      ctaLink: '/dealers',
      secondaryCtaText: 'Corporate Fleet Solutions',
      secondaryCtaLink: '/clients',
      imageUrl: TYRE_STUDIO_ASSETS.tbr,
      isActive: true,
      displayOrder: 3,
    },
  ];

  const settings: WebsiteSettings = {
    companyName: 'GOOD LUCK TYRES',
    tagline: 'Premium Commercial & OTR Tyre Trading & Distribution',
    announcementText:
      'Live Inventory Active · Port Qasim Logistics Hub Open Mon–Sat · Nationwide Wholesale Dispatch',
    primaryPhone: '+92-21-32724810',
    whatsappNumber: '+92-300-2194810',
    primaryEmail: 'sales@goodlucktyres.com',
    headquartersAddress: 'Plaza Quarters, M.A. Jinnah Road, Karachi, Pakistan',
    portDepotAddress: 'Plot B-14, North Western Industrial Zone, Port Qasim, Karachi',
    businessHours: 'Mon–Sat: 9:30 AM – 7:30 PM PKT',
    primaryColor: '#0A3C6E',
    accentColor: '#1783C1',
    footerAbout:
      'Established over 35 years ago, Good Luck Tyres is a premier international tyre trading and wholesale distribution enterprise supplying certified TBR, OTR, PCR, Industrial, and Agricultural tyres across Pakistan.',
  };

  return {
    users: [
      {
        id: 'usr-admin-1',
        name: 'System Administrator',
        email: 'admin@goodlucktyres.com',
        role: 'superadmin',
        passwordHash: defaultPasswordHash,
        createdAt: now,
      },
    ],
    brands,
    categories,
    applications,
    tyres,
    dealers,
    corporateClients,
    enquiries,
    downloads,
    banners,
    settings,
    inventoryHistory: [],
    activityLogs: [
      {
        id: 'log-init-1',
        actor: 'System',
        action: 'INITIALIZE_DATABASE',
        entityType: 'System',
        entityId: 'db',
        details: 'Seeded Good Luck Tyres real-time catalogue and Port Qasim inventory.',
        timestamp: now,
      },
    ],
  };
}

let dbCache: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (dbCache) return dbCache;
  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (
        parsed &&
        Array.isArray(parsed.users) &&
        Array.isArray(parsed.tyres) &&
        Array.isArray(parsed.brands) &&
        parsed.tyres.every((t) => Array.isArray(t.categoryIds))
      ) {
        dbCache = parsed;
        return dbCache;
      }
    } catch {
      // fall through to recreate seed db if file is corrupted
    }
  }

  dbCache = createInitialDatabase();
  saveDb(dbCache);
  return dbCache;
}

export function saveDb(db: DatabaseSchema): void {
  dbCache = db;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch {
    // Fallback gracefully if hosting filesystem is read-only
  }
}

export function recordActivityLog(
  db: DatabaseSchema,
  actor: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string
): void {
  db.activityLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  });
  if (db.activityLogs.length > 250) {
    db.activityLogs = db.activityLogs.slice(0, 250);
  }
}

export function getDashboardStats(db: DatabaseSchema): DashboardStats {
  const totalTyres = db.tyres.length;
  const publishedTyres = db.tyres.filter((t) => t.publishingStatus === 'published').length;
  const inStockCount = db.tyres.filter((t) => t.stockStatus === 'in_stock').length;
  const lowStockCount = db.tyres.filter(
    (t) => t.stockQuantity > 0 && t.stockQuantity <= t.minimumStockAlert
  ).length;
  const outOfStockCount = db.tyres.filter((t) => t.stockStatus === 'out_of_stock').length;
  const totalStockUnits = db.tyres.reduce((acc, t) => acc + (t.stockQuantity || 0), 0);

  return {
    totalTyres,
    publishedTyres,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    totalStockUnits,
    totalBrands: db.brands.filter((b) => b.isActive).length,
    totalCategories: db.categories.filter((c) => c.isActive).length,
    totalEnquiries: db.enquiries.length,
    newEnquiriesCount: db.enquiries.filter((e) => e.status === 'new').length,
    totalDealers: db.dealers.filter((d) => d.isActive).length,
  };
}
