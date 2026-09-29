'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import NotificationsDropdown from '@/components/NotificationsDropdown';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                PayHub
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                Multi-Tenant
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Features
            </a>
            {/* শুধু ইউজার লগইন থাকলে ড্যাশবোর্ড লিংক দেখাবে */}
            {isLoggedIn && (
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && <NotificationsDropdown />}
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
