import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, CheckCircle2, Clock, AlertTriangle, CreditCard, Plus } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

export const InvoicesView: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [selectedClientId, setSelectedClientId] = useState('');
  const [amount, setAmount] = useState(2500);
  const [dueDate, setDueDate] = useState('2026-12-15');
  const [description, setDescription] = useState('Sprint Deliverable Milestone Payment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInvoices = () => {
    api.get('/invoices').then((res: any) => setInvoices(res.data));
    api.get('/clients').then((res: any) => {
      setClients(res.data);
      if (res.data.length > 0 && !selectedClientId) {
        setSelectedClientId(res.data[0].id);
      }
    });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async (invoiceId: string) => {
    try {
      await api.post(`/invoices/${invoiceId}/pay`, {});
      showToast('Payment recorded successfully! Invoice status set to Paid.', 'success');
      fetchInvoices();
    } catch (e: any) {
      showToast(e.message || 'Error recording payment', 'error');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/invoices', {
        clientId: selectedClientId,
        amount,
        dueDate,
        description,
      });
      showToast('Invoice created successfully!', 'success');
      setShowModal(false);
      fetchInvoices();
    } catch (e: any) {
      showToast(e.message || 'Error generating invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices & Financial Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage agency receivables, milestone-linked invoices, and record incoming payments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Issue New Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">{inv.clientName}</td>
                <td className="py-3.5 px-4 text-slate-500">{inv.issueDate}</td>
                <td className="py-3.5 px-4 text-slate-500">{inv.dueDate}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                    inv.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inv.status === 'overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ${inv.totalAmount?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {inv.status !== 'paid' ? (
                    <button
                      onClick={() => handlePay(inv.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md text-[11px] transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Record Payment
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Issue New Client Invoice</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
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
                <label className="block font-semibold text-slate-700 mb-1">Deliverable / Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200"
                  />
                </div>
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
                  {isSubmitting ? 'Generating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
