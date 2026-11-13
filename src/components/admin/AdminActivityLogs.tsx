import React, { useEffect, useState } from 'react';
import { ActivityLog } from '../../types/index.ts';
import { api } from '../../api/client.ts';

export const AdminActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    api.getActivityLogs().then(setLogs).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
        Administrator Activity Logs
      </h1>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F7FA] border-b border-slate-200 text-[11px] font-mono uppercase text-[#0A3C6E]">
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Actor</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-2.5 px-3 font-semibold text-[#0A3C6E]">{log.actor}</td>
                <td className="py-2.5 px-3 font-mono text-[#1783C1]">{log.action}</td>
                <td className="py-2.5 px-3">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
