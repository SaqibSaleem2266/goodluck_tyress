import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Banner,
  Brand,
  Category,
  ApplicationType,
  Dealer,
  CorporateClient,
  DownloadItem,
  Tyre,
  WebsiteSettings,
} from './types/index.ts';
import { api, authStorage, StoredAdminUser } from './api/client.ts';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { QuoteModal } from './components/tyres/QuoteModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { TyresPage } from './pages/TyresPage.tsx';
import { TyreDetailPage } from './pages/TyreDetailPage.tsx';
import { BrandsPage } from './pages/BrandsPage.tsx';
import { BrandDetailPage } from './pages/BrandDetailPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { CategoryDetailPage } from './pages/CategoryDetailPage.tsx';
import { FindYourTyrePage } from './pages/FindYourTyrePage.tsx';
import { DealersPage } from './pages/DealersPage.tsx';
import { CorporateClientsPage } from './pages/CorporateClientsPage.tsx';
import { DownloadsPage } from './pages/DownloadsPage.tsx';
import { AboutUsPage } from './pages/AboutUsPage.tsx';
import { ContactUsPage } from './pages/ContactUsPage.tsx';
import { RequestQuotePage } from './pages/RequestQuotePage.tsx';
import { PrivacyPolicyPage, TermsPage, NotFoundPage } from './pages/StaticPages.tsx';

// Admin views
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { AdminProducts } from './components/admin/AdminProducts.tsx';
import { AdminTyreForm } from './components/admin/AdminTyreForm.tsx';
import { AdminInventory } from './components/admin/AdminInventory.tsx';
import { AdminBrands } from './components/admin/AdminBrands.tsx';
import { AdminCategories } from './components/admin/AdminCategories.tsx';
import { AdminDealers } from './components/admin/AdminDealers.tsx';
import { AdminClients } from './components/admin/AdminClients.tsx';
import { AdminEnquiries } from './components/admin/AdminEnquiries.tsx';
import { AdminDownloads } from './components/admin/AdminDownloads.tsx';
import { AdminBanners } from './components/admin/AdminBanners.tsx';
import { AdminSettings } from './components/admin/AdminSettings.tsx';
import { AdminActivityLogs } from './components/admin/AdminActivityLogs.tsx';
import { AdminChangePassword } from './components/admin/AdminChangePassword.tsx';

