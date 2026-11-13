import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Tyre } from '../types/index.ts';
import { TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';
import { TyreCard } from '../components/tyres/TyreCard.tsx';

interface TyreDetailPageProps {
  tyre: Tyre;
  relatedTyres: Tyre[];
  onBack: () => void;
  onRequestQuote: (tyre: Tyre) => void;
  onViewDetails: (tyre: Tyre) => void;
}

export const TyreDetailPage: React.FC<TyreDetailPageProps> = ({
  tyre,
  relatedTyres,
  onBack,
  onRequestQuote,
  onViewDetails,
}) => {
  const [activeImage, setActiveImage] = useState(tyre.mainImage);
  const [selectedSize, setSelectedSize] = useState(tyre.sizes[0] || '');

  useEffect(() => {
    setActiveImage(tyre.mainImage || TYRE_STUDIO_ASSETS.tbr);
    setSelectedSize(tyre.sizes[0] || '');
  }, [tyre.id, tyre.mainImage, tyre.sizes]);

  const gallery = [
    tyre.mainImage || TYRE_STUDIO_ASSETS.tbr,
    ...(tyre.galleryImages || []).filter((img) => img && img !== tyre.mainImage),
  ];

  const specRows = [
    { label: 'SKU Reference', value: tyre.sku },
    { label: 'Authorized Brand', value: tyre.brandName || 'Good Luck Tyres' },
    { label: 'Construction', value: tyre.constructionType },
    { label: 'Ply / Star Rating', value: tyre.plyRating },
    { label: 'Load / Speed Index', value: `${tyre.loadIndex}${tyre.speedRating}` },
    { label: 'Tread Pattern', value: tyre.treadPattern },
    { label: 'Tread Depth', value: tyre.treadDepth },
    { label: 'Primary Application', value: tyre.application },
    { label: 'Recommended Rim', value: tyre.technicalSpecs?.rimSize || 'Standard Commercial' },
    { label: 'Overall Diameter', value: tyre.technicalSpecs?.overallDiameter || 'Factory Spec' },
    { label: 'Section Width', value: tyre.technicalSpecs?.sectionWidth || 'Factory Spec' },
    { label: 'Max Load (Single)', value: tyre.technicalSpecs?.maxLoadSingle || 'Per Load Table' },
    { label: 'Max Load (Dual)', value: tyre.technicalSpecs?.maxLoadDual || 'N/A' },
    { label: 'Inflation Pressure', value: tyre.technicalSpecs?.inflationPressure || 'Manufacturer Spec' },
    { label: 'TKPH Rating', value: tyre.technicalSpecs?.tkph || 'Standard Duty' },
    { label: 'Origin', value: tyre.technicalSpecs?.originCountry || 'Certified Import' },
  ];

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tyre Catalogue</span>
      </button>

      {/* Main Split Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F4F7FA] border border-slate-200 rounded-2xl h-80 sm:h-96 overflow-hidden">
            <img
              src={activeImage || TYRE_STUDIO_ASSETS.tbr}
              alt={tyre.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.tbr;
              }}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl bg-[#F4F7FA] border overflow-hidden shrink-0 ${
                    activeImage === img
                      ? 'border-[#1783C1] ring-2 ring-[#1783C1]/25'
                      : 'border-slate-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${tyre.name} angle ${i + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Technical Summary & Quote CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1783C1]">
                {tyre.brandName}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-[#333333]/75">
                SKU: {tyre.sku}
              </span>
              <span className="text-slate-300">·</span>
              <span
                className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded border ${
                  tyre.stockStatus === 'in_stock'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : tyre.stockStatus === 'on_order'
                      ? 'bg-sky-50 text-[#0A3C6E] border-sky-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                {tyre.stockStatus === 'in_stock'
                  ? `In Stock (${tyre.stockQuantity} Units Ready)`
                  : tyre.stockStatus === 'on_order'
                    ? 'Incoming Port Shipment'
                    : 'Currently Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-[#0A3C6E] tracking-tight">
              {tyre.name}
            </h1>

            <p className="text-sm text-[#333333]/85 mt-3 leading-relaxed">
              {tyre.fullDescription || tyre.shortDescription}
            </p>
          </div>

          {/* Available Tyre Sizes */}
          <div className="bg-[#F4F7FA] border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A3C6E]">
              Available Fitment Sizes ({tyre.sizes.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {tyre.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-colors border ${
                    selectedSize === sz
                      ? 'bg-[#0A3C6E] text-white border-[#0A3C6E]'
                      : 'bg-white text-[#0A3C6E] border-slate-200 hover:border-[#1783C1]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          {tyre.features && tyre.features.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A3C6E]">
                Engineering & Compound Highlights
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tyre.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#333333]/90 bg-white border border-slate-200 rounded-lg p-3"
                  >
                    <CheckCircle className="w-4 h-4 text-[#1783C1] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onRequestQuote(tyre)}
              className="px-7 py-3.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#0A3C6E]/15 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Request Quote for {selectedSize || tyre.sku}</span>
            </button>

            <div className="flex items-center gap-4 text-xs text-[#333333]/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1783C1]" />
                <span>Factory DOT Certified</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#1783C1]" />
                <span>Port Qasim Dispatch</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Technical Specifications Matrix */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Engineering Datasheet
          </div>
          <h2 className="text-2xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Technical Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {specRows.map((row) => (
            <div
              key={row.label}
              className="bg-[#F4F7FA] border border-slate-200 rounded-xl p-4"
            >
              <div className="text-[11px] font-mono text-[#333333]/65 uppercase tracking-wider">
                {row.label}
              </div>
              <div className="text-sm font-bold text-[#0A3C6E] mt-1">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tyres */}
      {relatedTyres.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-slate-200">
          <h2 className="text-2xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Related Commercial Tyres
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTyres.slice(0, 3).map((rel) => (
              <TyreCard
                key={rel.id}
                tyre={rel}
                onViewDetails={onViewDetails}
                onRequestQuote={onRequestQuote}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
