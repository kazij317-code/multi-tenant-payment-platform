'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [config, setConfig] = useState({
    defaultCurrency: 'BDT',
    platformFeePercentage: 1.5,
    enableBkash: true,
    enableNagad: true,
    enableStripe: true,
    maxLoginAttempts: 5,
    sessionTimeoutMinutes: 60,
    require2FA: false,
    maintenanceMode: false,
  });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await API.get('/system-config');
      if (response.data) {
        setConfig(response.data);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch global system settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setSaving(true);
      await API.patch('/system-config', config);
      setSuccess('Global System Settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>⚙️ Global System Configuration</span>
        </h2>
        <p className="text-sm text-gray-500">
          Manage system-wide parameters, payment gateway methods, security policies, and platform settings.
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{success}</div>}

      {loading ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-gray-500">
          Loading system configuration...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Payment & Fee Settings */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span>💳</span> Payment Gateway & Fee Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Default Platform Currency
                </label>
                <select
                  value={config.defaultCurrency}
                  onChange={(e) => setConfig({ ...config, defaultCurrency: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="BDT">BDT (৳ - Bangladeshi Taka)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Platform Fee Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={config.platformFeePercentage}
                  onChange={(e) =>
                    setConfig({ ...config, platformFeePercentage: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-3">
                Enabled Payment Gateway Providers
              </label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableBkash}
                    onChange={(e) => setConfig({ ...config, enableBkash: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span>bKash Payment</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableNagad}
                    onChange={(e) => setConfig({ ...config, enableNagad: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span>Nagad Payment</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableStripe}
                    onChange={(e) => setConfig({ ...config, enableStripe: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span>Stripe Cards / International</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Security & Authentication Policy */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span>🔒</span> System Security & Policy Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Max Allowed Login Failure Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={config.maxLoginAttempts}
                  onChange={(e) =>
                    setConfig({ ...config, maxLoginAttempts: parseInt(e.target.value, 10) || 5 })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Session Expiry Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={config.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setConfig({ ...config, sessionTimeoutMinutes: parseInt(e.target.value, 10) || 60 })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.require2FA}
                  onChange={(e) => setConfig({ ...config, require2FA: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span>Enforce 2-Factor Authentication (2FA) for Admins</span>
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold text-rose-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.maintenanceMode}
                  onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                />
                <span>Enable System Maintenance Mode (Block non-admin user logins)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
            >
              {saving ? 'Saving Changes...' : 'Save Global Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
