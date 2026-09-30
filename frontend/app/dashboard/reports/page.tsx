'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';
import { 
  Download, 
  Calendar, 
  Filter,
  Banknote,
  AlertTriangle,
  CreditCard,
  Users
} from 'lucide-react';

export default function ReportsPage() {
  const [reportSummary, setReportSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'all' | 'daily' | 'monthly' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReportSummary();
  }, [period]);

  const fetchReportSummary = async () => {
    setLoading(true);
    try {
      const params: any = { period };
      if (period === 'custom') {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }
      const response = await API.get('/reports/summary', { params });
      setReportSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReportSummary();
  };

  const handleDownloadCsv = async () => {
    try {
      const params: any = { period };
      if (period === 'custom') {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }
      const response = await API.get('/reports/transactions/csv', {
        params,
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-report-${period}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download CSV report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export transaction reports filtered by Daily, Monthly, or Custom Date Ranges.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export CSV Report
        </button>
      </div>

      {/* Date Range & Period Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">Filter Period:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'daily', label: 'Daily (Today)' },
              { id: 'monthly', label: 'Monthly (This Month)' },
              { id: 'custom', label: 'Custom Date Range' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  period === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Picker Inputs */}
        {period === 'custom' && (
          <form onSubmit={handleCustomSearch} className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Apply Filter
            </button>
          </form>
        )}
      </div>

      {/* Main Report Dashboard Content */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
          <p className="text-sm font-medium">Generating Report...</p>
        </div>
      ) : !reportSummary ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-sm">No report data available for the selected period.</p>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">৳{reportSummary.revenue?.toLocaleString() || '0'}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Banknote className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{reportSummary.totalTransactions || 0}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed Transactions</p>
                <h3 className="text-2xl font-bold text-rose-600 mt-1">{reportSummary.failedTransactions || 0}</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Merchants</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{reportSummary.totalMerchants || 0}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Status Breakdown Table / Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Status Breakdown ({period.toUpperCase()})
            </h3>

            {reportSummary.chartData && reportSummary.chartData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportSummary.chartData.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'SUCCESS' || item.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'FAILED' || item.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-2">Count: <strong className="text-slate-800">{item.count}</strong></p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">৳{item.volume?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No transactions recorded for this period.</p>
            )}
          </div>

          {/* Recent Transactions in Filtered Period */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Transactions in Selected Period
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Showing latest {reportSummary.recentTransactions?.length || 0} entries
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Merchant</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reportSummary.recentTransactions && reportSummary.recentTransactions.length > 0 ? (
                    reportSummary.recentTransactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-mono font-semibold text-indigo-600">{tx.reference}</td>
                        <td className="px-6 py-3 font-medium text-slate-900">{tx.merchant?.name || 'N/A'}</td>
                        <td className="px-6 py-3 font-semibold text-slate-900">৳{tx.amount?.toLocaleString()} {tx.currency}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            tx.status === 'SUCCESS' || tx.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'FAILED' || tx.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No transactions found in this date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
