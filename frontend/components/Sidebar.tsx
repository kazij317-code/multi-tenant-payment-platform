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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full border-r border-gray-100">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>🛡️</span> Admin Panel
        </h2>
      </div>
      <nav className="mt-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
