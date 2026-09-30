'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VIEWER');
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
    fetchUsers(superAdmin);
  }, []);

  const fetchUsers = async (superAdmin: boolean) => {
    setLoading(true);
    try {
      const endpoint = superAdmin ? '/users/global' : '/users';
      const response = await API.get(endpoint);
      setUsers(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post('/users', { email, password, role });
      setSuccess('User created successfully!');
      setEmail('');
      setPassword('');
      setRole('VIEWER');
      setShowModal(false);
      fetchUsers(isSuperAdmin);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleChangeUserRoleGlobal = async (userId: string, newRole: string) => {
    try {
      await API.patch(`/users/global/${userId}/role`, { role: newRole });
      setSuccess(`User role updated to ${newRole}`);
      fetchUsers(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleBlockGlobal = async (userId: string, currentActive: boolean) => {
    const nextState = !currentActive;
    try {
      await API.patch(`/users/global/${userId}/status`, { isActive: nextState });
      setSuccess(`User account ${nextState ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers(isSuperAdmin);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{isSuperAdmin ? '⚡ Global User Management' : 'User Management'}</span>
          </h3>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'Control roles and block/unblock user accounts across all platform tenants.'
              : 'Manage tenant users and assign roles.'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
        >
          + Add User
        </button>
      </div>

      {success && <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">{success}</div>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3">User Email</th>
                {isSuperAdmin && <th className="px-6 py-3">Tenant</th>}
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{u.email}</td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {u.tenant?.name || u.tenant?.slug || u.tenantId}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {isSuperAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRoleGlobal(u.id, e.target.value)}
                        className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="TENANT_ADMIN">TENANT_ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        u.isActive !== false
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {u.isActive !== false ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleToggleBlockGlobal(u.id, u.isActive !== false)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                          u.isActive !== false
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive !== false ? 'Block' : 'Unblock'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                    >
                      Delete
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
            <h3 className="text-lg font-bold text-gray-900">Create New User</h3>
            {error && <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">{error}</div>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="TENANT_ADMIN">TENANT_ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="OPERATOR">OPERATOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
