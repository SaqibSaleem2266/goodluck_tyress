import React, { useState } from 'react';
import {
  LayoutDashboard,
  Disc,
  PlusCircle,
  Boxes,
  Award,
  Tags,
  MapPin,
  Building2,
  MessageSquare,
  FileDown,
  Image,
  Settings,
  History,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { StoredAdminUser } from '../../api/client.ts';

interface AdminLayoutProps {
  currentPath: string;
  user: StoredAdminUser;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'All Tyres', icon: Disc },
  { path: '/admin/products/new', label: 'Add New Tyre', icon: PlusCircle },
  { path: '/admin/inventory', label: 'Real-Time Inventory', icon: Boxes },
  { path: '/admin/brands', label: 'Brands', icon: Award },
  { path: '/admin/categories', label: 'Categories', icon: Tags },
  { path: '/admin/banners', label: 'Homepage Banners', icon: Image },
  { path: '/admin/dealers', label: 'Dealer Network', icon: MapPin },
  { path: '/admin/clients', label: 'Corporate Clients', icon: Building2 },
  { path: '/admin/enquiries', label: 'Enquiries & Quotes', icon: MessageSquare },
  { path: '/admin/downloads', label: 'Catalogues & PDFs', icon: FileDown },
  { path: '/admin/settings', label: 'Website Settings', icon: Settings },
  { path: '/admin/logs', label: 'Activity Logs', icon: History },
  { path: '/admin/password', label: 'Change Password', icon: KeyRound },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  user,
  onNavigate,
  onLogout,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#333333] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0A3C6E] text-white shrink-0 border-r border-[#06284B]">
        <div className="p-5 border-b border-white/10">
          <div className="font-display font-black text-base tracking-tight text-white">
            GOOD LUCK TYRES
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-sky-300 mt-0.5">
            Admin Control Center
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === '/admin'
                ? currentPath === '/admin' || currentPath === '/admin/'
                : currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                  active
                    ? 'bg-[#1783C1] text-white shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2 bg-[#06284B]">
          <div className="px-2 py-1">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[11px] font-mono text-sky-300 truncate">{user.email}</div>
          </div>
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-3 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#06284B]/70 flex">
          <div className="w-72 bg-[#0A3C6E] text-white h-full flex flex-col p-4 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="font-display font-black text-sm">ADMIN MENU</div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close admin menu"
                className="p-1 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left ${
                    active ? 'bg-[#1783C1] text-white' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => handleNav('/')}
                className="w-full py-2 bg-white/10 text-white text-xs font-semibold rounded-lg"
              >
                View Public Website
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2 bg-red-600 text-white text-xs font-semibold rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-1.5 bg-[#F4F7FA] border border-slate-200 rounded-lg text-[#0A3C6E]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A3C6E]">
              Good Luck Tyres · Management Console
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="text-xs font-semibold text-[#1783C1] hover:text-[#0A3C6E] flex items-center gap-1"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
