'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api-keys');
      setApiKeys(response.data);
    } catch (err) {
      console.error('Failed to fetch API keys', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    const name = prompt('Enter a name for this API Key (e.g., Production Key):');
    if (!name) return;
    try {
      await API.post('/api-keys', { name });
      alert('API Key created successfully!');
      fetchApiKeys();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create API key');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    try {
      await API.delete(`/api-keys/${id}`);
      fetchApiKeys();
    } catch (err) {
      alert('Failed to delete API key');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">API Key Management</h3>
          <p className="text-sm text-gray-500">Manage your secret API keys for backend integration.</p>
        </div>
        <button
          onClick={handleCreateApiKey}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          + Generate API Key
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading API keys...</p>
      ) : apiKeys.length === 0 ? (
        <p className="text-sm text-gray-500">No API keys found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key: any) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{key.key}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteApiKey(key.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Revoke
                    </button>
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
