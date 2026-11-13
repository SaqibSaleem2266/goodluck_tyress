import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="w-full bg-white text-[#333333] min-h-screen py-12 px-4 lg:px-8 max-w-4xl mx-auto space-y-6">
    <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest">
      Legal & Data Governance
    </div>
    <h1 className="text-3xl font-display font-black text-[#0A3C6E] uppercase">
      Privacy Policy
    </h1>
    <div className="space-y-4 text-sm text-[#333333]/85 leading-relaxed bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-8">
      <p>
        Good Luck Tyres respects the confidentiality of commercial fleet clients, dealers, and prospective wholesale buyers who submit quotation requests or contact enquiries through this portal.
      </p>
      <p>
        Submitted contact names, phone numbers, company details, and fleet specifications are used strictly for commercial pricing quotations, Port Qasim batch reservations, and regional freight dispatch coordination.
      </p>
      <p>
        We do not sell, rent, or distribute customer contact information to unauthorized third parties. For data inquiries, reach out to our Karachi head office.
      </p>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="w-full bg-white text-[#333333] min-h-screen py-12 px-4 lg:px-8 max-w-4xl mx-auto space-y-6">
    <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest">
      Commercial Trade Terms
    </div>
    <h1 className="text-3xl font-display font-black text-[#0A3C6E] uppercase">
      Terms & Conditions
    </h1>
    <div className="space-y-4 text-sm text-[#333333]/85 leading-relaxed bg-[#F4F7FA] border border-slate-200 rounded-2xl p-6 sm:p-8">
      <p>
        All wholesale and container tyre quotations issued by Good Luck Tyres are subject to Port Qasim warehouse batch verification and live inventory allocation at the time of order confirmation.
      </p>
      <p>
        Manufacturer DOT warranties apply strictly in accordance with standard load-index, rim fitment, and cold inflation guidelines documented in our technical datasheets.
      </p>
      <p>
        Regional freight delivery timelines across Karachi, Lahore, Rawalpindi, Multan, Faisalabad, Peshawar, and Quetta are coordinated upon dispatch clearance.
      </p>
    </div>
  </div>
);

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => (
  <div className="w-full bg-white text-[#333333] min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div className="text-center max-w-md space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#F4F7FA] border border-slate-200 mx-auto flex items-center justify-center text-[#1783C1]">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest">
        Error 404
      </div>
      <h1 className="text-3xl font-display font-black text-[#0A3C6E] uppercase">
        Page Not Found
      </h1>
      <p className="text-sm text-[#333333]/80">
        The requested tyre model, category, or distribution page could not be located.
      </p>
      <button
        type="button"
        onClick={onGoHome}
        className="px-6 py-3 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </button>
    </div>
  </div>
);
