import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Brand, Category, Tyre } from '../types/index.ts';
import { resolveCategoryImage, TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';
import { TyreCard } from '../components/tyres/TyreCard.tsx';

interface CategoryDetailPageProps {
  category: Category;
  brands: Brand[];
  tyres: Tyre[];
  onBack: () => void;
  onViewDetails: (tyre: Tyre) => void;
  onRequestQuote: (tyre: Tyre) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  category,
  brands,
  tyres,
  onBack,
  onViewDetails,
  onRequestQuote,
}) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');

  const categoryTyres = tyres.filter(
    (t) =>
      t.categoryIds.includes(category.id) &&
      (selectedBrandId === 'all' || t.brandId === selectedBrandId)
  );

  const assignedBrands = brands.filter(
    (b) =>
      category.brandIds.includes(b.id) ||
      tyres.some((t) => t.categoryIds.includes(category.id) && t.brandId === b.id)
  );

  const catImage = resolveCategoryImage(category);

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Tyre Categories</span>
      </button>

      <div className="bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest">
            Commercial Category Classification
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-[#333333]/85 leading-relaxed max-w-2xl">
            {category.description}
          </p>

          {assignedBrands.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedBrandId('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedBrandId === 'all'
                    ? 'bg-[#0A3C6E] text-white'
                    : 'bg-white text-[#333333] border border-slate-200 hover:border-[#1783C1]'
                }`}
              >
                All Brands ({tyres.filter((t) => t.categoryIds.includes(category.id)).length})
              </button>
              {assignedBrands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBrandId(b.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedBrandId === b.id
                      ? 'bg-[#1783C1] text-white'
                      : 'bg-white text-[#333333] border border-slate-200 hover:border-[#1783C1]'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 h-56 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <img
            src={catImage}
            alt={category.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
            }}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Matching {category.name} Inventory ({categoryTyres.length})
        </h2>

        {categoryTyres.length === 0 ? (
          <div className="bg-[#F4F7FA] border border-slate-200 rounded-xl p-8 text-center text-sm text-[#333333]/80">
            No tyres matched the selected brand in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTyres.map((tyre) => (
              <TyreCard
                key={tyre.id}
                tyre={tyre}
                onViewDetails={onViewDetails}
                onRequestQuote={onRequestQuote}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
