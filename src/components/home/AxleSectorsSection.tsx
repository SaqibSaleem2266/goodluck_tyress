import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface AxleSectorsSectionProps {
  onNavigate: (path: string) => void;
}

const SECTORS = [
  {
    id: 'tbr-haulage',
    code: 'Highway Fleet',
    title: 'Line-Haul Prime Movers & Coaches',
    specs: '12R22.5 · 295/80R22.5 · 315/80R22.5',
    description:
      'Steer, drive, and trailer axle radials engineered with stone-ejector grooves and 4-belt casings for long-distance freight and intercity passenger transport.',
    image: TYRE_STUDIO_ASSETS.tbr,
    target: '/categories/cat-tbr',
  },
  {
    id: 'otr-mining',
    code: 'Mining & Quarry',
    title: 'Earthmovers, Loaders & Dumpers',
    specs: '23.5R25 · 17.5R25 · 29.5R25 E-4/L-5',
    description:
      'Deep rock-lug OTR treads compounded for maximum cut, chip, and heat resistance across cement quarries, dam construction, and open-pit mines.',
    image: TYRE_STUDIO_ASSETS.otr,
    target: '/categories/cat-otr',
  },
  {
    id: 'agri-machinery',
    code: 'Mechanized Farming',
    title: 'Agricultural Tractors & Harvesters',
    specs: '18.4-30 · 16.9-28 · 12.4-24 R-1',
    description:
      'High-angle self-cleaning traction cleats designed for low soil compaction and maximum drawbar pull on heavy agricultural equipment.',
    image: TYRE_STUDIO_ASSETS.agri,
    target: '/categories/cat-agri',
  },
  {
    id: 'port-industrial',
    code: 'Port & Warehouse',
    title: 'Reach Stackers & Heavy Forklifts',
    specs: '18.00-25 · 7.00-12 · 28x9-15 Solid',
    description:
      'Ultra-stable pneumatic and resilient solid industrial tyres engineered for container yards, steel mills, and 24/7 port logistics terminals.',
    image: TYRE_STUDIO_ASSETS.industrial,
    target: '/categories/cat-industrial',
  },
];

export const AxleSectorsSection: React.FC<AxleSectorsSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Engineered By Industry Sector
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Fleet & Terrain Applications
          </h2>
          <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
            Match your operating terrain and axle position to factory-certified radial compounds stocked at Port Qasim.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/finder')}
          className="text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1.5 transition-colors self-start md:self-end whitespace-nowrap"
        >
          <span>Open Tyre Finder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            type="button"
            onClick={() => onNavigate(sector.target)}
            className="group text-left bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A3C6E]/10 flex flex-col justify-between"
          >
            <div className="h-44 w-full bg-[#F4F7FA] border-b border-slate-200 overflow-hidden">
              <img
                src={sector.image}
                alt={sector.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between w-full">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#1783C1] uppercase tracking-wider">
                  {sector.code}
                </div>
                <h3 className="text-base font-bold text-[#0A3C6E] mt-1 group-hover:text-[#1783C1] transition-colors leading-snug">
                  {sector.title}
                </h3>
                <div className="text-[11px] font-mono text-[#333333]/75 mt-1.5 font-medium">
                  {sector.specs}
                </div>
                <p className="text-xs text-[#333333]/80 mt-2 leading-relaxed line-clamp-3">
                  {sector.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1783C1] group-hover:text-[#0A3C6E]">
                <span>Explore Sector Stock</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
