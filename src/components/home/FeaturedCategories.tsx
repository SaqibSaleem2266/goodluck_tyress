import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types/index.ts';
import { resolveCategoryImage, TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface FeaturedCategoriesProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  onViewAllCategories: () => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
  onSelectCategory,
  onViewAllCategories,
}) => {
  return (
    <section className="py-16 px-4 lg:px-8 bg-[#F4F7FA] border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
              Complete Automotive Tyre Taxonomy
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
              Tyre Categories
            </h2>
            <p className="text-sm text-[#333333]/80 mt-1 max-w-xl">
              From line-haul highway transport to open-pit mining loaders and high flotation agricultural machinery.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllCategories}
            className="text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1.5 transition-colors self-start md:self-end whitespace-nowrap"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => {
            const catImage = resolveCategoryImage(cat);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className="group text-left bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A3C6E]/10 flex flex-col justify-between"
              >
                {/* Matching Category Tyre Photograph */}
                <div className="relative h-48 w-full bg-white border-b border-slate-200 overflow-hidden">
                  <img
                    src={catImage}
                    alt={`${cat.name} tyre showcase`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {cat.tyreCount !== undefined && (
                    <span className="absolute top-3 right-3 text-[11px] font-mono font-semibold text-[#0A3C6E] bg-[#F4F7FA] px-2.5 py-1 rounded border border-slate-200 tabular-nums">
                      {cat.tyreCount} Products
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between w-full">
                  <div>
                    <div className="text-[11px] font-mono text-[#1783C1] font-bold uppercase tracking-wider mb-1">
                      Application Segment
                    </div>

                    <h3 className="text-lg font-bold text-[#0A3C6E] group-hover:text-[#1783C1] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-[#333333]/80 mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1783C1] group-hover:text-[#0A3C6E] transition-colors">
                    <span>View Matching Tyres</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
