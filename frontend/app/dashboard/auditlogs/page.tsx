'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    let role = '';
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          role = user?.role;
          if (role === 'SUPER_ADMIN') {
            setIsSuperAdmin(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchAuditLogs(role === 'SUPER_ADMIN');
  }, []);

  const fetchAuditLogs = async (superAdmin: boolean) => {
    setLoading(true);
    try {
      const endpoint = superAdmin ? '/audit-logs/global' : '/audit-logs';
      const response = await API.get(endpoint);
      setAuditLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {isSuperAdmin ? '⚡ System-wide Audit Logs (Global)' : 'Audit Logs'}
          </h3>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'Track critical actions and security events across all platform tenants.'
              : 'Track all critical actions and activities within your tenant.'}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading audit logs...</p>
      ) : auditLogs.length === 0 ? (
        <p className="text-sm text-gray-500">No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tenant</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">{log.action}</td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-700">
                      {log.tenant?.name || log.tenant?.slug || log.tenantId}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-900">{log.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">{log.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
