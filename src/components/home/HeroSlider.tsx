import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MessageSquare } from 'lucide-react';
import { Banner } from '../../types/index.ts';
import { TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface HeroSliderProps {
  banners: Banner[];
  onNavigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  banners,
  onNavigate,
  onOpenQuoteModal,
}) => {
  const activeBanners = useMemo(() => {
    return banners
      .filter((b) => b.isActive !== false)
      .slice()
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [banners]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slideKey = activeBanners.map((b) => b.id).join('|');
  useEffect(() => {
    setCurrentSlide(0);
  }, [slideKey]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const slides: Banner[] =
    activeBanners.length > 0
      ? activeBanners
      : [
          {
            id: 'fallback-hero',
            title: 'Direct Importers & National Distributors of Commercial Tyres',
            subtitle:
              'Certified TBR, OTR Earthmover, Industrial, and Agricultural tyres ready for immediate nationwide dispatch from Port Qasim.',
            ctaText: 'Browse Tyre Catalogue',
            ctaLink: '/tyres',
            secondaryCtaText: 'Request Bulk Quote',
            secondaryCtaLink: 'modal:quote',
            imageUrl: TYRE_STUDIO_ASSETS.heroWarehouse,
            isActive: true,
            displayOrder: 1,
          },
        ];

  const safeIndex = currentSlide >= slides.length ? 0 : currentSlide;
  const activeSlide = slides[safeIndex];

  const handleAction = (link?: string) => {
    if (!link) return;
    if (link === 'modal:quote') {
      onOpenQuoteModal();
      return;
    }
    onNavigate(link);
  };

  return (
    <section
      aria-label="Featured Tyre Distribution Showcase"
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] bg-[#06284B] overflow-hidden"
    >
      {/* Background Slide Image */}
      <img
        key={activeSlide.id}
        src={activeSlide.imageUrl || TYRE_STUDIO_ASSETS.heroWarehouse}
        alt={activeSlide.title}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = TYRE_STUDIO_ASSETS.heroWarehouse;
        }}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
      />

      {/* Corporate Navy Overlay for crisp legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06284B]/95 via-[#0A3C6E]/80 to-[#06284B]/45" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-5">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-sky-300">
            Good Luck Tyres · International Wholesale Distribution
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-[1.1] tracking-tight">
            {activeSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            {activeSlide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleAction(activeSlide.ctaLink || '/tyres')}
              className="px-6 py-3.5 bg-[#1783C1] hover:bg-sky-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-[#06284B]/40 transition-all flex items-center gap-2"
            >
              <span>{activeSlide.ctaText || 'Browse Catalogue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleAction(activeSlide.secondaryCtaLink || 'modal:quote')
              }
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/30 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-sky-300" />
              <span>{activeSlide.secondaryCtaText || 'Request Wholesale Quote'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#06284B]/70 hover:bg-[#1783C1] border border-white/20 text-white items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#06284B]/70 hover:bg-[#1783C1] border border-white/20 text-white items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-10 right-6 lg:right-12 z-20 flex items-center gap-3">
            <span className="text-xs font-mono text-white/80 tabular-nums">
              {String(safeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show slide ${idx + 1}: ${s.title}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === safeIndex
                      ? 'w-7 bg-[#1783C1]'
                      : 'w-2 bg-white/40 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
