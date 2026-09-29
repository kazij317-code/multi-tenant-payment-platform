'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Merchants', path: '/dashboard/merchants' },
    { name: 'Transactions', path: '/dashboard/transactions' },
    { name: 'API Keys', path: '/dashboard/apikeys' },
    { name: 'User Management', path: '/dashboard/users' },
    { name: 'Reports', path: '/dashboard/reports' },
    { name: 'Audit Logs', path: '/dashboard/auditlogs' },
  ];

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-600">Payment Hub</h2>
        <p className="text-xs text-gray-500">Multi-Tenant Platform</p>
      </div>
      <nav className="mt-2 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-6 py-3 text-sm font-medium ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
