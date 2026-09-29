// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';

// // export default function RegisterPage() {
// //   const [name, setName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const router = useRouter();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     // Here we will connect our NestJS backend registration API later
// //     console.log({ name, email, password });
    
// //     // Temporarily redirecting to login on successful registration
// //     router.push('/login');
// //   };

// //   return (
// //     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
// //       <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
// //         <div>
// //           <h2 className="text-center text-3xl font-extrabold text-gray-900">
// //             Merchant Register
// //           </h2>
// //           <p className="mt-2 text-center text-sm text-gray-600">
// //             Create your new multi-tenant payment account
// //           </p>
// //         </div>
// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="space-y-4 rounded-md shadow-sm">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Full Name</label>
// //               <input
// //                 type="text"
// //                 required
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
// //                 placeholder="John Doe"
// //               />
// //             </div>
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
// //               Register
// //             </button>
// //           </div>

// //           <div className="text-center text-sm">
// //             <span className="text-gray-600">Already have an account? </span>
// //             <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
// //               Login
// //             </Link>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // -------------
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import API from '@/services/api';

// export default function RegisterPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       // NestJS ব্যাকএন্ডে রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো
//       const response = await API.post('/auth/register', { name, email, password });
//       console.log('Registration successful:', response.data);
      
//       // সফলভাবে রেজিস্ট্রেশন হওয়ার পর লগইন পেজে রিডাইরেক্ট করা
//       router.push('/login');
//     } catch (err: any) {
//       console.error('Registration failed', err);
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
//         <div>
//           <h2 className="text-center text-3xl font-extrabold text-gray-900">
//             Merchant Register
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Create your new multi-tenant payment account
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
//               <label className="block text-sm font-medium text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
//                 placeholder="John Doe"
//               />
//             </div>
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
//               Register
//             </button>
//           </div>

//           <div className="text-center text-sm">
//             <span className="text-gray-600">Already have an account? </span>
//             <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Login
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

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/register', { 
        name, 
        email, 
        password, 
        tenantSlug 
      });
      console.log('Registration successful:', response.data);
      router.push('/login');
    } catch (err: any) {
      console.error('Registration failed', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Merchant Register
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your new multi-tenant payment account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded-md text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                placeholder="John Doe"
              />
            </div>
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
              <label className="block text-sm font-medium text-gray-700">Tenant Slug (e.g., store-name)</label>
              <input
                type="text"
                required
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                placeholder="my-store-slug"
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
              Register
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}