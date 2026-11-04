import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  FolderKanban,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { PulseBadge } from '../components/ui/PulseBadge';
import api from '../services/api';

export const DashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/metrics')
      .then((res: any) => {
        setMetrics(res.data);
      })
      .catch((err) => {
        console.error('Failed to load metrics:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium animate-pulse">
        Loading ClientPulse analytics dashboard...
      </div>
    );
  }

  const kpis = metrics?.kpis || {};

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agency Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time business telemetry, automated client health tracking, and local AI insights.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/quotations'}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" /> New Proposal
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${kpis.totalRevenue?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last month
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Receivables Due</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${kpis.pendingReceivables?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-amber-600 flex items-center gap-1 mt-2 font-medium">
            Active invoices outstanding
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {kpis.activeProjects || 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-2">
            {metrics?.activeProjects?.[0]?.name || 'All milestones on schedule'}
          </div>
        </div>

        {/* Client Health Pulse */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Client Pulse</span>
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {kpis.healthyClients || 0} <span className="text-sm font-normal text-slate-500">/ {kpis.totalClients || 0}</span>
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Healthy
            </span>
          </div>
          <div className="text-xs text-rose-600 flex items-center gap-1 mt-2 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> {kpis.churnRiskClients || 0} at-risk account requires attention
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inbound Leads with AI Qualification */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>AI-Qualified Inbound Leads</span>
            </div>
            <a href="/enquiries" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View All &rarr;
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {metrics?.recentEnquiries?.map((enq: any) => (
              <div key={enq.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{enq.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{enq.aiSummary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-brand-50 text-brand-700 border border-brand-200">
                      Score: {Math.round((enq.aiIntentScore || 0.8) * 100)}%
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{enq.budgetRange}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Delivery & Milestone Status */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
              <FolderKanban className="w-4 h-4 text-indigo-500" />
              <span>Ongoing Delivery & Milestones</span>
            </div>
            <a href="/projects" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Open Board &rarr;
            </a>
          </div>
          <div className="p-4 space-y-4">
            {metrics?.activeProjects?.map((prj: any) => (
              <div key={prj.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{prj.name}</span>
                  <span className="text-[10px] font-medium text-slate-500">{prj.clientName}</span>
                </div>
                <div className="space-y-1.5">
                  {prj.milestones?.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        {m.status === 'approved_by_client' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {m.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Due {m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
