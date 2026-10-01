import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
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

// রেসপন্স ইন্টারসেপ্টর: ৪০১ (মেয়াদোত্তীর্ণ/ইনভ্যালিড টোকেন) এলে লোকালস্টোরেজ ক্লিয়ার ও রিডাইরেক্ট করা
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;