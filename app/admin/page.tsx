'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalVideos: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (res.ok && isMounted) {
          setStats({
            totalProducts: data.totalProducts || 0,
            totalOrders: data.totalOrders || 0,
            totalVideos: data.totalVideos || 0,
            revenue: data.revenue || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const quickActions = [
    { label: '+ Add Product', href: '/admin/products/new', style: 'bg-gold-500 text-black hover:bg-gold-400' },
    { label: '+ Add Video', href: '/admin/videos/new', style: 'bg-black text-white hover:bg-gray-800' },
    { label: 'View Orders', href: '/admin/orders', style: 'border border-gray-300 text-gray-700 hover:border-gold-500 hover:text-gold-500' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Dashboard</h1>

        {/* Mobile Dropdown Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:border-gold-500 transition-colors text-sm font-light tracking-wider flex items-center gap-2"
          >
            <span>Quick Actions</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-light">Total Products</p>
          <p className="text-3xl font-light text-gray-900">
            {loading ? '...' : stats.totalProducts}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-light">Total Orders</p>
          <p className="text-3xl font-light text-gray-900">
            {loading ? '...' : stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-light">Total Videos</p>
          <p className="text-3xl font-light text-gray-900">
            {loading ? '...' : stats.totalVideos}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-light">Revenue</p>
          <p className="text-3xl font-light text-gray-900">
            {loading ? '...' : `$${stats.revenue.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isDropdownOpen && (
        <div className="md:hidden mb-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`block p-4 text-center transition-colors border-b border-gray-100 last:border-b-0 ${action.style}`}
              onClick={() => setIsDropdownOpen(false)}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop Quick Actions */}
      <div className="hidden md:block bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-light tracking-[0.15em] uppercase mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`px-6 py-2 transition-colors text-sm font-light ${action.style}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}