// // // 'use client';

// // // import { useState } from 'react';
// // // import { useRouter } from 'next/navigation';

// // // export default function DashboardPage() {
// // //   const router = useRouter();
// // //   const [activeTab, setActiveTab] = useState('overview');

// // //   const handleLogout = () => {
// // //     // Here we will clear auth tokens later
// // //     router.push('/login');
// // //   };

// // //   return (
// // //     <div className="flex h-screen bg-gray-100">
// // //       {/* Sidebar */}
// // //       <div className="w-64 bg-white shadow-md">
// // //         <div className="p-6">
// // //           <h2 className="text-2xl font-bold text-indigo-600">Payment Hub</h2>
// // //           <p className="text-xs text-gray-500">Multi-Tenant Platform</p>
// // //         </div>
// // //         <nav className="mt-6">
// // //           <button
// // //             onClick={() => setActiveTab('overview')}
// // //             className={`w-full text-left px-6 py-3 text-sm font-medium ${
// // //               activeTab === 'overview'
// // //                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
// // //                 : 'text-gray-600 hover:bg-gray-50'
// // //             }`}
// // //           >
// // //             Overview
// // //           </button>
// // //           <button
// // //             onClick={() => setActiveTab('transactions')}
// // //             className={`w-full text-left px-6 py-3 text-sm font-medium ${
// // //               activeTab === 'transactions'
// // //                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
// // //                 : 'text-gray-600 hover:bg-gray-50'
// // //             }`}
// // //           >
// // //             Transactions
// // //           </button>
// // //           <button
// // //             onClick={() => setActiveTab('apikeys')}
// // //             className={`w-full text-left px-6 py-3 text-sm font-medium ${
// // //               activeTab === 'apikeys'
// // //                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
// // //                 : 'text-gray-600 hover:bg-gray-50'
// // //             }`}
// // //           >
// // //             API Keys
// // //           </button>
// // //         </nav>
// // //       </div>

// // //       {/* Main Content */}
// // //       <div className="flex-1 flex flex-col overflow-hidden">
// // //         {/* Top Header */}
// // //         <header className="bg-white shadow-sm z-10">
// // //           <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
// // //             <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
// // //             <button
// // //               onClick={handleLogout}
// // //               className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </header>

// // //         {/* Dashboard Body */}
// // //         <main className="flex-1 overflow-y-auto p-6">
// // //           {activeTab === 'overview' && (
// // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //               <div className="bg-white p-6 rounded-lg shadow-sm">
// // //                 <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
// // //                 <p className="text-2xl font-bold text-gray-900 mt-2">$12,450.00</p>
// // //               </div>
// // //               <div className="bg-white p-6 rounded-lg shadow-sm">
// // //                 <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
// // //                 <p className="text-2xl font-bold text-gray-900 mt-2">1,240</p>
// // //               </div>
// // //               <div className="bg-white p-6 rounded-lg shadow-sm">
// // //                 <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
// // //                 <p className="text-2xl font-bold text-gray-900 mt-2">2</p>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {activeTab === 'transactions' && (
// // //             <div className="bg-white rounded-lg shadow-sm p-6">
// // //               <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
// // //               <p className="text-sm text-gray-500">Transaction history table will appear here.</p>
// // //             </div>
// // //           )}

// // //           {activeTab === 'apikeys' && (
// // //             <div className="bg-white rounded-lg shadow-sm p-6">
// // //               <h3 className="text-lg font-medium text-gray-900 mb-4">API Key Management</h3>
// // //               <p className="text-sm text-gray-500">Generate and manage your secret API keys here.</p>
// // //             </div>
// // //           )}
// // //         </main>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // ----------------
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import API from '@/services/api';

// // export default function DashboardPage() {
// //   const router = useRouter();
// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [transactions, setTransactions] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   // ট্রানজেকশন ট্যাবে ক্লিক করলে ব্যাকএন্ড থেকে ডেটা ফেচ করা
// //   useEffect(() => {
// //     if (activeTab === 'transactions') {
// //       fetchTransactions();
// //     }
// //   }, [activeTab]);

