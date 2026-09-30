'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';
import { ShieldCheck, User, Clock, Building2, RefreshCw } from 'lucide-react';

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

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'USER_LOGIN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'USER_LOGOUT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'USER_CREATED':
      case 'USER_REGISTERED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'USER_UPDATED':
      case 'SUPERADMIN_USER_ROLE_UPDATED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'USER_DELETED':
      case 'TRANSACTION_REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'TRANSACTION_APPROVED':
      case 'TRANSACTION_CREATED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header & Refresh */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
            <span>{isSuperAdmin ? '⚡ System Audit Logs (Global)' : 'Audit Logs'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isSuperAdmin
              ? 'Real-time security events, user logins, logouts, role changes, and system operations across all platform tenants.'
              : 'Track login, logout, user creation, role changes, and transaction activities in your workspace.'}
          </p>
        </div>

        <button
          onClick={() => fetchAuditLogs(isSuperAdmin)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Logs Table Wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
            <p className="text-sm font-medium">Fetching Audit Trails...</p>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">No audit logs recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 whitespace-nowrap">Action Event</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">User</th>
                  {isSuperAdmin && <th className="px-4 py-3.5 whitespace-nowrap">Tenant</th>}
                  <th className="px-4 py-3.5">Details</th>
                  <th className="px-4 py-3.5 whitespace-nowrap text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-md border ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">{log.user?.email || 'System User'}</p>
                          <p className="text-[10px] font-mono text-slate-400">{log.userId ? `${log.userId.slice(0, 8)}...` : 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{log.tenant?.name || log.tenant?.slug || log.tenantId || 'System'}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-4 py-3.5 text-slate-800 max-w-xs sm:max-w-md break-words font-medium">
                      {log.details || 'N/A'}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="inline-flex items-center space-x-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
