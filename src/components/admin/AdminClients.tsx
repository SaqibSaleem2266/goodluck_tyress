import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { CorporateClient } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface AdminClientsProps {
  clients: CorporateClient[];
  onRefresh: () => Promise<void>;
}

export const AdminClients: React.FC<AdminClientsProps> = ({ clients, onRefresh }) => {
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createCorporateClient({ name, sector, description });
    setName('');
    setSector('');
    setDescription('');
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
        Corporate Fleet Clients
      </h1>

      <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <input
          type="text"
          required
          placeholder="Client Organization *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
        />
        <input
          type="text"
          placeholder="Industry Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
        />
        <input
          type="text"
          placeholder="Fleet Supply Scope"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-[#1783C1]">{c.sector}</div>
              <div className="font-bold text-sm text-[#0A3C6E]">{c.name}</div>
              <p className="text-xs text-[#333333]/80 mt-1">{c.description}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await api.deleteCorporateClient(c.id);
                await onRefresh();
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded self-start"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
