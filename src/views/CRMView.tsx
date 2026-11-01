import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, DollarSign, Activity, Eye, ShieldAlert, Sparkles, Plus } from 'lucide-react';
import { PulseBadge } from '../components/ui/PulseBadge';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

export const CRMView: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClients = () => {
    api.get('/clients').then((res: any) => setClients(res.data));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openClient360 = async (clientId: string) => {
    setDetailLoading(true);
    try {
      const res: any = await api.get(`/clients/${clientId}`);
      setSelectedClient(res.data);
    } catch (e: any) {
      showToast(e.message || 'Failed to load client 360 profile', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/clients', {
        companyName,
        primaryContactName,
        primaryEmail,
        phone,
        status: 'active',
      });
      showToast(`Client "${companyName}" onboarded successfully!`, 'success');
      setShowModal(false);
      setCompanyName('');
      setPrimaryContactName('');
      setPrimaryEmail('');
      setPhone('');
      fetchClients();
    } catch (err: any) {
      showToast(err.message || 'Failed to create client', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CRM & Client Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Central repository of customer accounts, contract telemetry, and AI health indicators.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Onboard New Client
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Company Name</th>
              <th className="py-3 px-4">Key Contact</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Client Pulse</th>
              <th className="py-3 px-4 text-right">Lifetime Billed</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {c.companyName}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="font-medium text-slate-800">{c.primaryContactName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{c.primaryEmail}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <PulseBadge score={c.healthScore} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-900">
                  ${c.totalRevenue?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => openClient360(c.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> 360 View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Onboard Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Onboard New Client Account</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Cybernetics"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Stakeholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={primaryContactName}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@acme.com"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-1122"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
                >
                  {isSubmitting ? 'Onboarding...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client 360 Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  {selectedClient.companyName}
                  <PulseBadge score={selectedClient.pulseMetrics?.compositeScore || selectedClient.healthScore} />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedClient.primaryContactName} &bull; {selectedClient.primaryEmail}</p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>

            {/* AI Health Breakdown Card */}
            {selectedClient.pulseMetrics && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>AI Client Pulse Breakdown</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-500 uppercase">Payment Reliability</span>
                    <span className="text-base font-bold font-mono text-slate-900">{selectedClient.pulseMetrics.paymentScore}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-500 uppercase">Feedback Sentiment</span>
                    <span className="text-base font-bold font-mono text-slate-900">{selectedClient.pulseMetrics.feedbackScore}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-500 uppercase">Milestone Velocity</span>
                    <span className="text-base font-bold font-mono text-slate-900">{selectedClient.pulseMetrics.milestoneScore}%</span>
                  </div>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900">Key Retention Recommendations:</div>
                  {selectedClient.pulseMetrics.recommendations?.map((rec: string, i: number) => (
                    <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-500" /> {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Projects & Invoices Snapshot */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg p-3">
                <h4 className="font-bold text-slate-900 mb-2">Projects ({selectedClient.projects?.length || 0})</h4>
                {selectedClient.projects?.map((p: any) => (
                  <div key={p.id} className="text-slate-600 py-1 border-b last:border-0 border-slate-100 flex justify-between">
                    <span>{p.name}</span>
                    <span className="font-mono uppercase font-semibold text-[10px] text-brand-600">{p.status}</span>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 rounded-lg p-3">
                <h4 className="font-bold text-slate-900 mb-2">Invoices ({selectedClient.invoices?.length || 0})</h4>
                {selectedClient.invoices?.map((inv: any) => (
                  <div key={inv.id} className="text-slate-600 py-1 border-b last:border-0 border-slate-100 flex justify-between">
                    <span className="font-mono">{inv.invoiceNumber}</span>
                    <span className={`font-mono uppercase font-bold text-[10px] ${inv.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      ${inv.totalAmount} ({inv.status})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
