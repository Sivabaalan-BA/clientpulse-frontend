import React from 'react';
import { Bell, Search, Shield, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, setRole } = useAuth();

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    super_admin: { title: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    business_admin: { title: 'Business Admin', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    employee: { title: 'Employee', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    client: { title: 'Client Portal', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients, proposals, projects, or tasks (Ctrl + K)..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Dynamic Role Switcher for Pair-Programming & Testing */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500 pl-2 font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Role:
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-white font-medium text-slate-800 py-1 px-2 rounded-md border border-slate-200 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer text-xs"
          >
            <option value="business_admin">Business Admin (Agency Owner)</option>
            <option value="employee">Employee (Developer/PM)</option>
            <option value="client">Client (Customer Portal)</option>
            <option value="super_admin">Super Admin (Platform)</option>
          </select>
        </div>

        {/* Notifications */}
        <button
          title="Notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-xs">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
