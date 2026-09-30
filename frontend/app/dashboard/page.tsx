'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

interface SummaryData {
  totalMerchants: number;
  totalTransactions: number;
  totalVolume: number;
  successfulVolume: number;
  activeApiKeys: number;
  statusBreakdown?: {
    success: number;
    pending: number;
    failed: number;
  };
}

export default function OverviewPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await API.get('/reports/summary');
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
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Welcome to your multi-tenant payment platform hub.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

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
    </div>
  );
}