// //   const fetchTransactions = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await API.get('/transactions');
// //       setTransactions(response.data);
// //     } catch (error) {
// //       console.error('Failed to fetch transactions', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     // টোকেন বা সেশন ক্লিয়ার করে লগইন পেজে রিডাইরেক্ট করা
// //     router.push('/login');
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <div className="w-64 bg-white shadow-md">
// //         <div className="p-6">
// //           <h2 className="text-2xl font-bold text-indigo-600">Payment Hub</h2>
// //           <p className="text-xs text-gray-500">Multi-Tenant Platform</p>
// //         </div>
// //         <nav className="mt-6">
// //           <button
// //             onClick={() => setActiveTab('overview')}
// //             className={`w-full text-left px-6 py-3 text-sm font-medium ${
// //               activeTab === 'overview'
// //                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
// //                 : 'text-gray-600 hover:bg-gray-50'
// //             }`}
// //           >
// //             Overview
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('transactions')}
// //             className={`w-full text-left px-6 py-3 text-sm font-medium ${
// //               activeTab === 'transactions'
// //                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
// //                 : 'text-gray-600 hover:bg-gray-50'
// //             }`}
// //           >
// //             Transactions
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('apikeys')}
// //             className={`w-full text-left px-6 py-3 text-sm font-medium ${
// //               activeTab === 'apikeys'
// //                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
// //                 : 'text-gray-600 hover:bg-gray-50'
// //             }`}
// //           >
// //             API Keys
// //           </button>
// //         </nav>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         {/* Top Header */}
// //         <header className="bg-white shadow-sm z-10">
// //           <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
// //             <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
// //             <button
// //               onClick={handleLogout}
// //               className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </header>

