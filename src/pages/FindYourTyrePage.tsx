import React, { useMemo, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { ApplicationType, Brand, Category, Tyre } from '../types/index.ts';
import { filterTyres } from '../utils/inventory.ts';
import { TyreCard } from '../components/tyres/TyreCard.tsx';

interface FindYourTyrePageProps {
  tyres: Tyre[];
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  availableSizes: string[];
  onViewDetails: (tyre: Tyre) => void;
  onRequestQuote: (tyre: Tyre) => void;
}

export const FindYourTyrePage: React.FC<FindYourTyrePageProps> = ({
  tyres,
  brands,
  categories,
  applications,
  availableSizes,
  onViewDetails,
  onRequestQuote,
}) => {
  const [brandId, setBrandId] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [application, setApplication] = useState('all');
  const [size, setSize] = useState('all');
  const [constructionType, setConstructionType] = useState('all');

  const results = useMemo(() => {
    return filterTyres(tyres, {
      brandId,
      categoryId,
      application,
      size,
      constructionType,
    });
  }, [tyres, brandId, categoryId, application, size, constructionType]);

  const reset = () => {
    setBrandId('all');
    setCategoryId('all');
    setApplication('all');
    setSize('all');
    setConstructionType('all');
  };

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div>
        <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
          Interactive Fitment & Application Selector
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Find Your Tyre
        </h1>
        <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
          Configure your vehicle axle category, operating terrain, size specification, and construction preference to pinpoint exact in-stock tyre matches.
        </p>
      </div>

      {/* Interactive Matcher Box */}
      <div className="bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0A3C6E] mb-1.5">
              1. Category Segment
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
            >
              <option value="all">Any Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A3C6E] mb-1.5">
              2. Preferred Brand
            </label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
            >
              <option value="all">Any Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A3C6E] mb-1.5">
              3. Terrain / Application
            </label>
            <select
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
            >
              <option value="all">Any Application</option>
              {applications.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A3C6E] mb-1.5">
              4. Tyre Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
            >
              <option value="all">Any Tyre Size</option>
              {availableSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A3C6E] mb-1.5">
              5. Construction
            </label>
            <select
              value={constructionType}
              onChange={(e) => setConstructionType(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
            >
              <option value="all">Radial & Bias</option>
              <option value="Radial">All-Steel Radial</option>
              <option value="Bias">Heavy Bias Ply</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0A3C6E]">
            <Search className="w-4 h-4 text-[#1783C1]" />
            <span>{results.length} Matching Tyre(s) Found</span>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-semibold text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Finder</span>
          </button>
        </div>
      </div>

      {/* Matching Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((tyre) => (
          <TyreCard
            key={tyre.id}
            tyre={tyre}
            onViewDetails={onViewDetails}
            onRequestQuote={onRequestQuote}
          />
        ))}
      </div>
    </div>
  );
};
