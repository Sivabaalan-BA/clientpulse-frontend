import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, CheckCircle2, Clock, Send, Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

export const QuotationsView: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [selectedClientId, setSelectedClientId] = useState('');
  const [title, setTitle] = useState('Full Stack SaaS Web Application Architecture');
  const [items, setItems] = useState([
    { description: 'Phase 1: Architecture, ER Diagrams & API Specifications', quantity: 1, unitPrice: 1500 },
    { description: 'Phase 2: React + TypeScript Frontend & Tailwind UI Components', quantity: 1, unitPrice: 3200 },
    { description: 'Phase 3: Node.js Express Backend, PostgreSQL & Ollama AI Engine', quantity: 1, unitPrice: 3800 },
  ]);
  const [discountPercent, setDiscountPercent] = useState(5);
  const [taxPercent, setTaxPercent] = useState(0);

  const fetchQuotes = () => {
    api.get('/quotations').then((res: any) => setQuotations(res.data));
    api.get('/clients').then((res: any) => {
      setClients(res.data);
      if (res.data.length > 0 && !selectedClientId) {
        setSelectedClientId(res.data[0].id);
      }
    });
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const addItem = () => {
    setItems([...items, { description: 'New Milestone Deliverable', quantity: 1, unitPrice: 500 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, val: any) => {
    const updated = [...items];
    (updated[idx] as any)[field] = val;
    setItems(updated);
  };

  const subtotal = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const totalAmount = subtotal - discountAmount;

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/quotations', {
        clientId: selectedClientId,
        title,
        items,
        discountPercent,
        taxPercent,
        validUntil: '2026-12-31',
      });
      showToast('Proposal created and issued successfully!', 'success');
      setShowModal(false);
      fetchQuotes();
    } catch (e: any) {
      showToast(e.message || 'Error creating quotation', 'error');
    }
  };

  const handleAcceptProposal = async (quoteId: string) => {
    try {
      await api.post(`/quotations/${quoteId}/accept`, {});
      showToast('Proposal accepted! Delivery project and deposit invoice automatically initialized.', 'success');
      fetchQuotes();
    } catch (e: any) {
      showToast(e.message || 'Error accepting proposal', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commercial Quotations & Proposals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build branded project proposals, manage milestone deliverables, and convert signed quotes directly into delivery projects.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Proposal
        </button>
      </div>

      {/* Quotations List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Quote Ref #</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Scope Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotations.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-600">{q.quotationNumber}</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">{q.clientName}</td>
                <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{q.title}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                    q.status === 'accepted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {q.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ${q.totalAmount?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {q.status !== 'accepted' ? (
                    <button
                      onClick={() => handleAcceptProposal(q.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-[11px] transition-colors shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Convert
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active in Projects
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">New Quotation Builder</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Client Account</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.companyName} ({c.primaryContactName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proposal Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Milestone Line Items</span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Deliverable
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Deliverable description"
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                        className="w-16 p-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                      <input
                        type="number"
                        min="0"
                        value={it.unitPrice}
                        onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                        className="w-24 p-2 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center font-mono">
                <div>
                  <span className="text-slate-500">Discount: </span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-12 p-1 border rounded bg-white text-center text-xs"
                  /> %
                </div>
                <div className="text-right">
                  <div className="text-slate-500 text-[11px]">Subtotal: ${subtotal}</div>
                  <div className="text-base font-bold text-slate-900">Total: ${totalAmount}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
                >
                  Save & Issue Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
