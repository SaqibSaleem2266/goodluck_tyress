import React from 'react';
import { Building2, ShieldCheck, Truck, Gauge, MessageSquare } from 'lucide-react';
import { CorporateClient } from '../types/index.ts';

interface CorporateClientsPageProps {
  clients: CorporateClient[];
  onOpenQuoteModal: () => void;
}

export const CorporateClientsPage: React.FC<CorporateClientsPageProps> = ({
  clients,
  onOpenQuoteModal,
}) => {
  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Enterprise Fleet Contracts
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Corporate Clients & Fleet Partners
          </h1>
          <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
            Good Luck Tyres partners with Pakistan's largest container transporters, mining contractors, industrial terminals, and intercity passenger operators.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenQuoteModal}
          className="px-5 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 self-start md:self-end"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Open Corporate Account</span>
        </button>
      </div>

      {/* Key Fleet SLA Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Truck,
            title: 'Dedicated Buffer Stock Allocation',
            detail:
              'Reserved container quantities held at Port Qasim Hub so contracted fleets never face route downtime.',
          },
          {
            icon: Gauge,
            title: 'CPK & TKPH Field Audits',
            detail:
              'Periodic tyre pressure, alignment wear, and heat-rate inspections by our technical advisory team.',
          },
          {
            icon: ShieldCheck,
            title: 'Guaranteed Batch Traceability',
            detail:
              'Every wholesale invoice includes DOT production codes, manufacturer origin documentation, and warranty terms.',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#F4F7FA] border border-slate-200 rounded-xl p-6 space-y-3"
            >
              <div className="w-11 h-11 rounded-lg bg-[#0A3C6E] text-white flex items-center justify-center">
                <Icon className="w-5 h-5 text-sky-300" />
              </div>
              <h2 className="text-base font-bold text-[#0A3C6E]">{item.title}</h2>
              <p className="text-xs text-[#333333]/80 leading-relaxed">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl p-6 space-y-3 shadow-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#F4F7FA] border border-slate-200 flex items-center justify-center text-[#1783C1] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#1783C1] uppercase tracking-wider">
                  {client.sector}
                </div>
                <h3 className="text-base font-bold text-[#0A3C6E] leading-snug">
                  {client.name}
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#333333]/80 leading-relaxed">
              {client.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
