'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple hardcoded admin credentials (for MVP only)
    // In production, use proper authentication
    if (email === 'admin@skateshop.com' && password === 'admin123') {
      // Set a session flag in localStorage
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header with Diamonds */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-gold-500 text-2xl">✦</span>
          <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
            Admin Login
          </h1>
          <span className="text-gold-500 text-2xl">✦</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
              placeholder="admin@skateshop.com"
            />
          </div>

          <div>
            <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-light">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-500 text-black py-3 hover:bg-gold-400 transition-colors font-light tracking-[0.2em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-gold-600 flex items-center justify-center gap-3 group"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">
              ✦
            </span>
            {isLoading ? 'Logging in...' : 'Login'}
            <span className="transition-transform duration-300 group-hover:scale-110">
              ✦
            </span>
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-light mt-6">
          Default: admin@skateshop.com / admin123
        </p>
      </div>
    </div>
  );
}