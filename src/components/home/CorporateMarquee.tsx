import React from 'react';
import { CorporateClient } from '../../types/index.ts';
import { Building2, ArrowRight } from 'lucide-react';

interface CorporateMarqueeProps {
  clients: CorporateClient[];
  onViewAllClients: () => void;
}

export const CorporateMarquee: React.FC<CorporateMarqueeProps> = ({
  clients,
  onViewAllClients,
}) => {
  return (
    <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Enterprise Fleet Partnerships
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Corporate Clients
          </h2>
          <p className="text-sm text-[#333333]/80 mt-1 max-w-xl">
            Trusted by the premier logistics, bulk transit, and open-pit mining operations across Pakistan.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllClients}
          className="text-xs font-semibold uppercase tracking-wider text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1.5 transition-colors self-start md:self-end whitespace-nowrap"
        >
          <span>View Fleet Solutions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl p-5 flex items-start gap-4 transition-colors shadow-xs"
          >
            <div className="w-12 h-12 rounded-lg bg-[#F4F7FA] border border-slate-200 flex items-center justify-center shrink-0 text-[#0A3C6E]">
              <Building2 className="w-6 h-6 text-[#1783C1]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A3C6E]">{client.name}</h3>
              <p className="text-xs text-[#333333]/80 mt-1 line-clamp-2 leading-relaxed">
                {client.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