// //         {/* Dashboard Body */}
// //         <main className="flex-1 overflow-y-auto p-6">
// //           {activeTab === 'overview' && (
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               <div className="bg-white p-6 rounded-lg shadow-sm">
// //                 <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
// //                 <p className="text-2xl font-bold text-gray-900 mt-2">$12,450.00</p>
// //               </div>
// //               <div className="bg-white p-6 rounded-lg shadow-sm">
// //                 <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
// //                 <p className="text-2xl font-bold text-gray-900 mt-2">1,240</p>
// //               </div>
// //               <div className="bg-white p-6 rounded-lg shadow-sm">
// //                 <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
// //                 <p className="text-2xl font-bold text-gray-900 mt-2">2</p>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'transactions' && (
// //             <div className="bg-white rounded-lg shadow-sm p-6">
// //               <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
// //               {loading ? (
// //                 <p className="text-sm text-gray-500">Loading transactions...</p>
// //               ) : transactions.length === 0 ? (
// //                 <p className="text-sm text-gray-500">No transactions found.</p>
// //               ) : (
// //                 <div className="overflow-x-auto">
// //                   <table className="min-w-full divide-y divide-gray-200">
// //                     <thead>
// //                       <tr>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="bg-white divide-y divide-gray-200">
// //                       {transactions.map((tx: any) => (
// //                         <tr key={tx.id}>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tx.amount}</td>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm">
// //                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                               tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
// //                             }`}>
// //                               {tx.status}
// //                             </span>
// //                           </td>
// //                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                             {new Date(tx.createdAt).toLocaleDateString()}
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {activeTab === 'apikeys' && (
// //             <div className="bg-white rounded-lg shadow-sm p-6">
// //               <h3 className="text-lg font-medium text-gray-900 mb-4">API Key Management</h3>
// //               <p className="text-sm text-gray-500">Generate and manage your secret API keys here.</p>
// //             </div>
// //           )}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// // --------------
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import API from '@/services/api';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // নতুন ট্রানজেকশন ফর্মের স্টেট
//   const [showModal, setShowModal] = useState(false);
//   const [amount, setAmount] = useState('');
//   const [reference, setReference] = useState('');
//   const [merchantId, setMerchantId] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (activeTab === 'transactions') {
//       fetchTransactions();
//     }
//   }, [activeTab]);

//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const response = await API.get('/transactions');
//       setTransactions(response.data);
//     } catch (error) {
//       console.error('Failed to fetch transactions', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateTransaction = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       await API.post('/transactions', {
//         amount: parseFloat(amount),
//         reference,
//         merchantId,
//         status: 'SUCCESS'
//       });

//       setSuccess('Transaction created successfully!');
//       setAmount('');
//       setReference('');
//       setMerchantId('');
//       setShowModal(false);
//       fetchTransactions(); // তালিকা রিফ্রেশ করা
//     } catch (err: any) {
//       console.error('Failed to create transaction', err);
//       setError(err.response?.data?.message || 'Failed to create transaction');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     router.push('/login');
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md">
//         <div className="p-6">
//           <h2 className="text-2xl font-bold text-indigo-600">Payment Hub</h2>
//           <p className="text-xs text-gray-500">Multi-Tenant Platform</p>
//         </div>
//         <nav className="mt-6">
//           <button
//             onClick={() => setActiveTab('overview')}
//             className={`w-full text-left px-6 py-3 text-sm font-medium ${
//               activeTab === 'overview'
//                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab('transactions')}
//             className={`w-full text-left px-6 py-3 text-sm font-medium ${
//               activeTab === 'transactions'
//                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             Transactions
//           </button>
//           <button
//             onClick={() => setActiveTab('apikeys')}
//             className={`w-full text-left px-6 py-3 text-sm font-medium ${
//               activeTab === 'apikeys'
//                 ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             API Keys
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="bg-white shadow-sm z-10">
//           <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//             <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* Dashboard Body */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {activeTab === 'overview' && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">$12,450.00</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">1,240</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">2</p>
//               </div>
//             </div>
//           )}

//           {activeTab === 'transactions' && (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
//                 <button
//                   onClick={() => setShowModal(true)}
//                   className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
//                 >
//                   + Add Transaction
//                 </button>
//               </div>

//               {success && (
//                 <div className="mb-4 bg-green-50 p-3 rounded-md text-sm text-green-600">
//                   {success}
//                 </div>
//               )}

//               {loading ? (
//                 <p className="text-sm text-gray-500">Loading transactions...</p>
//               ) : transactions.length === 0 ? (
//                 <p className="text-sm text-gray-500">No transactions found.</p>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead>
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {transactions.map((tx: any) => (
//                         <tr key={tx.id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tx.amount}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {tx.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {new Date(tx.createdAt).toLocaleDateString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'apikeys' && (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">API Key Management</h3>
//               <p className="text-sm text-gray-500">Generate and manage your secret API keys here.</p>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* Add Transaction Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Transaction</h3>
            
//             {error && (
//               <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleCreateTransaction} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Amount</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   required
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                   placeholder="100.00"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Reference</label>
//                 <input
//                   type="text"
//                   required
//                   value={reference}
//                   onChange={(e) => setReference(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                   placeholder="INV-001"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Merchant ID</label>
//                 <input
//                   type="text"
//                   required
//                   value={merchantId}
//                   onChange={(e) => setMerchantId(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                   placeholder="Enter merchant ID"
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
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ------------------
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/services/api';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // নতুন ট্রানজেকশন ফর্মের স্টেট
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else if (activeTab === 'apikeys') {
      fetchApiKeys();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await API.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api-keys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Failed to fetch API keys', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/transactions', {
        amount: parseFloat(amount),
        reference,
        merchantId,
        status: 'SUCCESS'
      });

      setSuccess('Transaction created successfully!');
      setAmount('');
      setReference('');
      setMerchantId('');
      setShowModal(false);
      fetchTransactions();
    } catch (err: any) {
      console.error('Failed to create transaction', err);
      setError(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  // const handleCreateApiKey = async () => {
  //   const name = prompt('Enter a name for this API Key (e.g., Production Key):');
  //   if (!name) return;
  //   try {
  //     await API.post('/api-keys', { name });
  //     alert('API Key created successfully!');
  //     fetchApiKeys();
  //   } catch (err) {
  //     console.error('Failed to create API key', err);
  //     alert('Failed to create API key');
  //   }
  // };
  const handleCreateApiKey = async () => {
    const name = prompt('Enter a name for this API Key (e.g., Production Key):');
    if (!name) return;
    try {
      await API.post('/api-keys', { name });
      alert('API Key created successfully!');
      fetchApiKeys();
    } catch (err: any) {
      console.error('Failed to create API key', err);
      // আসল এরর মেসেজটি দেখার জন্য
      const errorMessage = err.response?.data?.message || 'Failed to create API key';
      alert(errorMessage);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    try {
      await API.delete(`/api-keys/${id}`);
      fetchApiKeys();
    } catch (err) {
      console.error('Failed to delete API key', err);
      alert('Failed to delete API key');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600">Payment Hub</h2>
          <p className="text-xs text-gray-500">Multi-Tenant Platform</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${
              activeTab === 'transactions'
                ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('apikeys')}
            className={`w-full text-left px-6 py-3 text-sm font-medium ${
              activeTab === 'apikeys'
                ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            API Keys
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">$12,450.00</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">1,240</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Active API Keys</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">2</p>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  + Add Transaction
                </button>
              </div>

              {success && (
                <div className="mb-4 bg-green-50 p-3 rounded-md text-sm text-green-600">
                  {success}
                </div>
              )}

              {loading ? (
                <p className="text-sm text-gray-500">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((tx: any) => (
                        <tr key={tx.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tx.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'apikeys' && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
          )}
        </main>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Transaction</h3>
            
            {error && (
              <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reference</label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                  placeholder="INV-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Merchant ID</label>
                <input
                  type="text"
                  required
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Enter merchant ID"
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}