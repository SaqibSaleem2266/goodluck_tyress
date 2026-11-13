import React, { useState } from 'react';
import { KeyRound, CheckCircle } from 'lucide-react';
import { api } from '../../api/client.ts';

export const AdminChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setMessage('Administrator password updated securely.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Password update failed');
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
        Change Admin Password
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold mb-1">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">New Password (min 8 chars)</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
        >
          <KeyRound className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
};
