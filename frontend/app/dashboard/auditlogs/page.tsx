'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await API.get('/audit-logs');
      setAuditLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
        <p className="text-sm text-gray-500">Track all critical actions and activities within your tenant.</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log: any) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{log.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
