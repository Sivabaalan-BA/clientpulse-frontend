import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Sparkles,
  FileSpreadsheet,
  FolderKanban,
  FileText,
  MessageSquareQuote,
  Activity,
  BarChart3,
  UserCheck,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  roles: Array<'super_admin' | 'business_admin' | 'employee' | 'client'>;
}

const navItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['super_admin', 'business_admin', 'employee'] },
  { name: 'Client Portal', path: '/portal', icon: Layers, roles: ['client', 'business_admin'], badge: 'Client' },
  { name: 'Enquiries (Leads)', path: '/enquiries', icon: Inbox, roles: ['super_admin', 'business_admin', 'employee'] },
  { name: 'CRM & Clients', path: '/crm', icon: Users, roles: ['super_admin', 'business_admin', 'employee'] },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, roles: ['super_admin', 'business_admin', 'employee'], badge: 'Local LLM' },
  { name: 'Quotations', path: '/quotations', icon: FileSpreadsheet, roles: ['super_admin', 'business_admin', 'employee', 'client'] },
  { name: 'Projects', path: '/projects', icon: FolderKanban, roles: ['super_admin', 'business_admin', 'employee', 'client'] },
  { name: 'Invoices', path: '/invoices', icon: FileText, roles: ['super_admin', 'business_admin', 'employee', 'client'] },
  { name: 'Feedback', path: '/feedback', icon: MessageSquareQuote, roles: ['super_admin', 'business_admin', 'employee', 'client'] },
  { name: 'Pulse Analytics', path: '/pulse', icon: Activity, roles: ['super_admin', 'business_admin'], badge: 'AI Churn' },
  { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['super_admin', 'business_admin'] },
  { name: 'Team & Roles', path: '/users', icon: UserCheck, roles: ['super_admin', 'business_admin'] },
];

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const { isMobileOpen, closeMobileSidebar } = useSidebar();
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar (Drawer on mobile, permanent on lg+) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-64 2xl:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-lg">
                Client<span className="text-brand-400">Pulse</span>
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Agency Suite
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {role === 'client' ? 'Client Workspace' : 'Core Business Modules'}
          </div>

          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-800 text-brand-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Local AI Engine Status Banner */}
        <div className="p-3 mx-3 mb-4 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            <span>Local Ollama AI</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Zero-cost local LLM runtime with fallback heuristics ready.
          </p>
        </div>
      </aside>
    </>
  );
};
