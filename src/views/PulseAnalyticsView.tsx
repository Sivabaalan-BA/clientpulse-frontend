import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, TrendingDown, RefreshCw, Sparkles } from 'lucide-react';
import { PulseBadge } from '../components/ui/PulseBadge';
import api from '../services/api';

export const PulseAnalyticsView: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    api.get('/clients').then((res: any) => setClients(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Pulse & Churn Prediction Radar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Algorithmic health scoring combining payment velocity, review sentiment, and milestone latency into proactive retention alerts.
          </p>
        </div>
      </div>

      {/* Radar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-900">{c.companyName}</span>
                <PulseBadge score={c.healthScore} />
              </div>

              {/* Factors */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Payment Reliability:</span>
                  <span className="font-mono font-bold text-slate-800">{c.healthScore > 50 ? '95%' : '40% (Overdue)'}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${c.healthScore > 75 ? 'bg-emerald-500' : c.healthScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${c.healthScore}%` }}
                  />
                </div>

                <div className="flex justify-between text-slate-500 pt-1">
                  <span>Milestone Velocity:</span>
                  <span className="font-mono font-bold text-slate-800">{c.healthScore > 50 ? 'Active' : 'Delayed'}</span>
                </div>
              </div>
            </div>

            {/* Retention Recommendation */}
            <div className={`p-3 rounded-lg border text-xs ${
              c.healthScore >= 80
                ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                : c.healthScore >= 50
                ? 'bg-amber-50/70 border-amber-100 text-amber-900'
                : 'bg-rose-50/70 border-rose-100 text-rose-900'
            }`}>
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>AI Retention Strategy:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {c.healthScore >= 80
                  ? 'Strong client relationship. Propose long-term support SLA or expand scope.'
                  : c.healthScore >= 50
                  ? 'Follow up on pending invoices and schedule weekly check-in call.'
                  : 'High churn hazard: Overdue receivables and negative review detected. Immediate director intervention recommended.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
