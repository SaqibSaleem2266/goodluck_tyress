import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ApplicationType, Brand, Category } from '../../types/index.ts';

interface QuickFinderProps {
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  availableSizes: string[];
  onSearch: (filters: {
    brandId: string;
    categoryId: string;
    application: string;
    size: string;
  }) => void;
}

export const QuickFinder: React.FC<QuickFinderProps> = ({
  brands,
  categories,
  applications,
  availableSizes,
  onSearch,
}) => {
  const [brandId, setBrandId] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [application, setApplication] = useState('all');
  const [size, setSize] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ brandId, categoryId, application, size });
  };

  return (
    <section className="relative z-20 -mt-8 px-4 lg:px-8 max-w-7xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-[#0A3C6E]/10 p-5 sm:p-6"
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1783C1]" />
            <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#0A3C6E]">
              Find Your Tyre — Live Stock Search
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-[#333333]/65">
            Filter by Brand · Category · Terrain · Size
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label
              htmlFor="qf-brand"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1"
            >
              Brand
            </label>
            <select
              id="qf-brand"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] font-medium outline-none"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="qf-category"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1"
            >
              Category
            </label>
            <select
              id="qf-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] font-medium outline-none"
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
            <label
              htmlFor="qf-application"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1"
            >
              Application
            </label>
            <select
              id="qf-application"
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] font-medium outline-none"
            >
              <option value="all">All Applications</option>
              {applications.map((app) => (
                <option key={app.id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="qf-size"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#333333]/75 mb-1"
            >
              Tyre Size
            </label>
            <select
              id="qf-size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] font-medium outline-none"
            >
              <option value="all">All Tyre Sizes</option>
              {availableSizes.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm h-[38px]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Tyres</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
