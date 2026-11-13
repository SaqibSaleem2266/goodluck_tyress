import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { DownloadItem } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface AdminDownloadsProps {
  downloads: DownloadItem[];
  onRefresh: () => Promise<void>;
}

export const AdminDownloads: React.FC<AdminDownloadsProps> = ({
  downloads,
  onRefresh,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Master Catalogue');
  const [fileUrl, setFileUrl] = useState('/api/tyres');
  const [description, setDescription] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createDownload({ title, category, fileUrl, description });
    setTitle('');
    setDescription('');
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
        Catalogues & Technical Downloads
      </h1>

      <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <input
          type="text"
          required
          placeholder="Document Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
        />
        <input
          type="text"
          required
          placeholder="File URL *"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add File</span>
        </button>
      </form>

      <div className="space-y-3">
        {downloads.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-[#1783C1]">{d.category} · {d.fileSize}</div>
              <div className="font-bold text-sm text-[#0A3C6E]">{d.title}</div>
              <div className="text-xs text-[#333333]/75">{d.description}</div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await api.deleteDownload(d.id);
                await onRefresh();
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
