// 'use client';

// import { useState, useEffect } from 'react';
// import API from '@/services/api';

// export default function MerchantsPage() {
//   const [merchants, setMerchants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     fetchMerchants();
//   }, []);

//   const fetchMerchants = async () => {
//     setLoading(true);
//     try {
//       const response = await API.get('/merchants');
//       setMerchants(response.data);
//     } catch (err) {
//       console.error('Failed to fetch merchants', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     try {
//       await API.post('/merchants', { name, email });
//       setSuccess('Merchant created successfully!');
//       setName('');
//       setEmail('');
//       setShowModal(false);
//       fetchMerchants();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to create merchant');
//     }
//   };

//   const handleToggleStatus = async (id: string, currentStatus: string) => {
//     const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
//     if (!confirm(`Change status to ${newStatus}?`)) return;
//     try {
//       await API.patch(`/merchants/${id}/status`, { status: newStatus });
//       fetchMerchants();
//     } catch (err) {
//       alert('Failed to update status');
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h3 className="text-lg font-medium text-gray-900">Merchant Management</h3>
//           <p className="text-sm text-gray-500">Manage tenant merchants and status.</p>
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
//         >
//           + Add Merchant
//         </button>
//       </div>

//       {success && <div className="mb-4 bg-green-50 p-3 rounded-md text-sm text-green-600">{success}</div>}

//       {loading ? (
//         <p className="text-sm text-gray-500">Loading merchants...</p>
//       ) : merchants.length === 0 ? (
//         <p className="text-sm text-gray-500">No merchants found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {merchants.map((m: any) => (
//                 <tr key={m.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       m.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {m.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => handleToggleStatus(m.id, m.status)}
//                       className={`${m.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
//                     >
//                       {m.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Merchant</h3>
//             {error && <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">{error}</div>}
//             <form onSubmit={handleCreate} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-gray-900"
//                   placeholder="Acme Corp"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-gray-900"
//                   placeholder="merchant@example.com"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
//                 >
//                   Create
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ------------

'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const response = await API.get('/merchants');
      setMerchants(response.data);
    } catch (err) {
      console.error('Failed to fetch merchants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/merchants', { name, email });
      setSuccess('Merchant created successfully!');
      setName('');
      setEmail('');
      setShowModal(false);
      fetchMerchants();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create merchant');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await API.patch(`/merchants/${id}/status`, { status: newStatus });
      fetchMerchants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update merchant status');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Merchant Management</h3>
          <p className="text-sm text-gray-500">Manage tenant merchants and status.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          + Add Merchant
        </button>
      </div>

      {success && <div className="mb-4 bg-green-50 p-3 rounded-md text-sm text-green-600">{success}</div>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading merchants...</p>
      ) : merchants.length === 0 ? (
        <p className="text-sm text-gray-500">No merchants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {merchants.map((merchant: any) => (
                <tr key={merchant.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">{merchant.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{merchant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      merchant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {merchant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleToggleStatus(merchant.id, merchant.status)}
                      className={`text-xs font-semibold hover:underline ${
                        merchant.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {merchant.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Merchant</h3>
            {error && <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">{error}</div>}
            <form onSubmit={handleCreateMerchant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Merchant Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-gray-900"
                  placeholder="Beta Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-gray-900"
                  placeholder="merchant@beta.com"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  Create Merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}