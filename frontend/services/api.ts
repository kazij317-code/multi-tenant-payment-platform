// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000', // আপনার নেস্টজেএস ব্যাকএন্ডের পোর্ট (প্রয়োজন অনুযায়ী পরিবর্তন করে নেবেন)
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default API;

// -----------
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// রিকোয়েস্ট ইন্টারসেপ্টর: টোকেন থাকলে তা স্বয়ংক্রয়ভাবে Authorization হেডারে যুক্ত করবে
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;