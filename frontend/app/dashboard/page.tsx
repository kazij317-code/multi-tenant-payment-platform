'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import Link from 'next/link';

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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{isSuperAdmin ? '⚡ Global System Overview' : 'Dashboard Overview'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {isSuperAdmin
              ? 'Real-time multi-tenant platform metrics, system health, and recent activities.'
              : 'Welcome to your multi-tenant payment platform dashboard.'}
          </p>
        </div>
        {isSuperAdmin && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full shrink-0">
            SYSTEM HEALTH: {loading ? '...' : (summary?.systemHealth || '100% Operational')}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS (5 Core Required Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Revenue</h3>
            <span className="text-lg">💰</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">
            {loading ? '...' : `$${(summary?.revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Successful volume</p>
        </div>

        {/* Card 2: Total Transactions */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Total Transactions</h3>
            <span className="text-lg">💳</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">
            {loading ? '...' : (summary?.totalTransactions ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">All recorded transactions</p>
        </div>

        {/* Card 3: Total Merchants */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-purple-100 bg-gradient-to-br from-white to-purple-50/40">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Total Merchants</h3>
            <span className="text-lg">🏪</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">
            {loading ? '...' : (summary?.totalMerchants ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Active business profiles</p>
        </div>

        {/* Card 4: Total Users */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-blue-100 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Users</h3>
            <span className="text-lg">👥</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">
            {loading ? '...' : (summary?.totalUsers ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Registered members</p>
        </div>

        {/* Card 5: Failed Transactions */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-rose-100 bg-gradient-to-br from-white to-rose-50/40">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Failed Transactions</h3>
            <span className="text-lg">⚠️</span>
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">
            {loading ? '...' : (summary?.failedTransactions ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Failed or rejected count</p>
        </div>
      </div>

      {/* BASIC VISUAL CHART & STATUS BREAKDOWN */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span>📊</span> Transaction Status Distribution Chart
        </h3>

        {loading ? (
          <p className="text-xs text-gray-500">Loading chart data...</p>
        ) : !summary?.chartData || summary.chartData.length === 0 ? (
          <p className="text-xs text-gray-500">No chart transaction data recorded yet.</p>
        ) : (
          <div className="space-y-4 pt-2">
            {summary.chartData.map((item: any) => {
              const maxCount = Math.max(...summary.chartData.map((d: any) => d.count), 1);
              const percent = Math.round((item.count / maxCount) * 100);

              let barColor = 'bg-gray-400';
              if (item.status === 'SUCCESS' || item.status === 'COMPLETED') barColor = 'bg-emerald-500';
              if (item.status === 'PENDING' || item.status === 'PROCESSING') barColor = 'bg-amber-400';
              if (item.status === 'FAILED' || item.status === 'REJECTED') barColor = 'bg-rose-500';
              if (item.status === 'REFUNDED') barColor = 'bg-purple-500';

              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{item.status} ({item.count} transactions)</span>
                    <span>${item.volume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(5, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>🕒 Recent Transactions</span>
          </h3>
          <Link
            href="/dashboard/transactions"
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            View All Transactions →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-gray-500">Loading recent transactions...</p>
        ) : !summary?.recentTransactions || summary.recentTransactions.length === 0 ? (
          <p className="text-xs text-gray-500">No recent transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  {isSuperAdmin && <th className="px-6 py-3">Tenant</th>}
                  <th className="px-6 py-3">Merchant</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {summary.recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900">{tx.reference}</td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 font-semibold text-purple-700 text-xs">
                        {tx.merchant?.tenant?.name || tx.merchant?.tenant?.slug || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-700 font-medium">{tx.merchant?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${tx.amount.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">{tx.currency || 'BDT'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
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