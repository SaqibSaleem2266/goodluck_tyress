import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ApplicationType, Brand, Category, StockStatus } from '../../types/index.ts';

interface TyreFiltersProps {
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  availableSizes: string[];
  selectedBrand: string;
  selectedCategory: string;
  selectedApplication: string;
  selectedSize: string;
  selectedConstruction: string;
  selectedStockStatus: StockStatus | 'all';
  onBrandChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onApplicationChange: (val: string) => void;
  onSizeChange: (val: string) => void;
  onConstructionChange: (val: string) => void;
  onStockStatusChange: (val: StockStatus | 'all') => void;
  onReset: () => void;
  onCloseMobile?: () => void;
}

export const TyreFilters: React.FC<TyreFiltersProps> = ({
  brands,
  categories,
  applications,
  availableSizes,
  selectedBrand,
  selectedCategory,
  selectedApplication,
  selectedSize,
  selectedConstruction,
  selectedStockStatus,
  onBrandChange,
  onCategoryChange,
  onApplicationChange,
  onSizeChange,
  onConstructionChange,
  onStockStatusChange,
  onReset,
  onCloseMobile,
}) => {
  const selectClass =
    'w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] font-medium outline-none';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#0A3C6E]">
          Filter Catalogue
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close filters"
              className="lg:hidden p-1 text-slate-500 hover:text-[#0A3C6E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1.5">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Authorized Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1.5">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1.5">
          Tyre Size
        </label>
        <select
          value={selectedSize}
          onChange={(e) => onSizeChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Tyre Sizes</option>
          {availableSizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1.5">
          Application
        </label>
        <select
          value={selectedApplication}
          onChange={(e) => onApplicationChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Applications</option>
          {applications.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1.5">
          Construction Type
        </label>
        <select
          value={selectedConstruction}
          onChange={(e) => onConstructionChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">Radial & Bias</option>
          <option value="Radial">All-Steel Radial</option>
          <option value="Bias">Heavy Nylon Bias</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1.5">
          Stock Availability
        </label>
        <select
          value={selectedStockStatus}
          onChange={(e) => onStockStatusChange(e.target.value as StockStatus | 'all')}
          className={selectClass}
        >
          <option value="all">All Stock Statuses</option>
          <option value="in_stock">In Stock (Ready Dispatch)</option>
          <option value="on_order">On Order / Incoming</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};
