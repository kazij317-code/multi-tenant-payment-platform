'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function ReportsPage() {
  const [reportSummary, setReportSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportSummary();
  }, []);

  const fetchReportSummary = async () => {
    setLoading(true);
    try {
      const response = await API.get('/reports/summary');
      setReportSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const response = await API.get('/reports/transactions/csv', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions-report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download CSV report');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
          <p className="text-sm text-gray-500">View transaction summary and download reports.</p>
        </div>
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          Download CSV Report
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading reports...</p>
      ) : !reportSummary ? (
        <p className="text-sm text-gray-500">No report data found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-500">Total Merchants</h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">{reportSummary.totalMerchants}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-500">Total Transactions</h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">{reportSummary.totalTransactions}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-500">Total Volume</h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">${reportSummary.totalVolume?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-500">Successful Volume</h4>
            <p className="text-2xl font-bold text-green-600 mt-2">${reportSummary.successfulVolume?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border col-span-full">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Status Breakdown</h4>
            <div className="flex space-x-6 text-sm">
              <span className="text-green-700 font-semibold">Success: {reportSummary.statusBreakdown?.success || 0}</span>
              <span className="text-yellow-600 font-semibold">Pending: {reportSummary.statusBreakdown?.pending || 0}</span>
              <span className="text-red-600 font-semibold">Failed: {reportSummary.statusBreakdown?.failed || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
