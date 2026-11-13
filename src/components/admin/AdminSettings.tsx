import React, { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface AdminSettingsProps {
  settings: WebsiteSettings;
  onRefresh: () => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [form, setForm] = useState<WebsiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(form);
    await onRefresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    'w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
          Website & Branding Settings
        </h1>
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Website settings updated live.</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Top Announcement Banner</label>
          <input
            type="text"
            value={form.announcementText}
            onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Primary Phone</label>
            <input
              type="text"
              value={form.primaryPhone}
              onChange={(e) => setForm({ ...form, primaryPhone: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">WhatsApp</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Email</label>
            <input
              type="email"
              value={form.primaryEmail}
              onChange={(e) => setForm({ ...form, primaryEmail: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Headquarters Address</label>
            <input
              type="text"
              value={form.headquartersAddress}
              onChange={(e) => setForm({ ...form, headquartersAddress: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Port Qasim Hub Address</label>
            <input
              type="text"
              value={form.portDepotAddress}
              onChange={(e) => setForm({ ...form, portDepotAddress: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
