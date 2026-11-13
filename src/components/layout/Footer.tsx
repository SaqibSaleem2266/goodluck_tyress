import React from 'react';
import { Phone, Mail, MapPin, Shield, ArrowRight } from 'lucide-react';
import { Brand, Category, WebsiteSettings } from '../../types/index.ts';

interface FooterProps {
  brands: Brand[];
  categories: Category[];
  settings: WebsiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  brands,
  categories,
  settings,
  onNavigate,
}) => {
  return (
    <footer className="bg-[#0A3C6E] text-white border-t border-[#06284B]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <svg
              width="34"
              height="34"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="18" fill="#06284B" />
              <circle cx="20" cy="20" r="14" stroke="#1783C1" strokeWidth="2.5" strokeDasharray="4 2.5" />
              <circle cx="20" cy="20" r="7" fill="#FFFFFF" />
              <circle cx="20" cy="20" r="3" fill="#0A3C6E" />
            </svg>
            <div>
              <div className="font-display font-black text-lg tracking-tight text-white">
                {settings.companyName}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-sky-300">
                Est. Commercial Distribution
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {settings.footerAbout}
          </p>

          <button
            type="button"
            onClick={() => onNavigate('/request-quote')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1783C1] hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            <span>Request Fleet Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 2: Categories */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-300 mb-4">
            Tyre Categories
          </h3>
          <ul className="space-y-2">
            {categories.slice(0, 7).map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(`/categories/${cat.slug}`)}
                  className="text-xs text-slate-200 hover:text-white transition-colors text-left"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Authorized Brands & Links */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-300 mb-4">
            Brands & Portal Links
          </h3>
          <ul className="space-y-2">
            {brands.slice(0, 4).map((brand) => (
              <li key={brand.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(`/brands/${brand.slug}`)}
                  className="text-xs text-slate-200 hover:text-white transition-colors text-left"
                >
                  {brand.name}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigate('/dealers')}
                className="text-xs text-slate-200 hover:text-white transition-colors"
              >
                National Dealer Network
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('/clients')}
                className="text-xs text-slate-200 hover:text-white transition-colors"
              >
                Corporate Fleet Accounts
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('/downloads')}
                className="text-xs text-slate-200 hover:text-white transition-colors"
              >
                Technical Catalogues
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Hubs & Contact */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-sky-300 mb-4">
            Headquarters & Port Hub
          </h3>
          <div className="space-y-3 text-xs text-slate-200">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#1783C1] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Head Office</div>
                <div>{settings.headquartersAddress}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#1783C1] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Port Qasim Logistics Hub</div>
                <div>{settings.portDepotAddress}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#1783C1] shrink-0" />
              <span className="font-mono">{settings.primaryPhone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#1783C1] shrink-0" />
              <span>{settings.primaryEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Admin Strip */}
      <div className="bg-[#06284B] border-t border-white/10 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-300">
          <div>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin/login')}
              className="flex items-center gap-1 text-sky-300 hover:text-white font-semibold transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
