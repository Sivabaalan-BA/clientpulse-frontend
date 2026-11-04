import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Clock, DollarSign, MessageSquareQuote, FileText, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

export const ClientPortalView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [activeClientId, setActiveClientId] = useState<string>('cli-001');

  const fetchClientProfile = async () => {
    try {
      // First fetch client list to find client associated with user email
      const clientsRes: any = await api.get('/clients');
      const matched = (clientsRes.data || []).find((c: any) => c.primaryEmail === user?.email) || clientsRes.data?.[0];

      if (matched) {
        setActiveClientId(matched.id);
        const detailRes: any = await api.get(`/clients/${matched.id}`);
        setData(detailRes.data);
      }
    } catch (e: any) {
      console.error('Error fetching client profile:', e);
    }
  };

  useEffect(() => {
    fetchClientProfile();
  }, [user]);

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      await api.patch(`/projects/milestones/${milestoneId}/approve`, {});
      showToast('Milestone signed off and approved successfully!', 'success');
      fetchClientProfile();
    } catch (e: any) {
      showToast(e.message || 'Error signing off milestone', 'error');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await api.post('/feedback', {
        clientId: activeClientId,
        rating,
        comment,
      });
      showToast('Thank you! Your review has been recorded & analyzed by AI.', 'success');
      setComment('');
      fetchClientProfile();
    } catch (e: any) {
      showToast(e.message || 'Error submitting feedback', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-300">Client Portal</span>
            <h1 className="text-2xl font-bold mt-1">Welcome, {data?.companyName || user?.firstName || 'Valued Client'}</h1>
            <p className="text-xs text-slate-300 mt-1">
              Review project progress, approve deliverables, and access your billing ledger.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block">Account Status</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              Active Client
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Milestones & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Delivery Milestones */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Active Milestone Sign-offs</span>
          </div>

          <div className="space-y-3">
            {data?.projects?.[0]?.milestones?.map((m: any) => (
              <div key={m.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                  <span className="text-[11px] text-slate-400">Target: {m.dueDate}</span>
                </div>
                <div>
                  {m.status === 'approved_by_client' ? (
                    <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveMilestone(m.id)}
                      className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-2xs transition-all"
                    >
                      Sign Off Milestone
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Invoices */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Your Invoices & Receipts</span>
          </div>

          <div className="space-y-3">
            {data?.invoices?.map((inv: any) => (
              <div key={inv.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-xs text-slate-900">{inv.invoiceNumber}</div>
                  <div className="text-[11px] text-slate-500">Due: {inv.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-slate-900">${inv.totalAmount}</div>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Feedback Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs max-w-xl">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-2">
          <MessageSquareQuote className="w-4 h-4 text-brand-600" />
          <span>How is our team performing?</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Your feedback directly updates our delivery pulse and helps our leadership maintain top quality.
        </p>

        <form onSubmit={handleSubmitFeedback} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                    rating === num ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {num}★
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What went well? Any areas of improvement?"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={submittingFeedback}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" /> {submittingFeedback ? 'Submitting...' : 'Submit Client Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
