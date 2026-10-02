'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Edit Modal State
  const [editingMerchant, setEditingMerchant] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Merchant Profile Modal State
  const [profileMerchant, setProfileMerchant] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

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
    fetchMerchants(superAdmin);
  }, []);

  const fetchMerchants = async (superAdmin: boolean) => {
    setLoading(true);
    try {
      const endpoint = superAdmin ? '/merchants/global' : '/merchants';
      const response = await API.get(endpoint);
      setMerchants(response.data);
    } catch (err) {
      console.error('Failed to fetch merchants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/merchants', { name, email });
      setSuccess('Merchant created successfully!');
      setName('');
      setEmail('');
      setShowCreateModal(false);
      fetchMerchants(isSuperAdmin);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create merchant');
    }
  };

  const handleUpdateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchant) return;
    setError('');
    setSuccess('');

    try {
      await API.patch(`/merchants/${editingMerchant.id}`, { name: editName, email: editEmail });
      setSuccess('Merchant details updated successfully!');
      setEditingMerchant(null);
      fetchMerchants(isSuperAdmin);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update merchant');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const endpoint = isSuperAdmin ? `/merchants/global/${id}/status` : `/merchants/${id}/status`;
      await API.patch(endpoint, { status: newStatus });
      fetchMerchants(isSuperAdmin);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update merchant status');
    }
  };

  const handleViewProfile = async (id: string) => {
    setLoadingProfile(true);
    try {
      const response = await API.get(`/merchants/${id}`);
      setProfileMerchant(response.data);
    } catch (err: any) {
      alert('Failed to load merchant profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{isSuperAdmin ? '⚡ System Merchants Overview' : 'Merchant Management'}</span>
          </h3>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'View and manage all registered merchants across every tenant in the system.'
              : 'Manage tenant merchants, edit details, and view profiles.'}
          </p>
        </div>
        {!isSuperAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            + Add Merchant
          </button>
        )}
      </div>

      {success && <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">{success}</div>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading merchants...</p>
      ) : merchants.length === 0 ? (
        <p className="text-sm text-gray-500">No merchants found.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                {isSuperAdmin && <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Tenant Name</th>}
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Merchant Name</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Email</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {merchants.map((merchant: any) => (
                <tr key={merchant.id} className="hover:bg-gray-50/80 transition-colors">
                  {isSuperAdmin && (
                    <td className="px-4 sm:px-6 py-4 font-semibold text-purple-700 text-xs whitespace-nowrap">
                      {merchant.tenant?.name || merchant.tenant?.slug || 'N/A'}
                    </td>
                  )}
                  <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    <button
                      onClick={() => handleViewProfile(merchant.id)}
                      className="text-indigo-600 hover:underline text-left font-semibold"
                    >
                      {merchant.name}
                    </button>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 whitespace-nowrap">{merchant.email}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        merchant.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {merchant.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-1.5 sm:space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleViewProfile(merchant.id)}
                      className="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      Profile
                    </button>
                    {!isSuperAdmin && (
                      <button
                        onClick={() => {
                          setEditingMerchant(merchant);
                          setEditName(merchant.name);
                          setEditEmail(merchant.email);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleStatus(merchant.id, merchant.status)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        merchant.status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {merchant.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MERCHANT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Add New Merchant</h3>
            {error && <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">{error}</div>}
            <form onSubmit={handleCreateMerchant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Beta Electronics"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="merchant@beta.com"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                >
                  Create Merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MERCHANT MODAL */}
      {editingMerchant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Update Merchant Details</h3>
            {error && <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">{error}</div>}
            <form onSubmit={handleUpdateMerchant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMerchant(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MERCHANT PROFILE MODAL */}
      {profileMerchant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🏪 {profileMerchant.name}</span>
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {profileMerchant.id}</p>
              </div>
              <button
                onClick={() => setProfileMerchant(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-[11px] font-semibold text-gray-500 uppercase">Email</span>
                <span className="text-sm font-medium text-gray-900">{profileMerchant.email}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-[11px] font-semibold text-gray-500 uppercase">Status</span>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    profileMerchant.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {profileMerchant.status}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-[11px] font-semibold text-gray-500 uppercase">
                  Total Transactions
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {profileMerchant._count?.transactions ?? profileMerchant.transactions?.length ?? 0}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Recent Transactions</h4>
              {!profileMerchant.transactions || profileMerchant.transactions.length === 0 ? (
                <p className="text-xs text-gray-500">No transactions recorded for this merchant.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="px-4 py-2">Reference</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {profileMerchant.transactions.map((tx: any) => (
                        <tr key={tx.id}>
                          <td className="px-4 py-2 font-mono text-gray-900">{tx.reference}</td>
                          <td className="px-4 py-2 font-bold">${tx.amount}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-700">
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setProfileMerchant(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}