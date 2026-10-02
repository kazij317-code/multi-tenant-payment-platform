'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import API from '@/services/api';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ email: 'admin@admin.com', name: 'admin' });
      }
    } else if (token) {
      setUser({ email: 'admin@admin.com', name: 'admin' });
    } else {
      setUser(null);
    }
    setIsLoaded(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setDropdownOpen(false);
      router.push('/');
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'admin';
    if (user.name) return user.name;
    return user.email.split('@')[0];
  };

  if (!isLoaded) return null;

  // লগআউট অবস্থায় বা টোকেন না থাকলে ইমেজের মতো Login টেক্সট ও গ্র্যাডিয়েন্ট Register বোতাম দেখাবে
  if (!user) {
    return (
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link
          href="/login"
          className="text-xs sm:text-base font-medium text-slate-700 hover:text-indigo-600 transition-colors px-2 py-1"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-xs sm:text-base font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          Register
        </Link>
      </div>
    );
  }

  // লগইন থাকলে প্রোফাইল ও ড্রপডাউন দেখাবে
  return (
    <div className="flex items-center space-x-3">
      {/* User Avatar + Name + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-2.5 px-2 py-1 rounded-full hover:bg-gray-100/80 transition-colors focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src="/avatar.jpg"
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>

          <span className="text-sm font-semibold text-slate-800">
            {getUserDisplayName()}
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="pb-3 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500">Welcome back!</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.email || 'admin@admin.com'}
              </p>
            </div>

            <div className="py-2 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Dashboard</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.197m0 0A9.093 9.093 0 012.25 18.24a3 3 0 014.682-2.72" />
                </svg>
                <span>Switch User</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-500 rounded-xl hover:bg-rose-50 font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-rose-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
