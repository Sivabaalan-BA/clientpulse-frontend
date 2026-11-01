import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Views
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
  const { role } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
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
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
