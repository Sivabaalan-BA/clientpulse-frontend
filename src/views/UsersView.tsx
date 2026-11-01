import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Plus, Mail, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users').then((res: any) => setUsers(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User & Role Access Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure team members, agency staff permissions, and client portal authentication accounts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role Assignment</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                    u.role === 'super_admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : u.role === 'business_admin'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : u.role === 'employee'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {u.role.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
