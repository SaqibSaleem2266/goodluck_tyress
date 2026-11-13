import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Clock,
  ChevronDown,
  Search,
  MessageSquare,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { Brand, Category, WebsiteSettings } from '../../types/index.ts';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  brands: Brand[];
  categories: Category[];
  settings: WebsiteSettings;
  onOpenQuoteModal: () => void;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  brands,
  categories,
  settings,
  onOpenQuoteModal,
  onOpenQuickSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'brands' | 'categories' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const navLinkClass = (active: boolean) =>
    `px-2.5 py-2 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors rounded-md ${
      active
        ? 'text-[#1783C1] bg-[#F4F7FA]'
        : 'text-[#333333] hover:text-[#0A3C6E] hover:bg-[#F4F7FA]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Top Corporate Utility Bar */}
      <div className="bg-[#06284B] text-white text-[11px] py-2 px-4 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1783C1] shrink-0" />
            <span className="truncate font-medium text-slate-200">
              {settings.announcementText}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 shrink-0 text-slate-200">
            <a
              href={`tel:${settings.primaryPhone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#1783C1]" />
              <span className="font-mono">{settings.primaryPhone}</span>
            </a>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-3 h-3 text-[#1783C1]" />
              <span>{settings.businessHours}</span>
            </span>
            <button
              type="button"
              onClick={() => handleLinkClick('/admin/login')}
              className="flex items-center gap-1 text-sky-300 hover:text-white font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Identity */}
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 shrink-0 text-left group"
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <circle cx="20" cy="20" r="18" fill="#0A3C6E" />
              <circle cx="20" cy="20" r="14" stroke="#1783C1" strokeWidth="2.5" strokeDasharray="4 2.5" />
              <circle cx="20" cy="20" r="7.5" fill="#FFFFFF" />
              <circle cx="20" cy="20" r="3" fill="#0A3C6E" />
            </svg>
            <div className="leading-none">
              <div className="text-base sm:text-lg font-display font-black tracking-tight text-[#0A3C6E] group-hover:text-[#1783C1] transition-colors whitespace-nowrap">
                GOOD LUCK TYRES
              </div>
              <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#1783C1] whitespace-nowrap mt-0.5">
                Commercial & OTR Distribution
              </div>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            ref={dropdownRef}
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1"
          >
            <button
              type="button"
              onClick={() => handleLinkClick('/')}
              className={navLinkClass(currentPath === '/')}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/tyres')}
              className={navLinkClass(currentPath.startsWith('/tyres'))}
            >
              All Tyres
            </button>

            {/* Brands Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'brands'}
                onClick={() =>
                  setOpenDropdown(openDropdown === 'brands' ? null : 'brands')
                }
                className={`${navLinkClass(currentPath.startsWith('/brands'))} flex items-center gap-1`}
              >
                <span>Brands</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {openDropdown === 'brands' && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl shadow-[#0A3C6E]/10 py-2 z-50">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('/brands')}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-[#1783C1] hover:bg-[#F4F7FA] uppercase tracking-wider border-b border-slate-100"
                  >
                    View All Brands →
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => handleLinkClick(`/brands/${brand.slug}`)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#333333] hover:text-[#0A3C6E] hover:bg-[#F4F7FA] flex items-center justify-between"
                    >
                      <span>{brand.name}</span>
                      {brand.tyreCount !== undefined && (
                        <span className="text-[11px] font-mono text-[#1783C1] tabular-nums">
                          {brand.tyreCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'categories'}
                onClick={() =>
                  setOpenDropdown(openDropdown === 'categories' ? null : 'categories')
                }
                className={`${navLinkClass(currentPath.startsWith('/categories'))} flex items-center gap-1`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {openDropdown === 'categories' && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl shadow-[#0A3C6E]/10 py-2 z-50 max-h-96 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('/categories')}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-[#1783C1] hover:bg-[#F4F7FA] uppercase tracking-wider border-b border-slate-100"
                  >
                    View All Categories →
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleLinkClick(`/categories/${cat.slug}`)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#333333] hover:text-[#0A3C6E] hover:bg-[#F4F7FA] flex items-center justify-between"
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      {cat.tyreCount !== undefined && (
                        <span className="text-[11px] font-mono text-[#1783C1] tabular-nums shrink-0">
                          {cat.tyreCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleLinkClick('/find-tyre')}
              className={navLinkClass(
                currentPath === '/find-tyre' || currentPath === '/finder'
              )}
            >
              Find Tyre
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/dealers')}
              className={navLinkClass(currentPath === '/dealers')}
            >
              Dealers
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/downloads')}
              className={navLinkClass(currentPath === '/downloads')}
            >
              Catalogues
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/about')}
              className={navLinkClass(currentPath === '/about')}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/contact')}
              className={navLinkClass(currentPath === '/contact')}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Quick Search + Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenQuickSearch}
              aria-label="Search tyre catalogue"
              className="p-2 text-[#0A3C6E] hover:text-[#1783C1] bg-[#F4F7FA] hover:bg-slate-200/70 rounded-lg border border-slate-200 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Request Quote</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-2 text-[#0A3C6E] bg-[#F4F7FA] border border-slate-200 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Home', path: '/' },
              { label: 'All Tyres', path: '/tyres' },
              { label: 'Brands', path: '/brands' },
              { label: 'Categories', path: '/categories' },
              { label: 'Find Your Tyre', path: '/find-tyre' },
              { label: 'Dealer Network', path: '/dealers' },
              { label: 'Corporate Clients', path: '/clients' },
              { label: 'Catalogues', path: '/downloads' },
              { label: 'About Us', path: '/about' },
              { label: 'Contact Us', path: '/contact' },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleLinkClick(item.path)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  currentPath === item.path
                    ? 'bg-[#0A3C6E] text-white'
                    : 'bg-[#F4F7FA] text-[#333333]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-2.5 bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Request Wholesale Quote</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/admin/login')}
              className="w-full py-2 bg-[#F4F7FA] text-[#0A3C6E] border border-slate-200 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
