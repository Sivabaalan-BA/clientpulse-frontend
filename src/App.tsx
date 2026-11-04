import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Activity } from 'lucide-react';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { EnquiriesView } from './views/EnquiriesView';
import { CRMView } from './views/CRMView';
import { AIAssistantView } from './views/AIAssistantView';
import { QuotationsView } from './views/QuotationsView';
import { ProjectsView } from './views/ProjectsView';
import { ClientPortalView } from './views/ClientPortalView';
import { InvoicesView } from './views/InvoicesView';
import { FeedbackView } from './views/FeedbackView';
import { PulseAnalyticsView } from './views/PulseAnalyticsView';
import { ReportsView } from './views/ReportsView';
import { UsersView } from './views/UsersView';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation (Responsive Drawer on mobile, fixed on desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 2xl:p-10">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-brand-500/30 animate-pulse">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -inset-3 rounded-3xl border border-brand-500/30 animate-spin border-t-transparent" />
        </div>
        <div className="mt-6 font-semibold text-slate-300 tracking-wide">ClientPulse</div>
        <div className="text-xs text-slate-500 mt-1">Authenticating session...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={role === 'client' ? '/portal' : '/'} replace />
          ) : (
            <LoginView />
          )
        }
      />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          isAuthenticated ? (
            <AppLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {role === 'client' ? (
          <>
            <Route path="/" element={<Navigate to="/portal" replace />} />
            <Route path="/portal" element={<ClientPortalView />} />
            <Route path="/quotations" element={<QuotationsView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/invoices" element={<InvoicesView />} />
            <Route path="/feedback" element={<FeedbackView />} />
            <Route path="*" element={<Navigate to="/portal" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DashboardView />} />
            <Route path="/portal" element={<ClientPortalView />} />
            <Route path="/enquiries" element={<EnquiriesView />} />
            <Route path="/crm" element={<CRMView />} />
            <Route path="/ai-assistant" element={<AIAssistantView />} />
            <Route path="/quotations" element={<QuotationsView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/invoices" element={<InvoicesView />} />
            <Route path="/feedback" element={<FeedbackView />} />
            <Route path="/pulse" element={<PulseAnalyticsView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
