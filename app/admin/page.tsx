'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalVideos: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-6">Dashboard</h1>
      
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
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-light tracking-[0.15em] uppercase mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/products/new"
            className="bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light"
          >
            + Add Product
          </a>
          <a
            href="/admin/videos/new"
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors text-sm font-light"
          >
            + Add Video
          </a>
          <a
            href="/admin/orders"
            className="border border-gray-300 text-gray-700 px-6 py-2 hover:border-gold-500 hover:text-gold-500 transition-colors text-sm font-light"
          >
            View Orders
          </a>
        </div>
      </div>
    </div>
  );
}