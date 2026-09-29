'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_50%_-20rem,#e0e7ff,transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-700">Enterprise Multi-Tenant Payment Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            Next Generation <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Payment Infrastructure
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Empower your SaaS with isolated tenant architecture, high-performance transaction processing, role-based controls, and automated compliance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 text-center"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-2xl border border-gray-200 shadow-sm transition-all text-center"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">99.99%</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">100%</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Tenant Isolation</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">&lt;50ms</p>
              <p className="text-xs font-medium text-gray-500 mt-1">API Latency</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">256-bit</p>
              <p className="text-xs font-medium text-gray-500 mt-1">AES Encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Built for Scale, Security & Performance
            </h2>
            <p className="mt-4 text-gray-600 font-medium">
              Everything you need to accept payments and manage complex multi-tenant workflows seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tenant Isolation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Logical schema-level workspace isolation ensuring strict data security across organizations and sub-merchants.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Granular RBAC</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Role-based access control with Super Admin, Tenant Admin, Manager, Operator, and Viewer permissions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Export</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Instant CSV exports, revenue metrics, failed transaction breakdowns, and immutable audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-white font-bold text-lg">PayHub Multi-Tenant</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PayHub Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
