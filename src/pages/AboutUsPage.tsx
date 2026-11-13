import React from 'react';
import { ShieldCheck, Warehouse, Globe, MessageSquare } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { TYRE_STUDIO_ASSETS } from '../utils/tyreImages.ts';
import { StatsSection } from '../components/home/StatsSection.tsx';

interface AboutUsPageProps {
  settings: WebsiteSettings;
  onOpenQuoteModal: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  settings,
  onOpenQuoteModal,
}) => {
  return (
    <div className="w-full bg-white text-[#333333] min-h-screen">
      <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest">
              Corporate Heritage & Distribution Scale
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
              About Good Luck Tyres
            </h1>
            <p className="text-sm sm:text-base text-[#333333]/85 leading-relaxed">
              {settings.footerAbout}
            </p>
            <p className="text-sm text-[#333333]/80 leading-relaxed">
              Operating from our historic central trade office at Plaza Quarters (M.A. Jinnah Road, Karachi) and our customs-bonded Port Qasim Logistics Hub, we maintain high-volume ready stock for Advance, Samson, Runway, GT Radial, Magnum-V, and Super Samson tyres across all 7 national regional depots.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="px-6 py-3 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect With Our Trade Desk</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-[#0A3C6E]/10">
            <img
              src={TYRE_STUDIO_ASSETS.heroWarehouse}
              alt="Good Luck Tyres Port Qasim Warehouse"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Warehouse,
              title: 'Port Qasim Bonded Capacity',
              text: 'Dedicated container yards ensuring continuous batch turnover and fresh DOT manufacturing dates.',
            },
            {
              icon: ShieldCheck,
              title: 'Certified Import Compliance',
              text: '100% genuine factory-sourced tyres backed by ECE, DOT, and ISO 9001 quality documentation.',
            },
            {
              icon: Globe,
              title: 'International Factory Partnerships',
              text: 'Direct wholesale trade links with global TBR, OTR earthmover, and agricultural tyre manufacturers.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-[#F4F7FA] border border-slate-200 rounded-xl p-6 space-y-2.5"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0A3C6E] text-white flex items-center justify-center">
                  <Icon className="w-5 h-5 text-sky-300" />
                </div>
                <h2 className="text-base font-bold text-[#0A3C6E]">{item.title}</h2>
                <p className="text-xs text-[#333333]/80 leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <StatsSection />
    </div>
  );
};
