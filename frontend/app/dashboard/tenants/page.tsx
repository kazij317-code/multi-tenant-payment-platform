'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  _count?: {
    users: number;
    merchants: number;
    auditLogs: number;
  };
}

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state for creating new tenant
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await API.get('/tenants');
      setTenants(response.data);
    } catch (err: any) {
      console.error('Failed to fetch tenants:', err);
      setError('Failed to load tenants list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setSubmitting(true);
      await API.post('/tenants', { name, slug });
      setSuccess(`Tenant "${name}" created successfully!`);
      setName('');
      setSlug('');
      setIsModalOpen(false);
      fetchTenants();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create tenant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (tenantId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await API.patch(`/tenants/${tenantId}/status`, { status: nextStatus });
      setTenants((prev) =>
        prev.map((t) => (t.id === tenantId ? { ...t, status: nextStatus } : t))
      );
      setSuccess(`Tenant status updated to ${nextStatus}`);
    } catch (err: any) {
      console.error(err);
      setError('Failed to update tenant status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🏢 Tenant Management</span>
          </h2>
          <p className="text-sm text-gray-500">
            Create, monitor, activate, or suspend multi-tenant platform accounts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <span>➕ Add New Tenant</span>
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{success}</div>}

      {/* Tenants Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Tenant Name</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Slug</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Users</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Merchants</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Created At</th>
                <th className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    Loading tenants...
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No tenants found.
                  </td>
                </tr>
              ) : (
                tenants.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{item.name}</td>
                    <td className="px-4 sm:px-6 py-4 font-mono text-gray-600 text-xs whitespace-nowrap">{item.slug}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 whitespace-nowrap">{item._count?.users ?? 0}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 whitespace-nowrap">{item._count?.merchants ?? 0}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status || 'ACTIVE')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          item.status === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {item.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating New Tenant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Create New Tenant</h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Tenant Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="Gamma Tech Corp"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Tenant Slug (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="gamma-tech"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
                >
                  {submitting ? 'Creating...' : 'Create Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
