import React from 'react';
import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();

  const activePersona = ROLE_CONFIG[role] || ROLE_CONFIG.business_admin;

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-4">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Responsive Search Input */}
        <div className="relative w-full max-w-[180px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, clients, projects (Ctrl + K)..."
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all truncate"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
        {/* Active Role Badge (Persona indicator) */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-medium ${activePersona.badgeStyle}`}>
          <span>{activePersona.icon}</span>
          <span className="font-semibold">{activePersona.shortTitle}</span>
        </div>

        {/* Notifications */}
        <button
          title="Notifications"
          className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1 sm:top-1.5 right-1 sm:right-1.5 ring-2 ring-white" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-xs shrink-0">
            {user?.firstName?.charAt(0) || activePersona.icon || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[120px]">
              {user ? `${user.firstName} ${user.lastName}` : activePersona.shortTitle}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono truncate max-w-[140px]">
              {user?.email || activePersona.email}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
