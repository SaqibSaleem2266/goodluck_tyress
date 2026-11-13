import React, { useEffect, useState } from 'react';
import {
  Disc,
  Boxes,
  AlertTriangle,
  MessageSquare,
  PlusCircle,
  Image,
  ArrowRight,
} from 'lucide-react';
import { DashboardStats, Enquiry, Tyre } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface AdminDashboardProps {
  tyres: Tyre[];
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tyres,
  onNavigate,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(() => {});
    api.getEnquiries().then(setEnquiries).catch(() => {});
  }, [tyres.length]);

  const lowStockTyres = tyres.filter(
    (t) => t.stockQuantity <= t.minimumStockAlert
  );

  const cards = [
    {
      label: 'Published Tyres',
      value: stats ? `${stats.publishedTyres} / ${stats.totalTyres}` : `${tyres.length}`,
      icon: Disc,
      accent: 'text-[#1783C1]',
      target: '/admin/products',
    },
    {
      label: 'Total Units in Stock',
      value: stats ? stats.totalStockUnits.toLocaleString() : '—',
      icon: Boxes,
      accent: 'text-emerald-600',
      target: '/admin/inventory',
    },
    {
      label: 'Low / Out of Stock',
      value: stats ? `${stats.lowStockCount + stats.outOfStockCount}` : `${lowStockTyres.length}`,
      icon: AlertTriangle,
      accent: 'text-amber-600',
      target: '/admin/inventory',
    },
    {
      label: 'New Quote Enquiries',
      value: stats ? `${stats.newEnquiriesCount}` : `${enquiries.filter((e) => e.status === 'new').length}`,
      icon: MessageSquare,
      accent: 'text-[#0A3C6E]',
      target: '/admin/enquiries',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs text-[#333333]/75 mt-0.5">
            Real-time stock balances, quote pipeline, and homepage slider controls.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/admin/products/new')}
            className="px-4 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Tyre</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/admin/banners')}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0A3C6E] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Image className="w-3.5 h-3.5 text-[#1783C1]" />
            <span>Manage Banners</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigate(card.target)}
              className="text-left bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl p-5 shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#333333]/75">
                  {card.label}
                </span>
                <Icon className={`w-5 h-5 ${card.accent}`} />
              </div>
              <div className="text-2xl font-display font-black text-[#0A3C6E] tabular-nums">
                {card.value}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two-Column Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
              Low Stock Watchlist
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/admin/inventory')}
              className="text-xs font-semibold text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1"
            >
              <span>Adjust Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockTyres.length === 0 ? (
            <div className="text-xs text-[#333333]/70 py-4">
              All tyre SKUs are comfortably above minimum alert thresholds.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockTyres.slice(0, 5).map((t) => (
                <div key={t.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-[#0A3C6E]">{t.name}</div>
                    <div className="text-[11px] font-mono text-[#333333]/65">{t.sku}</div>
                  </div>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded tabular-nums">
                    {t.stockQuantity} units
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
              Recent Customer Enquiries
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/admin/enquiries')}
              className="text-xs font-semibold text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1"
            >
              <span>Open Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-xs text-[#333333]/70 py-4">No enquiries logged yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enquiries.slice(0, 5).map((e) => (
                <div key={e.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-[#0A3C6E] truncate">
                      {e.customerName} {e.companyName ? `· ${e.companyName}` : ''}
                    </div>
                    <div className="text-[11px] text-[#333333]/70 truncate">
                      {e.tyreName || e.message}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F4F7FA] border border-slate-200 text-[#0A3C6E] shrink-0">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
