import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, Edit2, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { Brand, Tyre } from '../../types/index.ts';
import { api } from '../../api/client.ts';
import { TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface AdminProductsProps {
  tyres: Tyre[];
  brands: Brand[];
  onAddNew: () => void;
  onEditTyre: (tyre: Tyre) => void;
  onRefresh: () => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  tyres,
  brands,
  onAddNew,
  onEditTyre,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tyres.filter((t) => {
      if (brandFilter !== 'all' && t.brandId !== brandFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.sku.toLowerCase().includes(q) ||
        t.sizes.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [tyres, search, brandFilter]);

  const togglePublish = async (tyre: Tyre) => {
    setBusyId(tyre.id);
    try {
      await api.updateTyre(tyre.id, {
        publishingStatus:
          tyre.publishingStatus === 'published' ? 'draft' : 'published',
      });
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDuplicate = async (tyre: Tyre) => {
    setBusyId(tyre.id);
    try {
      await api.duplicateTyre(tyre.id);
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (tyre: Tyre) => {
    setBusyId(tyre.id);
    try {
      await api.deleteTyre(tyre.id);
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
            Tyre Catalogue Management
          </h1>
          <p className="text-xs text-[#333333]/75 mt-0.5">
            Create, edit, duplicate, publish, or remove tyres across your dynamic catalogue.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="px-4 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Tyre</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1783C1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by model name, SKU, or size..."
            className="w-full pl-9 pr-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs outline-none focus:border-[#1783C1]"
          />
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs outline-none"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F7FA] border-b border-slate-200 text-[11px] font-mono uppercase text-[#0A3C6E]">
              <th className="py-3 px-3">Tyre Product</th>
              <th className="py-3 px-3">Brand</th>
              <th className="py-3 px-3">Sizes</th>
              <th className="py-3 px-3">Stock</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((tyre) => (
              <tr key={tyre.id} className="hover:bg-[#F4F7FA]/60">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tyre.mainImage || TYRE_STUDIO_ASSETS.tbr}
                      alt={tyre.name}
                      className="w-10 h-10 object-contain rounded bg-[#F4F7FA] border border-slate-200 p-1 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-[#0A3C6E]">{tyre.name}</div>
                      <div className="text-[11px] font-mono text-[#333333]/65">
                        {tyre.sku}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 font-medium">{tyre.brandName}</td>
                <td className="py-3 px-3 font-mono text-[11px]">
                  {tyre.sizes.slice(0, 2).join(', ')}
                  {tyre.sizes.length > 2 ? ` +${tyre.sizes.length - 2}` : ''}
                </td>
                <td className="py-3 px-3 font-mono font-bold tabular-nums">
                  {tyre.stockQuantity}
                </td>
                <td className="py-3 px-3">
                  <button
                    type="button"
                    disabled={busyId === tyre.id}
                    onClick={() => togglePublish(tyre)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border ${
                      tyre.publishingStatus === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {tyre.publishingStatus === 'published' ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditTyre(tyre)}
                      aria-label={`Edit ${tyre.name}`}
                      className="p-1.5 text-[#0A3C6E] hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === tyre.id}
                      onClick={() => handleDuplicate(tyre)}
                      aria-label={`Duplicate ${tyre.name}`}
                      className="p-1.5 text-[#1783C1] hover:bg-slate-100 rounded"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === tyre.id}
                      onClick={() => handleDelete(tyre)}
                      aria-label={`Delete ${tyre.name}`}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
