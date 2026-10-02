'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import API from '@/services/api';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.role === 'SUPER_ADMIN') {
            setIsSuperAdmin(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    ...(isSuperAdmin ? [{ name: '👑 Tenant Management', path: '/dashboard/tenants' }] : []),
    { name: 'Merchants', path: '/dashboard/merchants' },
    { name: 'Transactions', path: '/dashboard/transactions' },
    { name: 'API Keys', path: '/dashboard/apikeys' },
    { name: 'User Management', path: '/dashboard/users' },
    { name: 'Reports', path: '/dashboard/reports' },
    { name: 'Audit Logs', path: '/dashboard/auditlogs' },
    ...(isSuperAdmin ? [{ name: '⚙️ System Settings', path: '/dashboard/settings' }] : []),
  ];

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 max-w-[85vw] bg-white shadow-xl md:shadow-md flex flex-col h-full border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pb-2 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>{isSuperAdmin ? '⚡ Super Admin' : '🛡️ Admin Panel'}</span>
            </h2>
            {isSuperAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-purple-100 text-purple-700 font-semibold rounded-full">
                Global Master Access
              </span>
            )}
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              ✕
            </button>
          )}
        </div>
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
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
    </>
  );
}
