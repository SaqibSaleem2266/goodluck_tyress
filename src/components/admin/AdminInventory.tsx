import React, { useEffect, useState } from 'react';
import { Download, Save } from 'lucide-react';
import { InventoryHistory, Tyre } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface AdminInventoryProps {
  tyres: Tyre[];
  onRefresh: () => Promise<void>;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  tyres,
  onRefresh,
}) => {
  const [tab, setTab] = useState<'stock' | 'history'>('stock');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<InventoryHistory[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, number> = {};
    for (const t of tyres) {
      map[t.id] = t.stockQuantity;
    }
    setQuantities(map);
  }, [tyres]);

  useEffect(() => {
    if (tab === 'history') {
      api.getInventoryHistory().then(setHistory).catch(() => {});
    }
  }, [tab]);

  const handleSaveStock = async (tyre: Tyre) => {
    setSavingId(tyre.id);
    try {
      const qty = Math.max(0, Number(quantities[tyre.id] ?? tyre.stockQuantity));
      await api.updateStock(tyre.id, {
        stockQuantity: qty,
        reason: 'Admin Console Stock Adjustment',
      });
      await onRefresh();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
            Real-Time Warehouse Inventory
          </h1>
          <p className="text-xs text-[#333333]/75 mt-0.5">
            Adjust unit counts and automatically sync live availability across all storefront pages.
          </p>
        </div>

        <a
          href={api.exportInventoryCsvUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0A3C6E] text-xs font-bold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 self-start"
        >
          <Download className="w-3.5 h-3.5 text-[#1783C1]" />
          <span>Export Inventory CSV</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setTab('stock')}
          className={`px-4 py-2 rounded-lg text-xs font-bold ${
            tab === 'stock'
              ? 'bg-[#0A3C6E] text-white'
              : 'bg-white text-[#333333] border border-slate-200'
          }`}
        >
          Live Stock Levels ({tyres.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-bold ${
            tab === 'history'
              ? 'bg-[#0A3C6E] text-white'
              : 'bg-white text-[#333333] border border-slate-200'
          }`}
        >
          Adjustment History
        </button>
      </div>

      {tab === 'stock' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7FA] border-b border-slate-200 text-[11px] font-mono uppercase text-[#0A3C6E]">
                <th className="py-3 px-2.5">SKU</th>
                <th className="py-3 px-2.5">Tyre Model</th>
                <th className="py-3 px-2.5">Status</th>
                <th className="py-3 px-2.5">Min Alert</th>
                <th className="py-3 px-2.5">Units</th>
                <th className="py-3 px-2.5 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tyres.map((tyre) => (
                <tr key={tyre.id} className="hover:bg-[#F4F7FA]/50">
                  <td className="py-3 px-2.5 font-mono text-[11px] text-[#1783C1] font-bold">
                    {tyre.sku}
                  </td>
                  <td className="py-3 px-2.5 font-semibold text-[#0A3C6E]">
                    {tyre.name}
                  </td>
                  <td className="py-3 px-2.5">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        tyre.stockStatus === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : tyre.stockStatus === 'on_order'
                            ? 'bg-sky-50 text-[#0A3C6E] border-sky-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {tyre.stockStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2.5 font-mono tabular-nums">
                    {tyre.minimumStockAlert}
                  </td>
                  <td className="py-3 px-2.5">
                    <input
                      type="number"
                      min={0}
                      value={quantities[tyre.id] ?? tyre.stockQuantity}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [tyre.id]: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      className="w-20 px-2 py-1 bg-[#F4F7FA] border border-slate-200 rounded font-mono text-xs tabular-nums"
                    />
                  </td>
                  <td className="py-3 px-2.5 text-right">
                    <button
                      type="button"
                      disabled={savingId === tyre.id}
                      onClick={() => handleSaveStock(tyre)}
                      className="px-3 py-1.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-[11px] font-bold rounded-lg inline-flex items-center gap-1 transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      <span>{savingId === tyre.id ? 'Saving' : 'Save'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7FA] border-b border-slate-200 text-[11px] font-mono uppercase text-[#0A3C6E]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Tyre</th>
                <th className="py-3 px-3">Change</th>
                <th className="py-3 px-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#333333]/65">
                    No inventory adjustments recorded yet.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id}>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {new Date(h.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono">{h.sku}</td>
                    <td className="py-3 px-3 font-semibold text-[#0A3C6E]">{h.tyreName}</td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {h.previousQuantity} → {h.newQuantity}
                    </td>
                    <td className="py-3 px-3">{h.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
