import React, { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  ApplicationType,
  Brand,
  Category,
  StockStatus,
  Tyre,
} from '../types/index.ts';
import { filterTyres } from '../utils/inventory.ts';
import { TyreCard } from '../components/tyres/TyreCard.tsx';
import { TyreFilters } from '../components/tyres/TyreFilters.tsx';

interface TyresPageProps {
  tyres: Tyre[];
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  availableSizes: string[];
  initialBrandId?: string;
  initialCategoryId?: string;
  initialApplication?: string;
  initialSize?: string;
  initialSearchQuery?: string;
  onViewDetails: (tyre: Tyre) => void;
  onRequestQuote: (tyre: Tyre) => void;
}

export const TyresPage: React.FC<TyresPageProps> = ({
  tyres,
  brands,
  categories,
  applications,
  availableSizes,
  initialBrandId = 'all',
  initialCategoryId = 'all',
  initialApplication = 'all',
  initialSize = 'all',
  initialSearchQuery = '',
  onViewDetails,
  onRequestQuote,
}) => {
  const [selectedBrand, setSelectedBrand] = useState(initialBrandId);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedApplication, setSelectedApplication] = useState(initialApplication);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedConstruction, setSelectedConstruction] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<StockStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedBrand(initialBrandId);
    setSelectedCategory(initialCategoryId);
    setSelectedApplication(initialApplication);
    setSelectedSize(initialSize);
    setSearchQuery(initialSearchQuery);
  }, [initialBrandId, initialCategoryId, initialApplication, initialSize, initialSearchQuery]);

  const filtered = useMemo(() => {
    return filterTyres(tyres, {
      brandId: selectedBrand,
      categoryId: selectedCategory,
      application: selectedApplication,
      size: selectedSize,
      constructionType: selectedConstruction,
      stockStatus: selectedStockStatus,
      searchQuery,
    });
  }, [
    tyres,
    selectedBrand,
    selectedCategory,
    selectedApplication,
    selectedSize,
    selectedConstruction,
    selectedStockStatus,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedApplication('all');
    setSelectedSize('all');
    setSelectedConstruction('all');
    setSelectedStockStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Live Port Qasim & Regional Inventory
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            All Commercial & OTR Tyres
          </h1>
          <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
            Click any tyre product card to inspect full technical load-speed tables, rim widths, and real-time depot availability.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold text-[#0A3C6E] bg-[#F4F7FA] px-3.5 py-2 rounded-lg border border-slate-200 tabular-nums self-start md:self-end">
          Showing {filtered.length} of {tyres.length} Models
        </div>
      </div>

      {/* Search Bar & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1783C1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, tyre model, tread pattern, or size (e.g. 12R22.5, 23.5R25, Samson)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] focus:bg-white rounded-xl text-sm text-[#333333] outline-none transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden px-4 py-2.5 bg-[#0A3C6E] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filter Tyres'}</span>
        </button>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside
          className={`${
            mobileFiltersOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-1 lg:sticky lg:top-24`}
        >
          <TyreFilters
            brands={brands}
            categories={categories}
            applications={applications}
            availableSizes={availableSizes}
            selectedBrand={selectedBrand}
            selectedCategory={selectedCategory}
            selectedApplication={selectedApplication}
            selectedSize={selectedSize}
            selectedConstruction={selectedConstruction}
            selectedStockStatus={selectedStockStatus}
            onBrandChange={setSelectedBrand}
            onCategoryChange={setSelectedCategory}
            onApplicationChange={setSelectedApplication}
            onSizeChange={setSelectedSize}
            onConstructionChange={setSelectedConstruction}
            onStockStatusChange={setSelectedStockStatus}
            onReset={resetFilters}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />
        </aside>

        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-[#F4F7FA] border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <h3 className="text-lg font-bold text-[#0A3C6E]">
                No Matching Tyre Models Found
              </h3>
              <p className="text-xs text-[#333333]/80 max-w-md mx-auto">
                Adjust your selected brand, category, or tyre size criteria, or contact our wholesale desk to inquire about custom container orders.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((tyre) => (
                <TyreCard
                  key={tyre.id}
                  tyre={tyre}
                  onViewDetails={onViewDetails}
                  onRequestQuote={onRequestQuote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
