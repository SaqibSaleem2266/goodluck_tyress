import React from 'react';
import { Brand } from '../types/index.ts';
import { ArrowRight } from 'lucide-react';
import { resolveBrandImage, TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';

interface BrandsPageProps {
  brands: Brand[];
  onSelectBrand: (brand: Brand) => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ brands, onSelectBrand }) => {
  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
          Authorized Tyre Distribution Portfolio
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Tyre Brands Portfolio
        </h1>
        <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl leading-relaxed">
          Good Luck Tyres distributes world-leading brands certified for international commercial transport, heavy civil construction, and mining operations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const tyrePhoto = resolveBrandImage(brand);
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => onSelectBrand(brand)}
              className="group text-left bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A3C6E]/10 flex flex-col justify-between"
            >
              <div className="relative h-52 w-full bg-[#F4F7FA] border-b border-slate-200 overflow-hidden">
                <img
                  src={tyrePhoto}
                  alt={`${brand.name} tyre showcase`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-11 h-11 rounded-lg bg-[#0A3C6E] text-white flex items-center justify-center font-display font-black text-base shadow-sm">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
                {brand.tyreCount !== undefined && (
                  <span className="absolute top-3 right-3 text-xs font-mono font-semibold text-[#0A3C6E] bg-white/95 px-2.5 py-1 rounded border border-slate-200 tabular-nums">
                    {brand.tyreCount} Available Models
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-xl font-bold text-[#0A3C6E] group-hover:text-[#1783C1] transition-colors">
                    {brand.name}
                  </h2>

                  <p className="text-xs text-[#333333]/80 mt-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1783C1] group-hover:text-[#0A3C6E] transition-colors">
                  <span>View Brand Catalogue</span>
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
