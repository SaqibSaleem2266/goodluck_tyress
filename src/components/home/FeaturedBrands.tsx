import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Brand } from '../../types/index.ts';
import { resolveBrandImage, TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface FeaturedBrandsProps {
  brands: Brand[];
  onSelectBrand: (brand: Brand) => void;
  onViewAllBrands: () => void;
}

export const FeaturedBrands: React.FC<FeaturedBrandsProps> = ({
  brands,
  onSelectBrand,
  onViewAllBrands,
}) => {
  return (
    <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Global Tyre Manufacturing Partners
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Authorized Brands
          </h2>
          <p className="text-sm text-[#333333]/80 mt-1 max-w-xl">
            We hold exclusive and direct commercial distribution partnerships with premier international radial and OTR tyre manufacturers.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllBrands}
          className="text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1.5 transition-colors self-start md:self-end whitespace-nowrap"
        >
          <span>View All Brands</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Brands Grid with Matching Tyre Photography */}
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
              {/* Brand Representative Tyre Photo Banner */}
              <div className="relative h-48 w-full bg-[#F4F7FA] border-b border-slate-200 overflow-hidden">
                <img
                  src={tyrePhoto}
                  alt={`${brand.name} commercial tyre line`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-[#0A3C6E] text-white flex items-center justify-center font-display font-black text-sm shadow-sm">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
                {brand.tyreCount !== undefined && (
                  <span className="absolute top-3 right-3 text-[11px] font-mono font-semibold text-[#0A3C6E] bg-white/95 px-2.5 py-1 rounded border border-slate-200 tabular-nums">
                    {brand.tyreCount} Models
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg font-bold text-[#0A3C6E] group-hover:text-[#1783C1] transition-colors">
                    {brand.name}
                  </h3>

                  <p className="text-xs text-[#333333]/80 mt-1.5 line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1783C1] group-hover:text-[#0A3C6E] transition-colors">
                  <span>Explore Brand Lineup</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
