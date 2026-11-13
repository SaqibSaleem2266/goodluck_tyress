import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Tyre } from '../../types/index.ts';
import { TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface TyreCardProps {
  tyre: Tyre;
  onViewDetails: (tyre: Tyre) => void;
  onRequestQuote: (tyre: Tyre) => void;
}

export const TyreCard: React.FC<TyreCardProps> = ({
  tyre,
  onViewDetails,
  onRequestQuote,
}) => {
  const stockBadge =
    tyre.stockStatus === 'in_stock'
      ? {
          text: `In Stock · ${tyre.stockQuantity} Units`,
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        }
      : tyre.stockStatus === 'on_order'
        ? {
            text: 'On Order / Incoming',
            className: 'bg-sky-50 text-[#0A3C6E] border-sky-200',
          }
        : {
            text: 'Out of Stock',
            className: 'bg-slate-100 text-slate-600 border-slate-300',
          };

  return (
    <article
      onClick={() => onViewDetails(tyre)}
      className="group cursor-pointer bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A3C6E]/10 flex flex-col justify-between"
    >
      {/* Clickable Tyre Product Image Area */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(tyre);
        }}
        aria-label={`View ${tyre.name} specifications`}
        className="relative h-56 w-full bg-[#F4F7FA] border-b border-slate-200 overflow-hidden text-left block"
      >
        <img
          src={tyre.mainImage || TYRE_STUDIO_ASSETS.tbr}
          alt={tyre.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <span
          className={`absolute top-3 left-3 text-[11px] font-mono font-semibold px-2.5 py-1 rounded border ${stockBadge.className}`}
        >
          {stockBadge.text}
        </span>

        {tyre.isFeatured && (
          <span className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0A3C6E] text-white px-2 py-0.5 rounded">
            Featured
          </span>
        )}
      </button>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-1">
            <span className="font-bold uppercase tracking-wider text-[#1783C1]">
              {tyre.brandName || 'Commercial Radial'}
            </span>
            <span className="text-[#333333]/65">{tyre.sku}</span>
          </div>

          <h3 className="text-base font-bold text-[#0A3C6E] group-hover:text-[#1783C1] transition-colors leading-snug">
            {tyre.name}
          </h3>

          <div className="mt-2 text-xs font-mono text-[#333333]/80 font-medium">
            {tyre.plyRating} · {tyre.loadIndex}
            {tyre.speedRating} · {tyre.constructionType}
          </div>

          <div className="mt-1.5 text-xs font-mono font-semibold text-[#0A3C6E]">
            Sizes: {tyre.sizes.slice(0, 3).join(' · ')}
            {tyre.sizes.length > 3 ? ` (+${tyre.sizes.length - 3})` : ''}
          </div>

          <p className="text-xs text-[#333333]/80 mt-2.5 line-clamp-2 leading-relaxed">
            {tyre.shortDescription}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRequestQuote(tyre);
            }}
            className="flex-1 py-2 px-3 bg-[#1783C1] hover:bg-[#0A3C6E] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get Quote</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(tyre);
            }}
            className="py-2 px-3 bg-[#F4F7FA] hover:bg-slate-200/70 text-[#0A3C6E] border border-slate-200 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