const DEFAULT_SETTINGS: WebsiteSettings = {
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
    'Established over 35 years ago, Good Luck Tyres is an international tyre trading and wholesale distribution enterprise supplying certified TBR, OTR, PCR, Industrial, and Agricultural tyres across Pakistan.',
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname + window.location.search
  );
  const [adminUser, setAdminUser] = useState<StoredAdminUser | null>(() =>
    authStorage.getUser()
  );
  const [editingTyre, setEditingTyre] = useState<Tyre | null>(null);

  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [clients, setClients] = useState<CorporateClient[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);

  const [quoteModalTyre, setQuoteModalTyre] = useState<Tyre | null | undefined>(
    undefined
  );

  const navigate = useCallback((to: string) => {
    const normalized = to.startsWith('/') ? to : `/${to}`;
    if (window.location.pathname + window.location.search !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const loadData = useCallback(async () => {
    const hasAdmin = Boolean(authStorage.getToken() && authStorage.getUser());
    try {
      const [
        tyresRes,
        brandsRes,
        categoriesRes,
        appsRes,
        dealersRes,
        clientsRes,
        downloadsRes,
        bannersRes,
        settingsRes,
      ] = await Promise.all([
        api.getTyres(hasAdmin),
        api.getBrands(hasAdmin),
        api.getCategories(hasAdmin),
        api.getApplications(),
        api.getDealers(hasAdmin),
        api.getCorporateClients(hasAdmin),
        api.getDownloads(hasAdmin),
        api.getBanners(hasAdmin),
        api.getSettings(),
      ]);

      setTyres(tyresRes);
      setBrands(brandsRes);
      setCategories(categoriesRes);
      setApplications(appsRes);
      setDealers(dealersRes);
      setClients(clientsRes);
      setDownloads(downloadsRes);
      setBanners(bannersRes);
      setSettings(settingsRes);
    } catch {
      // handled gracefully by fallback UI states
    }
  }, []);

  useEffect(() => {
    if (authStorage.getToken()) {
      api
        .verifySession()
        .then((res) => setAdminUser(res.user))
        .catch(() => {
          authStorage.clearAll();
          setAdminUser(null);
        })
        .finally(() => {
          loadData();
        });
    } else {
      loadData();
    }
  }, [loadData]);

  // Real-time SSE sync for inventory, tyres, banners, settings
  useEffect(() => {
    const eventSource = new EventSource('/api/inventory/stream');

    const handleTyreOrInventory = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.deletedId) {
          setTyres((prev) => prev.filter((t) => t.id !== data.deletedId));
          return;
        }
        if (data.id) {
          setTyres((prev) => {
            const exists = prev.some((t) => t.id === data.id);
            if (exists) {
              return prev.map((t) => (t.id === data.id ? data : t));
            }
            return [data, ...prev];
          });
        }
      } catch {
        // ignore parse error
      }
    };

    const handleBannersUpdated = (event: MessageEvent) => {
      try {
        if (authStorage.getUser()) {
          api.getBanners(true).then(setBanners).catch(() => {});
        } else {
          const updated = JSON.parse(event.data) as Banner[];
          setBanners(updated);
        }
      } catch {
        // ignore parse error
      }
    };

    const handleSettingsUpdated = (event: MessageEvent) => {
      try {
        const updated = JSON.parse(event.data) as WebsiteSettings;
        setSettings(updated);
      } catch {
        // ignore parse error
      }
    };

    eventSource.addEventListener('inventory_updated', handleTyreOrInventory);
    eventSource.addEventListener('tyre_updated', handleTyreOrInventory);
    eventSource.addEventListener('banners_updated', handleBannersUpdated);
    eventSource.addEventListener('settings_updated', handleSettingsUpdated);

    return () => eventSource.close();
  }, []);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    for (const t of tyres) {
      for (const s of t.sizes || []) {
        set.add(s);
      }
    }
    return Array.from(set).sort();
  }, [tyres]);

  const publishedTyres = useMemo(
    () => tyres.filter((t) => t.publishingStatus === 'published'),
    [tyres]
  );

  const featuredTyres = useMemo(() => {
    const featured = publishedTyres.filter((t) => t.isFeatured);
    return featured.length > 0 ? featured : publishedTyres;
  }, [publishedTyres]);

  const handleViewTyreDetails = useCallback(
    (tyre: Tyre) => {
      navigate(`/tyres/${tyre.slug || tyre.id}`);
    },
    [navigate]
  );

  const handleOpenQuoteModal = useCallback((tyre?: Tyre) => {
    setQuoteModalTyre(tyre ?? null);
  }, []);

  const [pathname, searchPart = ''] = currentPath.split('?');
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  // ================= ADMIN ROUTES =================
  if (cleanPath.startsWith('/admin')) {
    if (!adminUser || cleanPath === '/admin/login') {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            loadData();
            navigate('/admin');
          }}
          onBackToSite={() => navigate('/')}
        />
      );
    }

    const handleLogout = async () => {
      await api.logout().catch(() => {});
      authStorage.clearAll();
      setAdminUser(null);
      loadData();
      navigate('/');
    };

    return (
      <AdminLayout
        currentPath={cleanPath}
        user={adminUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        {cleanPath === '/admin' && (
          <AdminDashboard tyres={tyres} onNavigate={navigate} />
        )}
        {cleanPath === '/admin/products' && (
          <AdminProducts
            tyres={tyres}
            brands={brands}
            onAddNew={() => {
              setEditingTyre(null);
              navigate('/admin/products/new');
            }}
            onEditTyre={(t) => {
              setEditingTyre(t);
              navigate('/admin/products/edit');
            }}
            onRefresh={loadData}
          />
        )}
        {(cleanPath === '/admin/products/new' || cleanPath === '/admin/products/edit') && (
          <AdminTyreForm
            existingTyre={cleanPath === '/admin/products/edit' ? editingTyre : null}
            brands={brands}
            categories={categories}
            applications={applications}
            onSaved={async () => {
              await loadData();
              navigate('/admin/products');
            }}
            onCancel={() => navigate('/admin/products')}
          />
        )}
        {cleanPath === '/admin/inventory' && (
          <AdminInventory tyres={tyres} onRefresh={loadData} />
        )}
        {cleanPath === '/admin/brands' && (
          <AdminBrands brands={brands} onRefresh={loadData} />
        )}
        {cleanPath === '/admin/categories' && (
          <AdminCategories
            categories={categories}
            brands={brands}
            onRefresh={loadData}
          />
        )}
        {cleanPath === '/admin/dealers' && (
          <AdminDealers dealers={dealers} onRefresh={loadData} />
        )}
        {cleanPath === '/admin/clients' && (
          <AdminClients clients={clients} onRefresh={loadData} />
        )}
        {cleanPath === '/admin/enquiries' && <AdminEnquiries />}
        {cleanPath === '/admin/downloads' && (
          <AdminDownloads downloads={downloads} onRefresh={loadData} />
        )}
        {cleanPath === '/admin/banners' && (
          <AdminBanners
            banners={banners}
            onRefresh={loadData}
            onPreviewHomepage={() => navigate('/')}
          />
        )}
        {cleanPath === '/admin/settings' && (
          <AdminSettings settings={settings} onRefresh={loadData} />
        )}
        {cleanPath === '/admin/logs' && <AdminActivityLogs />}
        {cleanPath === '/admin/password' && <AdminChangePassword />}
      </AdminLayout>
    );
  }

  // ================= PUBLIC WEBSITE ROUTES =================
  const renderPublicPage = () => {
    if (cleanPath === '/') {
      return (
        <HomePage
          banners={banners}
          brands={brands}
          categories={categories}
          applications={applications}
          availableSizes={availableSizes}
          featuredTyres={featuredTyres}
          corporateClients={clients}
          onNavigate={navigate}
          onViewTyreDetails={handleViewTyreDetails}
          onOpenQuoteModal={handleOpenQuoteModal}
          onSelectBrand={(b) => navigate(`/brands/${b.slug}`)}
          onSelectCategory={(c) => navigate(`/categories/${c.slug}`)}
        />
      );
    }

    if (cleanPath === '/tyres') {
      const qs = new URLSearchParams(searchPart);
      return (
        <TyresPage
          key={currentPath}
          tyres={publishedTyres}
          brands={brands}
          categories={categories}
          applications={applications}
          availableSizes={availableSizes}
          initialBrandId={qs.get('brand') || 'all'}
          initialCategoryId={qs.get('category') || 'all'}
          initialApplication={qs.get('application') || 'all'}
          initialSize={qs.get('size') || 'all'}
          initialSearchQuery={qs.get('q') || ''}
          onViewDetails={handleViewTyreDetails}
          onRequestQuote={handleOpenQuoteModal}
        />
      );
    }

    if (cleanPath.startsWith('/tyres/')) {
      const key = decodeURIComponent(cleanPath.slice('/tyres/'.length));
      const matched =
        publishedTyres.find((t) => t.slug === key || t.id === key) ||
        tyres.find((t) => t.slug === key || t.id === key);

      if (!matched) {
        return <NotFoundPage onGoHome={() => navigate('/')} />;
      }

      const related = publishedTyres.filter(
        (t) =>
          t.id !== matched.id &&
          (t.brandId === matched.brandId ||
            t.categoryIds.some((cid) => matched.categoryIds.includes(cid)))
      );

      return (
        <TyreDetailPage
          key={matched.id}
          tyre={matched}
          relatedTyres={related}
          onBack={() => navigate('/tyres')}
          onRequestQuote={handleOpenQuoteModal}
          onViewDetails={handleViewTyreDetails}
        />
      );
    }

    if (cleanPath === '/brands') {
      return (
        <BrandsPage
          brands={brands}
          onSelectBrand={(b) => navigate(`/brands/${b.slug}`)}
        />
      );
    }

    if (cleanPath.startsWith('/brands/')) {
      const key = decodeURIComponent(cleanPath.slice('/brands/'.length));
      const brand = brands.find((b) => b.slug === key || b.id === key);
      if (!brand) return <NotFoundPage onGoHome={() => navigate('/')} />;
      return (
        <BrandDetailPage
          brand={brand}
          tyres={publishedTyres}
          onBack={() => navigate('/brands')}
          onViewDetails={handleViewTyreDetails}
          onRequestQuote={handleOpenQuoteModal}
        />
      );
    }

    if (cleanPath === '/categories') {
      return (
        <CategoriesPage
          categories={categories}
          onSelectCategory={(c) => navigate(`/categories/${c.slug}`)}
        />
      );
    }

    if (cleanPath.startsWith('/categories/')) {
      const key = decodeURIComponent(cleanPath.slice('/categories/'.length));
      const category = categories.find((c) => c.slug === key || c.id === key);
      if (!category) return <NotFoundPage onGoHome={() => navigate('/')} />;
      return (
        <CategoryDetailPage
          category={category}
          brands={brands}
          tyres={publishedTyres}
          onBack={() => navigate('/categories')}
          onViewDetails={handleViewTyreDetails}
          onRequestQuote={handleOpenQuoteModal}
        />
      );
    }

    if (cleanPath === '/find-tyre' || cleanPath === '/finder') {
      return (
        <FindYourTyrePage
          tyres={publishedTyres}
          brands={brands}
          categories={categories}
          applications={applications}
          availableSizes={availableSizes}
          onViewDetails={handleViewTyreDetails}
          onRequestQuote={handleOpenQuoteModal}
        />
      );
    }

    if (cleanPath === '/dealers') {
      return (
        <DealersPage
          dealers={dealers}
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />
      );
    }

    if (cleanPath === '/clients') {
      return (
        <CorporateClientsPage
          clients={clients}
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />
      );
    }

    if (cleanPath === '/downloads') {
      return <DownloadsPage downloads={downloads} />;
    }

    if (cleanPath === '/about') {
      return (
        <AboutUsPage
          settings={settings}
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />
      );
    }

    if (cleanPath === '/contact') {
      return <ContactUsPage settings={settings} />;
    }

    if (cleanPath === '/request-quote' || cleanPath === '/quote') {
      return <RequestQuotePage tyres={publishedTyres} />;
    }

    if (cleanPath === '/privacy-policy' || cleanPath === '/privacy') {
      return <PrivacyPolicyPage />;
    }

    if (cleanPath === '/terms' || cleanPath === '/terms-and-conditions') {
      return <TermsPage />;
    }

    return <NotFoundPage onGoHome={() => navigate('/')} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#333333]">
      <Header
        currentPath={cleanPath}
        onNavigate={navigate}
        brands={brands}
        categories={categories}
        settings={settings}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenQuickSearch={() => navigate('/tyres')}
      />

      <main className="flex-1">{renderPublicPage()}</main>

      <Footer
        brands={brands}
        categories={categories}
        settings={settings}
        onNavigate={navigate}
      />

      {quoteModalTyre !== undefined && (
        <QuoteModal
          tyre={quoteModalTyre}
          onClose={() => setQuoteModalTyre(undefined)}
        />
      )}
    </div>
  );
}
