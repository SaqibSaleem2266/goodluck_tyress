import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, Shield } from 'lucide-react';
import { api, authStorage, StoredAdminUser } from '../../api/client.ts';

interface AdminLoginProps {
  onLoginSuccess: (user: StoredAdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [email, setEmail] = useState('admin@goodlucktyres.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-[#0A3C6E]/10 overflow-hidden">
        <div className="bg-[#0A3C6E] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#1783C1] mx-auto flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-display font-black uppercase tracking-tight">
            Good Luck Tyres Admin Panel
          </h1>
          <p className="text-xs text-sky-200">
            Authorized Inventory, Brand & Website Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-[#333333] mb-1.5"
            >
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#1783C1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] focus:bg-white rounded-lg text-xs text-[#333333] outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-[#333333] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#1783C1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] focus:bg-white rounded-lg text-xs text-[#333333] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A3C6E] hover:bg-[#1783C1] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1783C1] hover:text-[#0A3C6E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
