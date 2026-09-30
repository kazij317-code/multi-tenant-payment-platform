'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [reference, setReference] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [initialStatus, setInitialStatus] = useState('PENDING');

  // Details Modal State
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let superAdmin = false;
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.role === 'SUPER_ADMIN') {
            superAdmin = true;
            setIsSuperAdmin(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchTransactions(superAdmin, search, selectedStatus, selectedMethod);
    if (!superAdmin) {
      fetchMerchants();
    }
  }, [search, selectedStatus, selectedMethod]);

  const fetchTransactions = async (
    superAdmin: boolean,
    searchQuery: string,
    statusFilter: string,
    methodFilter: string,
  ) => {
    setLoading(true);
    try {
      const endpoint = superAdmin ? '/transactions/global' : '/transactions';
      const response = await API.get(endpoint, {
        params: {
          search: searchQuery,
          status: statusFilter,
          paymentMethod: methodFilter,
        },
      });
      setTransactions(response.data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      const response = await API.get('/merchants');
      setMerchants(response.data);
    } catch (err) {
      console.error('Failed to fetch merchants', err);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/transactions', {
        amount: parseFloat(amount),
        currency,
        reference,
        merchantId,
        paymentMethod,
        status: initialStatus,
      });

      setSuccess('Transaction created successfully!');
      setAmount('');
      setReference('');
      setMerchantId('');
      setShowModal(false);
      fetchTransactions(isSuperAdmin, search, selectedStatus, selectedMethod);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'refund') => {
    try {
      await API.patch(`/transactions/${id}/${action}`);
      setSuccess(`Transaction ${action}ed successfully!`);
      fetchTransactions(isSuperAdmin, search, selectedStatus, selectedMethod);
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} transaction`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'FAILED':
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{isSuperAdmin ? '⚡ System-wide Transactions Overview' : 'Transaction Management'}</span>
          </h3>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'View, filter, and audit transactions across all platform tenants.'
              : 'Create transactions, process approvals/refunds, and search transaction history.'}
          </p>
        </div>
        {!isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            + Create Transaction
          </button>
        )}
      </div>

      {success && <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">{success}</div>}

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-500 mb-1">
            Search Reference / Merchant
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ref (e.g. TXN-101) or merchant..."
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-500 mb-1">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed / Success</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-500 mb-1">
            Filter by Payment Method
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Payment Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Stripe">Stripe / Cards</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No transactions match your search or filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Transaction ID</th>
                {isSuperAdmin && <th className="px-6 py-3">Tenant</th>}
                <th className="px-6 py-3">Merchant</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="text-indigo-600 hover:underline font-mono"
                    >
                      {tx.reference}
                    </button>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 font-semibold text-purple-700 text-xs">
                      {tx.merchant?.tenant?.name || tx.merchant?.tenant?.slug || 'N/A'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-gray-700 font-medium">{tx.merchant?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {tx.currency === 'BDT' ? '৳' : tx.currency === 'EUR' ? '€' : '$'}
                    {tx.amount.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">{tx.currency || 'BDT'}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                      💳 {tx.paymentMethod || 'bKash'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium"
                    >
                      Details
                    </button>
                    {(tx.status === 'PENDING' || tx.status === 'PROCESSING') && (
                      <>
                        <button
                          onClick={() => handleAction(tx.id, 'approve')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700 transition-colors font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(tx.id, 'reject')}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 transition-colors font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(tx.status === 'SUCCESS' || tx.status === 'COMPLETED') && (
                      <button
                        onClick={() => handleAction(tx.id, 'refund')}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 transition-colors font-medium"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE TRANSACTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Create New Transaction</h3>
            {error && <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">{error}</div>}
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Select Merchant</label>
                <select
                  required
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">-- Select a Merchant --</option>
                  {merchants.map((merchant: any) => (
                    <option key={merchant.id} value={merchant.id}>
                      {merchant.name} ({merchant.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="1500.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Transaction Reference (Unique ID)
                </label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="TXN-2026-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Stripe">Stripe / Cards</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Initial Status</label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                >
                  Create Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION DETAILS / HISTORY MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
                <p className="text-xs font-mono text-indigo-600 mt-0.5">{selectedTx.reference}</p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-gray-900">
                  {selectedTx.currency === 'BDT' ? '৳' : '$'}{selectedTx.amount} ({selectedTx.currency || 'BDT'})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-semibold text-slate-800">{selectedTx.paymentMethod || 'bKash'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(selectedTx.status)}`}>
                  {selectedTx.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Merchant Name:</span>
                <span className="font-semibold text-gray-900">{selectedTx.merchant?.name || 'N/A'}</span>
              </div>
              {selectedTx.merchant?.tenant && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Tenant Name:</span>
                  <span className="font-semibold text-purple-700">{selectedTx.merchant.tenant.name}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Created Date:</span>
                <span className="text-gray-700">{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}