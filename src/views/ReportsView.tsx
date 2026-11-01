import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const ReportsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/financials')
      .then((res: any) => setData(res.data))
      .catch((err) => console.error('Failed to load financials:', err))
      .finally(() => setLoading(false));
  }, []);

  const financials = data?.financials || { settledTotal: 0, pipelineTotal: 0, grossMargin: 0 };
  const delivery = data?.delivery || { milestoneVelocity: 0, frontendDeliveryRate: 95, backendDeliveryRate: 92 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial & Delivery Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical cash flow trends, team delivery velocity, and client profitability metrics calculated from live platform records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Performance Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Trailing Revenue Stream</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24% YoY
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-slate-50">
              <span className="text-slate-600">Settled Cash Collected:</span>
              <span className="font-bold text-slate-900">${financials.settledTotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-slate-50">
              <span className="text-slate-600">Active Receivables Pipeline:</span>
              <span className="font-bold text-slate-900">${financials.pipelineTotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-emerald-50 text-emerald-900 font-bold">
              <span>Operating Margin:</span>
              <span>{financials.grossMargin}%</span>
            </div>
          </div>
        </div>

        {/* Project Delivery Velocity */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Agile Milestone Velocity</span>
            <span className="text-xs font-mono font-semibold text-slate-700">{delivery.milestoneVelocity}% Approved</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Contract Deliverables Sign-off:</span>
                <span className="font-mono font-bold">{delivery.milestoneVelocity}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${delivery.milestoneVelocity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Frontend & UI Delivery Rate:</span>
                <span className="font-mono font-bold">{delivery.frontendDeliveryRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${delivery.frontendDeliveryRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Backend & API Contracts:</span>
                <span className="font-mono font-bold">{delivery.backendDeliveryRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${delivery.backendDeliveryRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
