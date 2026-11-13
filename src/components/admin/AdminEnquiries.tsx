import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Enquiry } from '../../types/index.ts';
import { api } from '../../api/client.ts';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const load = () => api.getEnquiries().then(setEnquiries).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Enquiry['status']) => {
    await api.updateEnquiryStatus(id, status);
    await load();
  };

  const addNote = async (id: string) => {
    const text = noteInputs[id]?.trim();
    if (!text) return;
    await api.addEnquiryNote(id, text);
    setNoteInputs({ ...noteInputs, [id]: '' });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
            Customer Enquiries & Quote Pipeline
          </h1>
          <p className="text-xs text-[#333333]/75 mt-0.5">
            Track quotation requests, update follow-up statuses, and log internal sales notes.
          </p>
        </div>

        <a
          href={api.exportEnquiriesCsvUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white border border-slate-200 text-[#0A3C6E] text-xs font-bold uppercase rounded-lg inline-flex items-center gap-1.5 self-start"
        >
          <Download className="w-3.5 h-3.5 text-[#1783C1]" />
          <span>Export Enquiries CSV</span>
        </a>
      </div>

      <div className="space-y-4">
        {enquiries.map((e) => (
          <div key={e.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#1783C1] uppercase">
                  {e.type} · {e.city} · {new Date(e.createdAt).toLocaleString()}
                </div>
                <h2 className="text-base font-bold text-[#0A3C6E]">
                  {e.customerName} {e.companyName ? `(${e.companyName})` : ''}
                </h2>
                <div className="text-xs font-mono text-[#333333]/75">
                  {e.phone} {e.email ? `· ${e.email}` : ''}
                </div>
              </div>

              <select
                value={e.status}
                onChange={(ev) => updateStatus(e.id, ev.target.value as Enquiry['status'])}
                className="px-3 py-1.5 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs font-bold text-[#0A3C6E]"
              >
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {e.tyreName && (
              <div className="text-xs bg-[#F4F7FA] border border-slate-200 rounded-lg px-3 py-2 font-medium text-[#0A3C6E]">
                Product: {e.tyreName} {e.requestedSize ? `· Size: ${e.requestedSize}` : ''} {e.quantity ? `· Qty: ${e.quantity}` : ''}
              </div>
            )}

            <p className="text-xs text-[#333333]/90 leading-relaxed">{e.message}</p>

            {e.notes.length > 0 && (
              <div className="space-y-1 border-t border-slate-100 pt-2">
                {e.notes.map((n) => (
                  <div key={n.id} className="text-[11px] text-[#333333]/80">
                    <span className="font-bold text-[#0A3C6E]">{n.author}:</span> {n.note}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add internal sales note..."
                value={noteInputs[e.id] || ''}
                onChange={(ev) => setNoteInputs({ ...noteInputs, [e.id]: ev.target.value })}
                className="flex-1 px-3 py-1.5 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => addNote(e.id)}
                className="px-3 py-1.5 bg-[#0A3C6E] text-white text-xs font-bold rounded-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
