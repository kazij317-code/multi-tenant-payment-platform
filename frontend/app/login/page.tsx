// // // 'use client';

// // // import { useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';

// // // export default function LoginPage() {
// // //   const [email, setEmail] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const router = useRouter();

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     // Here we will connect our NestJS backend API later
// // //     try {
// // //       // Example API call to NestJS backend
// // //       // const response = await API.post('/auth/login', { email, password });
// // //       // console.log(response.data);
// // //     console.log({ email, password });

// // //     // Temporarily redirecting to dashboard on successful login
// // //     router.push('/dashboard');
// // //     } catch (error) {
// // //       console.error('Login failed', error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
// // //       <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
// // //         <div>
// // //           <h2 className="text-center text-3xl font-extrabold text-gray-900">
// // //             Merchant Login
// // //           </h2>
// // //           <p className="mt-2 text-center text-sm text-gray-600">
// // //             Sign in to your multi-tenant payment account
// // //           </p>
// // //         </div>
// // //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// // //           <div className="space-y-4 rounded-md shadow-sm">
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700">Email Address</label>
// // //               <input
// // //                 type="email"
// // //                 required
// // //                 value={email}
// // //                 onChange={(e) => setEmail(e.target.value)}
// // //                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
// // //                 placeholder="merchant@example.com"
// // //               />
// // //             </div>
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700">Password</label>
// // //               <input
// // //                 type="password"
// // //                 required
// // //                 value={password}
// // //                 onChange={(e) => setPassword(e.target.value)}
// // //                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
// // //                 placeholder="••••••••"
// // //               />
// // //             </div>
// // //           </div>

// // //           <div>
// // //             <button
// // //               type="submit"
// // //               className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
// // //             >
// // //               Login
// // //             </button>
// // //           </div>

// // //           <div className="text-center text-sm">
// // //             <span className="text-gray-600">Don't have an account? </span>
// // //             <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
// // //               Register
// // //             </Link>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // --------------

// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import API from '@/services/api'; // আপনার তৈরি করা api.ts ইমপোর্ট করা হলো

// // export default function LoginPage() {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const router = useRouter();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError('');
// //     try {
// //       // NestJS ব্যাকএন্ডে লগইন রিকোয়েস্ট পাঠানো
// //       const response = await API.post('/auth/login', { email, password });
// //       console.log('Login successful:', response.data);

// //       // সফলভাবে লগইন হওয়ার পর ড্যাশবোর্ডে রিডাইরেক্ট করা
// //       router.push('/dashboard');
// //     } catch (err: any) {
// //       console.error('Login failed', err);
// //       setError(err.response?.data?.message || 'Invalid email or password');
// //     }
// //   };

// //   return (
// //     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
// //       <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
// //         <div>
// //           <h2 className="text-center text-3xl font-extrabold text-gray-900">
// //             Merchant Login
// //           </h2>
// //           <p className="mt-2 text-center text-sm text-gray-600">
// //             Sign in to your multi-tenant payment account
// //           </p>
// //         </div>

// //         {error && (
// //           <div className="bg-red-50 p-3 rounded-md text-sm text-red-600 text-center">
// //             {error}
// //           </div>
// //         )}

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="space-y-4 rounded-md shadow-sm">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Email Address</label>
// //               <input
// //                 type="email"
// //                 required
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
// //                 placeholder="merchant@example.com"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Password</label>
// //               <input
// //                 type="password"
// //                 required
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
// //                 placeholder="••••••••"
// //               />
// //             </div>
// //           </div>

// //           <div>
// //             <button
// //               type="submit"
// //               className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
// //             >
// //               Login
// //             </button>
// //           </div>

// //           <div className="text-center text-sm">
// //             <span className="text-gray-600">Don't have an account? </span>
// //             <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
// //               Register
// //             </Link>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // -------------------
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import API from '@/services/api';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [tenantSlug, setTenantSlug] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       // NestJS ব্যাকএন্ডে tenantSlug সহ লগইন রিকোয়েস্ট পাঠানো
//       const response = await API.post('/auth/login', { 
//         email, 
//         password, 
//         tenantSlug 
//       });
//       console.log('Login successful:', response.data);

//       // সফলভাবে লগইন হওয়ার পর ড্যাশবোর্ডে রিডাইরেক্ট করা
//       router.push('/dashboard');
//     } catch (err: any) {
//       console.error('Login failed', err);
//       setError(err.response?.data?.message || 'Invalid email, password, or tenant slug');
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
//         <div>
//           <h2 className="text-center text-3xl font-extrabold text-gray-900">
//             Merchant Login
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Sign in to your multi-tenant payment account
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 p-3 rounded-md text-sm text-red-600 text-center">
//             {error}
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4 rounded-md shadow-sm">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email Address</label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                 placeholder="merchant@example.com"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Tenant Slug</label>
//               <input
//                 type="text"
//                 required
//                 value={tenantSlug}
//                 onChange={(e) => setTenantSlug(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                 placeholder="my-store"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               Login
//             </button>
//           </div>

//           <div className="text-center text-sm">
//             <span className="text-gray-600">Don't have an account? </span>
//             <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Register
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// --------------
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/services/api';
import PasswordInput from '@/components/PasswordInput';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/login', {
        email,
        password,
        tenantSlug
      });

      console.log('Login successful:', response.data);

      const token = response.data.accessToken || response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
      }

      router.push('/dashboard');

    } catch (err: any) {
      console.error('Login failed', err);
      const serverMsg = err.response?.data?.message;
      if (Array.isArray(serverMsg)) {
        setError(serverMsg.join(', '));
      } else if (typeof serverMsg === 'string') {
        setError(serverMsg);
      } else if (err.message && err.message.includes('Network Error')) {
        setError('Network Error: Cannot connect to backend server. Please check your internet connection.');
      } else {
        setError('Invalid email, password, or tenant slug');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Merchant Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your multi-tenant payment account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-md text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Demo Credentials Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 text-xs space-y-3 shadow-sm">
            <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
              <span className="font-semibold text-indigo-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>🔑</span> Super Admin Demo
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@platform.com');
                  setTenantSlug('system');
                  setPassword('SuperAdmin@123');
                }}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-medium transition-colors shadow-xs"
              >
                Auto Fill Super Admin
              </button>
            </div>

            <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
              <span className="font-semibold text-indigo-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>🛡️</span> Tenant Admin Demo (Acme)
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@acme.com');
                  setTenantSlug('acme-corp');
                  setPassword('Nabhan@123');
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition-colors shadow-xs"
              >
                Auto Fill Tenant Admin
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-indigo-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>👤</span> Manager Demo (Beta)
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@beta.com');
                  setTenantSlug('beta-corp');
                  setPassword('newpassword123');
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-medium transition-colors shadow-xs"
              >
                Auto Fill Manager
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                  placeholder="merchant@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tenant Slug</label>
                <input
                  type="text"
                  required
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                  placeholder="my-store"
                />
              </div>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Register
                </Link>
              </div>
              <div>
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
