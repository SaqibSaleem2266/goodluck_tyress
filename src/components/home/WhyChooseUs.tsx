import React from 'react';
import { ShieldCheck, Warehouse, Gauge, Wrench, CheckCircle } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Certified Radials',
      description:
        'All tyre shipments are direct factory imports featuring manufacturer DOT stamps, certified ply ratings, and full compound authenticity.',
    },
    {
      icon: Warehouse,
      title: 'Real-Time Warehouse Stock',
      description:
        'Over 10,000 commercial and earthmover tyres stocked across our Port Qasim Central Logistics Hub and city terminals for immediate collection or freight dispatch.',
    },
    {
      icon: Gauge,
      title: 'Fleet & TKPH Engineering Advisory',
      description:
        'Our technical engineers analyze axle load distributions, operating ambient temperatures, and ton-kilometer-per-hour metrics to ensure maximum cost-per-kilometer savings.',
    },
    {
      icon: Wrench,
      title: 'High-Tensile Multi-Life Casings',
      description:
        'Engineered with premium all-steel 4-belt casing architecture that permits 2 to 3 subsequent cold retread recapping cycles, cutting total fleet operating costs.',
    },
  ];

  return (
    <section className="py-16 px-4 lg:px-8 bg-[#F4F7FA] border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Operational Superiority
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Why Choose Good Luck Tyres
          </h2>
          <p className="text-sm text-[#333333]/80 mt-2">
            Trusted by the country's largest freight haulers, mining contractors, and municipal transport authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl p-6 relative flex flex-col justify-between transition-all hover:shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#0A3C6E] text-white flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-6 h-6 text-sky-300" />
                  </div>
                  <h3 className="text-base font-bold text-[#0A3C6E] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#333333]/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-[#1783C1] font-mono font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
