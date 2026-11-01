import React, { useState, useEffect } from 'react';
import { Inbox, Sparkles, Plus, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

export const EnquiriesView: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('$5,000 - $10,000');
  const [source, setSource] = useState('website');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEnquiries = () => {
    api.get('/enquiries')
      .then((res: any) => setEnquiries(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/enquiries', { title, description, budgetRange, source });
      showToast('New lead captured and qualified with AI!', 'success');
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchEnquiries();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReanalyze = async (id: string) => {
    setAnalyzingId(id);
    try {
      await api.post(`/enquiries/${id}/ai-analyze`, {});
      showToast('Ollama AI qualification updated successfully', 'success');
      fetchEnquiries();
    } catch (err: any) {
      showToast(err.message || 'AI qualification failed', 'error');
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inbound Leads & Enquiries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Capture prospective clients, analyze lead intent with local Ollama AI, and fast-track to proposal.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Inbound Lead
        </button>
      </div>

      {/* Enquiries Grid / List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pipeline: {enquiries.length} Opportunities
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {enquiries.map((enq) => (
            <div key={enq.id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono uppercase">
                      {enq.source}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {enq.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Budget: {enq.budgetRange}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{enq.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{enq.description}</p>

                  {/* AI Qualification Badge */}
                  {enq.aiSummary && (
                    <div className="mt-3 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100/80 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="font-semibold text-brand-900 flex items-center gap-2">
                          <span>Ollama AI Qualification</span>
                          <span className="font-mono text-[10px] bg-brand-200/60 px-1.5 py-0.5 rounded text-brand-900">
                            Intent Score: {Math.round((enq.aiIntentScore || 0.85) * 100)}%
                          </span>
                        </div>
                        <p className="text-brand-800 mt-0.5 leading-normal">{enq.aiSummary}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReanalyze(enq.id)}
                    disabled={analyzingId === enq.id}
                    title="Re-run AI Analysis"
                    className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-slate-200 text-xs transition-all flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${analyzingId === enq.id ? 'animate-spin text-brand-600' : ''}`} />
                  </button>
                  <a
                    href={`/quotations?enquiryTitle=${encodeURIComponent(enq.title)}&budget=${encodeURIComponent(enq.budgetRange)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-2xs"
                  >
                    Draft Quote <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Enquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record New Inbound Enquiry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Opportunity / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js SaaS Web App Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Scope & Requirements</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide requirement details, tech stack preferences, target timeline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                  >
                    <option value="website">Website Form</option>
                    <option value="referral">Client Referral</option>
                    <option value="linkedin">LinkedIn Inbound</option>
                    <option value="direct">Direct Outreach</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Qualifying with AI...
                    </>
                  ) : (
                    'Save & Analyze Lead'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
