'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

export default function OverviewPage() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const endpoint = role === 'SUPER_ADMIN' ? '/reports/global-summary' : '/reports/summary';
        const response = await API.get(endpoint);
        setSummary(response.data.summary);
      } catch (err: any) {
        console.error('Failed to fetch dashboard summary:', err);
        setError('Failed to load dashboard overview data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{isSuperAdmin ? '⚡ Global Super Admin Overview' : 'Dashboard Overview'}</span>
          </h2>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'Real-time system-wide metrics across all tenants and users.'
              : 'Welcome to your multi-tenant payment platform hub.'}
          </p>
        </div>
        {isSuperAdmin && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
            SYSTEM HEALTH: {loading ? '...' : (summary?.systemHealth || '100% Operational')}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {isSuperAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-xs border border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-600">Total System Tenants</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : (summary?.totalTenants ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Active: {loading ? '...' : (summary?.activeTenants ?? 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xs border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Global Volume</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : `$${(summary?.totalVolume ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">Across all tenants</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xs border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Global Transactions</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : (summary?.totalTransactions ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">System-wide count</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xs border border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600">Registered Users</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : (summary?.totalUsers ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All platform users</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {loading ? '...' : `$${(summary?.totalVolume ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {loading ? '...' : (summary?.totalTransactions ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {loading ? '...' : (summary?.activeApiKeys ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}