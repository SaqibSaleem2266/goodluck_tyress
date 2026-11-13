import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Tyre } from '../types/index.ts';
import { api } from '../api/client.ts';

interface RequestQuotePageProps {
  tyres: Tyre[];
}

export const RequestQuotePage: React.FC<RequestQuotePageProps> = ({ tyres }) => {
  const [selectedTyreId, setSelectedTyreId] = useState(tyres[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [requestedSize, setRequestedSize] = useState('');
  const [quantity, setQuantity] = useState(20);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const selectedTyre = tyres.find((t) => t.id === selectedTyreId);

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
        tyreId: selectedTyre?.id,
        tyreName: selectedTyre?.name,
        requestedSize: requestedSize || selectedTyre?.sizes[0],
        quantity,
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
          Wholesale & Fleet Quotation Desk
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Request a Commercial Tyre Quote
        </h1>
        <p className="text-sm text-[#333333]/80 mt-1">
          Submit your required tyre model, axle quantity, and destination city for direct Port Qasim wholesale rates.
        </p>
      </div>

      <div className="bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-[#0A3C6E]">
              Wholesale Quotation Submitted
            </h2>
            <p className="text-sm text-[#333333]/80 max-w-md mx-auto">
              Your fleet enquiry has been logged into the Good Luck Tyres sales pipeline. Our commercial team will respond promptly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-[#0A3C6E] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Select Tyre Model
                </label>
                <select
                  value={selectedTyreId}
                  onChange={(e) => setSelectedTyreId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                >
                  <option value="">General Fleet / Multiple Models</option>
                  {tyres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Required Tyre Size
                </label>
                <input
                  type="text"
                  value={requestedSize}
                  onChange={(e) => setRequestedSize(e.target.value)}
                  placeholder={selectedTyre?.sizes[0] || 'e.g. 12R22.5 or 23.5R25'}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
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
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
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
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                />
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
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">
                Fleet Requirements & Delivery Notes *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify vehicle type, route terrain, or urgent dispatch timeline..."
                className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Quotation Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
