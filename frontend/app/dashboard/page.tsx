'use client';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Welcome to your multi-tenant payment platform hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">$12,450.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">1,240</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">2</p>
        </div>
      </div>
    </div>
  );
}