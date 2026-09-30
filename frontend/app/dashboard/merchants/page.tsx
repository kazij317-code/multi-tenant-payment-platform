'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      setShowModal(false);
      fetchMerchants(isSuperAdmin);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create merchant');
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

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{isSuperAdmin ? '⚡ System Merchants Overview' : 'Merchant Management'}</span>
          </h3>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'View all registered merchants across every tenant in the system.'
              : 'Manage tenant merchants and status.'}
          </p>
        </div>
        {!isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                {isSuperAdmin && <th className="px-6 py-3">Tenant Name</th>}
                <th className="px-6 py-3">Merchant Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {merchants.map((merchant: any) => (
                <tr key={merchant.id} className="hover:bg-gray-50/80 transition-colors">
                  {isSuperAdmin && (
                    <td className="px-6 py-4 font-semibold text-purple-700 text-xs">
                      {merchant.tenant?.name || merchant.tenant?.slug || 'N/A'}
                    </td>
                  )}
                  <td className="px-6 py-4 font-semibold text-gray-900">{merchant.name}</td>
                  <td className="px-6 py-4 text-gray-600">{merchant.email}</td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(merchant.id, merchant.status)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
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
                  onClick={() => setShowModal(false)}
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
    </div>
  );
}