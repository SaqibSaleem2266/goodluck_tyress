import React from 'react';
import { ArrowRight, Download, MessageSquare } from 'lucide-react';
import { HeroSlider } from '../components/home/HeroSlider.tsx';
import { QuickFinder } from '../components/home/QuickFinder.tsx';
import { FeaturedBrands } from '../components/home/FeaturedBrands.tsx';
import { FeaturedCategories } from '../components/home/FeaturedCategories.tsx';
import { TyreCard } from '../components/tyres/TyreCard.tsx';
import { AxleSectorsSection } from '../components/home/AxleSectorsSection.tsx';
import { ProcurementWorkflowSection } from '../components/home/ProcurementWorkflowSection.tsx';
import { WhyChooseUs } from '../components/home/WhyChooseUs.tsx';
import { StatsSection } from '../components/home/StatsSection.tsx';
import { CorporateMarquee } from '../components/home/CorporateMarquee.tsx';
import {
  Tyre,
  Brand,
  Category,
  ApplicationType,
  Banner,
  CorporateClient,
} from '../types/index.ts';

interface HomePageProps {
  banners: Banner[];
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  availableSizes: string[];
  featuredTyres: Tyre[];
  corporateClients: CorporateClient[];
  onNavigate: (path: string) => void;
  onViewTyreDetails: (tyre: Tyre) => void;
  onOpenQuoteModal: (prefill?: any) => void;
  onSelectBrand: (brand: Brand) => void;
  onSelectCategory: (category: Category) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  banners,
  brands,
  categories,
  applications,
  availableSizes,
  featuredTyres,
  corporateClients,
  onNavigate,
  onViewTyreDetails,
  onOpenQuoteModal,
  onSelectBrand,
  onSelectCategory,
}) => {
  return (
    <div className="w-full bg-white text-[#333333] min-h-screen">
      {/* 1. Large Hero Slider */}
      <HeroSlider
        banners={banners}
        onNavigate={onNavigate}
        onOpenQuoteModal={() => onOpenQuoteModal()}
      />

      {/* 2. Advanced Find Your Tyre Quick Finder Widget */}
      <QuickFinder
        brands={brands}
        categories={categories}
        applications={applications}
        availableSizes={availableSizes}
        onSearch={(filters) => {
          const params = new URLSearchParams();
          if (filters.brandId !== 'all') params.set('brand', filters.brandId);
          if (filters.categoryId !== 'all') params.set('category', filters.categoryId);
          if (filters.application !== 'all') params.set('application', filters.application);
          if (filters.size !== 'all') params.set('size', filters.size);
          const qs = params.toString();
          onNavigate(qs ? `/tyres?${qs}` : '/tyres');
        }}
      />

      {/* 3. Featured Brands Grid (with Related Tyre Photography) */}
      <FeaturedBrands
        brands={brands}
        onSelectBrand={onSelectBrand}
        onViewAllBrands={() => onNavigate('/brands')}
      />

      {/* 4. Featured Categories Grid (with Related Tyre Photography) */}
      <FeaturedCategories
        categories={categories}
        onSelectCategory={onSelectCategory}
        onViewAllCategories={() => onNavigate('/categories')}
      />

      {/* 5. Latest & Featured Tyres Section with Live Inventory Badges */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
              Real-Time Stock Availability
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
              Featured Tyre Inventory
            </h2>
            <p className="text-sm text-[#333333]/80 mt-1 max-w-xl">
              High-tensile radial tyres in stock at Port Qasim and ready for immediate nationwide freight dispatch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/tyres')}
            className="text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1.5 transition-colors self-start md:self-end whitespace-nowrap"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTyres.slice(0, 6).map((tyre) => (
            <TyreCard
              key={tyre.id}
              tyre={tyre}
              onViewDetails={onViewTyreDetails}
              onRequestQuote={onOpenQuoteModal}
            />
          ))}
        </div>
      </section>

      {/* 6. Commercial Vehicle & Axle Sectors Matrix */}
      <AxleSectorsSection onNavigate={onNavigate} />

      {/* 7. Wholesale Ordering & Container Dispatch Workflow */}
      <ProcurementWorkflowSection
        onNavigate={onNavigate}
        onOpenQuoteModal={() => onOpenQuoteModal()}
      />

      {/* 8. Why Choose Good Luck Tyres */}
      <WhyChooseUs />

      {/* 9. Key Business Statistics (Ascending Animated Counters) */}
      <StatsSection />

      {/* 10. Corporate Clients & Fleet Partnerships */}
      <CorporateMarquee
        clients={corporateClients}
        onViewAllClients={() => onNavigate('/clients')}
      />

      {/* 11. Download Catalogue CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16 pt-4">
        <div className="bg-gradient-to-r from-[#0A3C6E] via-[#0A3C6E] to-[#1783C1] border border-[#06284B] rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#0A3C6E]/15">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest">
              Technical Documentation & Specs
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              Download Good Luck Tyres 2026 Master Catalogue
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Access complete load-speed inflation tables, dual-mounting spacing parameters, and technical field manuals for Advance, Samson, Runway, GT Radial, and Magnum-V.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('/downloads')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F4F7FA] active:scale-[0.98] text-[#0A3C6E] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#1783C1]" />
              <span>Download PDF Catalogues</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#06284B] hover:bg-[#1783C1] border border-white/25 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-sky-300" />
              <span>Request Quote</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
