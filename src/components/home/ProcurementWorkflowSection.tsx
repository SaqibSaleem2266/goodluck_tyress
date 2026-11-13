import React from 'react';
import { MapPin, Truck, ArrowRight, PhoneCall } from 'lucide-react';

interface ProcurementWorkflowSectionProps {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Axle & Size Selection',
    detail:
      'Match rim diameter, ply rating, and TKPH heat rating with your commercial fleet or earthmoving equipment requirements.',
  },
  {
    step: '02',
    title: 'Live Depot Allocation',
    detail:
      'Instant reservation from verified Port Qasim Customs-Bonded Hub and M.A. Jinnah Road central inventory.',
  },
  {
    step: '03',
    title: 'DOT & Batch Verification',
    detail:
      'Every tyre set undergoes serial marking verification, compound authenticity inspection, and load-index certification.',
  },
  {
    step: '04',
    title: 'Nationwide Freight Dispatch',
    detail:
      'Same-day container and axle-set loading to Karachi, Lahore, Faisalabad, Multan, Rawalpindi, Quetta, and Peshawar.',
  },
];

export const ProcurementWorkflowSection: React.FC<ProcurementWorkflowSectionProps> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  return (
    <section className="py-16 px-4 lg:px-8 bg-[#F4F7FA] border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
              B2B Wholesale & Fleet Logistics
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
              Bulk Ordering & Container Dispatch Process
            </h2>
            <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
              Streamlined commercial tyre procurement engineered to keep regional fleets, construction sites, and transit depots moving without downtime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/dealers')}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#0A3C6E] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1783C1]" />
              <span>View 7 Regional Depots</span>
            </button>
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="px-4 py-2.5 bg-[#1783C1] hover:bg-[#0A3C6E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Schedule Bulk Order</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-2xl text-[#1783C1] tabular-nums">
                    {item.step}
                  </span>
                  <Truck className="w-4 h-4 text-[#0A3C6E]/50" />
                </div>
                <h3 className="text-base font-bold text-[#0A3C6E] mb-2">{item.title}</h3>
                <p className="text-xs text-[#333333]/80 leading-relaxed">{item.detail}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-[#0A3C6E]/75 font-semibold">
                Standardized Fleet SLA
              </div>
            </div>
          ))}
        </div>

        {/* Regional Distribution Corridor Banner */}
        <div className="bg-[#0A3C6E] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest">
              Port Qasim · M.A. Jinnah Road · Badami Bagh Lahore · Rawalpindi · Multan · Peshawar
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-white">
              Need Urgent Highway Replacement or Full 40ft Container Pricing?
            </h3>
            <p className="text-xs text-slate-200 max-w-2xl">
              Speak directly with our commercial tyre desk for same-day CIF quotes, batch certificates, and fleet buffer stock contracts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/quote')}
            className="px-5 py-3 bg-[#1783C1] hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap"
          >
            <span>Open Wholesale Quote Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
