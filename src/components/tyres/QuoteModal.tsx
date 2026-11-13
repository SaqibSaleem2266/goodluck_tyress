import React, { useState } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';
import { Tyre } from '../../types/index.ts';
import { api } from '../../api/client.ts';

interface QuoteModalProps {
  tyre?: Tyre | null;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ tyre, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [requestedSize, setRequestedSize] = useState(tyre?.sizes[0] || '');
  const [quantity, setQuantity] = useState(12);
  const [message, setMessage] = useState(
    tyre
      ? `Please send fleet quotation and current batch dispatch terms for ${tyre.name}.`
      : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.submitEnquiry({
        type: 'quote',
        customerName,
        companyName,
        phone,
        email,
        city,
        tyreId: tyre?.id,
        tyreName: tyre?.name,
        requestedSize,
        quantity,
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Could not submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-50 bg-[#06284B]/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="bg-[#0A3C6E] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-sky-300 uppercase tracking-wider">
              Commercial Wholesale Desk
            </div>
            <h2 id="quote-modal-title" className="text-lg font-display font-bold">
              Request a Tyre Quotation
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quote modal"
            className="p-1.5 text-slate-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0A3C6E]">
                Quotation Request Logged
              </h3>
              <p className="text-sm text-[#333333]/80">
                Our Port Qasim commercial sales desk has received your enquiry and will respond with current batch pricing and dispatch availability.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tyre && (
                <div className="bg-[#F4F7FA] border border-slate-200 rounded-lg p-3 text-xs">
                  <div className="font-bold text-[#0A3C6E]">{tyre.name}</div>
                  <div className="text-[#1783C1] font-mono mt-0.5">
                    {tyre.brandName} · SKU: {tyre.sku}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Company / Fleet Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Al-Fatah Logistics"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92-300-XXXXXXX"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Delivery City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fleet@company.com"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Tyre Size
                  </label>
                  {tyre && tyre.sizes.length > 0 ? (
                    <select
                      value={requestedSize}
                      onChange={(e) => setRequestedSize(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                    >
                      {tyre.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={requestedSize}
                      onChange={(e) => setRequestedSize(e.target.value)}
                      placeholder="e.g. 12R22.5"
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Requirements / Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs text-[#333333] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#333333] bg-[#F4F7FA] hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
