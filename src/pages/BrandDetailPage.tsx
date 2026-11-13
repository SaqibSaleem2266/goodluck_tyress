import React from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { Brand, Tyre } from '../types/index.ts';
import { resolveBrandImage, TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';
import { TyreCard } from '../components/tyres/TyreCard.tsx';

interface BrandDetailPageProps {
  brand: Brand;
  tyres: Tyre[];
  onBack: () => void;
  onViewDetails: (tyre: Tyre) => void;
  onRequestQuote: (tyre: Tyre) => void;
}

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({
  brand,
  tyres,
  onBack,
  onViewDetails,
  onRequestQuote,
}) => {
  const brandTyres = tyres.filter((t) => t.brandId === brand.id);
  const coverImage = resolveBrandImage(brand);

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Authorized Brands</span>
      </button>

      <div className="bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0A3C6E] text-white flex items-center justify-center font-display font-black text-lg">
              {brand.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest">
                Authorized Distribution Brand
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
                {brand.name}
              </h1>
            </div>
          </div>

          <p className="text-sm text-[#333333]/85 leading-relaxed max-w-2xl">
            {brand.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[#0A3C6E] font-bold">
              {brandTyres.length} Published Tyre Models
            </span>
            {brand.websiteUrl && (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1783C1] hover:text-[#0A3C6E] font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Manufacturer Website</span>
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 h-56 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <img
            src={coverImage}
            alt={brand.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
            }}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          {brand.name} Catalogue
        </h2>

        {brandTyres.length === 0 ? (
          <div className="bg-[#F4F7FA] border border-slate-200 rounded-xl p-8 text-center text-sm text-[#333333]/80">
            No tyres are currently published under {brand.name}. Please contact our sales desk for special container procurement.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandTyres.map((tyre) => (
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
