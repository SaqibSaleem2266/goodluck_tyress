import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { Dealer } from '../types/index.ts';

interface DealersPageProps {
  dealers: Dealer[];
  onOpenQuoteModal: () => void;
}

export const DealersPage: React.FC<DealersPageProps> = ({
  dealers,
  onOpenQuoteModal,
}) => {
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.city))).sort(),
    [dealers]
  );

  const visibleDealers = useMemo(
    () =>
      selectedCity === 'all'
        ? dealers
        : dealers.filter((d) => d.city === selectedCity),
    [dealers, selectedCity]
  );

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
            Nationwide Supply & Stock Points
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Dealer & Distribution Network
          </h1>
          <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
            Authorized regional warehouses and distribution offices supplying verified stock across Karachi, Lahore, Rawalpindi, Faisalabad, Multan, and Peshawar.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenQuoteModal}
          className="px-5 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 self-start md:self-end"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Become an Authorized Dealer</span>
        </button>
      </div>

      {/* City Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setSelectedCity('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedCity === 'all'
              ? 'bg-[#0A3C6E] text-white'
              : 'bg-[#F4F7FA] text-[#333333] border border-slate-200 hover:border-[#1783C1]'
          }`}
        >
          All Cities ({dealers.length})
        </button>
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setSelectedCity(city)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCity === city
                ? 'bg-[#1783C1] text-white'
                : 'bg-[#F4F7FA] text-[#333333] border border-slate-200 hover:border-[#1783C1]'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Dealers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDealers.map((dealer) => (
          <div
            key={dealer.id}
            className="bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl p-6 space-y-4 shadow-xs transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#1783C1] uppercase tracking-wider">
                  {dealer.city} · {dealer.region}
                </span>
                <h2 className="text-lg font-bold text-[#0A3C6E] mt-0.5">
                  {dealer.companyName}
                </h2>
              </div>
              <MapPin className="w-5 h-5 text-[#1783C1] shrink-0" />
            </div>

            <div className="space-y-2 text-xs text-[#333333]/85 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0A3C6E] shrink-0 mt-0.5" />
                <span>{dealer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0A3C6E] shrink-0" />
                <span className="font-mono">{dealer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0A3C6E] shrink-0" />
                <span>{dealer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#0A3C6E] shrink-0" />
                <span>{dealer.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
