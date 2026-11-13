import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { Dealer } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface AdminDealersProps {
  dealers: Dealer[];
  onRefresh: () => Promise<void>;
}

export const AdminDealers: React.FC<AdminDealersProps> = ({ dealers, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Dealer | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const openNew = () => {
    setEditing(null);
    setCompanyName('');
    setCity('');
    setRegion('');
    setAddress('');
    setPhone('');
    setEmail('');
    setShowForm(true);
  };

  const openEdit = (d: Dealer) => {
    setEditing(d);
    setCompanyName(d.companyName);
    setCity(d.city);
    setRegion(d.region);
    setAddress(d.address);
    setPhone(d.phone);
    setEmail(d.email);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.updateDealer(editing.id, { companyName, city, region, address, phone, email });
    } else {
      await api.createDealer({ companyName, city, region, address, phone, email });
    }
    setShowForm(false);
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    await api.deleteDealer(id);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
          Dealer Network Branches
        </h1>
        <button
          type="button"
          onClick={openNew}
          className="px-4 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Dealer Branch</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Branch Name *"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              required
              placeholder="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="Region / Province"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs bg-[#F4F7FA] rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-bold bg-[#0A3C6E] text-white rounded-lg">
              Save Branch
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dealers.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="font-mono font-bold text-[#1783C1]">{d.city} · {d.region}</div>
              <div className="font-bold text-sm text-[#0A3C6E]">{d.companyName}</div>
              <div className="text-[#333333]/80">{d.address}</div>
              <div className="font-mono text-[#333333]/75">{d.phone} · {d.email}</div>
            </div>
            <div className="flex gap-1 self-start">
              <button type="button" onClick={() => openEdit(d)} className="p-1.5 text-[#0A3C6E] hover:bg-slate-100 rounded">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => handleDelete(d.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
