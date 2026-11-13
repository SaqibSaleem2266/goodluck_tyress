import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { api } from '../api/client.ts';

interface ContactUsPageProps {
  settings: WebsiteSettings;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ settings }) => {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.submitEnquiry({
        type: 'contact',
        customerName,
        companyName,
        phone,
        email,
        city,
        message,
      });
      setSent(true);
      setCustomerName('');
      setCompanyName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div>
        <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
          National Wholesale & Fleet Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Contact Good Luck Tyres
        </h1>
        <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
          Reach our central Karachi trade office, Port Qasim logistics terminal, or regional distribution managers directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Direct Contact Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0A3C6E] text-white rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-display font-bold">
              Direct Distribution Offices
            </h2>

            <div className="space-y-4 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1783C1] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Central Head Office</div>
                  <div>{settings.headquartersAddress}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1783C1] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Port Qasim Logistics Hub</div>
                  <div>{settings.portDepotAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1783C1] shrink-0" />
                <div>
                  <div className="font-bold text-white">Sales & Dispatch Desk</div>
                  <div className="font-mono">{settings.primaryPhone} · {settings.whatsappNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1783C1] shrink-0" />
                <div>
                  <div className="font-bold text-white">Official Email</div>
                  <div>{settings.primaryEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1783C1] shrink-0" />
                <div>
                  <div className="font-bold text-white">Operating Hours</div>
                  <div>{settings.businessHours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-8">
          {sent ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-[#0A3C6E]">Message Received</h2>
              <p className="text-sm text-[#333333]/80 max-w-md mx-auto">
                Thank you for contacting Good Luck Tyres. Our regional trade representative will reply shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="px-5 py-2 bg-[#0A3C6E] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-display font-bold text-[#0A3C6E]">
                Send an Enquiry
              </h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {error}
                </div>
              )}

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
                    Company / Fleet
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-[#1783C1] rounded-lg text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Send Enquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
