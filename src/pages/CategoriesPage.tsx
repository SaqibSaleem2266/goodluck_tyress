import React from 'react';
import { Category } from '../types/index.ts';
import { ArrowRight } from 'lucide-react';
import { resolveCategoryImage, TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';

interface CategoriesPageProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
          Vehicle & Heavy Equipment Classification
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Tyre Categories
        </h1>
        <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl leading-relaxed">
          Explore tyres engineered specifically for long-haul highway transport, mining quarry face recovery, high-traction agricultural fields, and industrial material handling.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catImage = resolveCategoryImage(cat);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className="group text-left bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A3C6E]/10 flex flex-col justify-between"
            >
              <div className="relative h-52 w-full bg-[#F4F7FA] border-b border-slate-200 overflow-hidden">
                <img
                  src={catImage}
                  alt={`${cat.name} tyre classification`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {cat.tyreCount !== undefined && (
                  <span className="absolute top-3 right-3 text-xs font-mono font-semibold text-[#0A3C6E] bg-white/95 px-2.5 py-1 rounded border border-slate-200 tabular-nums">
                    {cat.tyreCount} Models
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between w-full">
                <div>
                  <span className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-wider">
                    Category Classification
                  </span>

                  <h2 className="text-xl font-bold text-[#0A3C6E] mt-1 group-hover:text-[#1783C1] transition-colors">
                    {cat.name}
                  </h2>

                  <p className="text-xs text-[#333333]/80 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1783C1] group-hover:text-[#0A3C6E] transition-colors">
                  <span>View Matching Tyres</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
