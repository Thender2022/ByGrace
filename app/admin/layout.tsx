"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isContentOpen, setIsContentOpen] = useState(true);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white min-h-screen p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-light tracking-[0.3em] uppercase">ByGrace</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-wider">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link
            href="/admin"
            className={`block px-4 py-3 text-sm rounded transition-colors ${
              isActive('/admin') && !isActive('/admin/content') && !isActive('/admin/products') && !isActive('/admin/orders')
                ? 'bg-white/10'
                : 'hover:bg-white/10'
            }`}
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`block px-4 py-3 text-sm rounded transition-colors ${
              isActive('/admin/products') ? 'bg-white/10' : 'hover:bg-white/10'
            }`}
          >
            🛹 Products
          </Link>
          <Link
            href="/admin/orders"
            className={`block px-4 py-3 text-sm rounded transition-colors ${
              isActive('/admin/orders') ? 'bg-white/10' : 'hover:bg-white/10'
            }`}
          >
            📦 Orders
          </Link>
          
          {/* Content Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => setIsContentOpen(!isContentOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded transition-colors ${
                isActive('/admin/content') ? 'bg-white/10' : 'hover:bg-white/10'
              }`}
            >
              <span>📝 Content</span>
              <span className="text-xs">{isContentOpen ? '▼' : '▶'}</span>
            </button>
            
            {isContentOpen && (
              <div className="mt-1 space-y-1">
                <Link
                  href="/admin/content"
                  className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                    isActive('/admin/content') && !isActive('/admin/content/videos') && !isActive('/admin/content/posts') && !isActive('/admin/content/images')
                      ? 'bg-white/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  🏠 All
                </Link>
                <Link
                  href="/admin/content/images"
                  className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                    isActive('/admin/content/images') ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}
                >
                  👥 Team
                </Link>
                <Link
                  href="/admin/content/videos"
                  className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                    isActive('/admin/content/videos') ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}
                >
                  🎬 Videos
                </Link>
                <Link
                  href="/admin/content/posts"
                  className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                    isActive('/admin/content/posts') ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}
                >
                  📝 Posts
                </Link>
                <Link
                  href="/admin/content/images"
                  className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                    isActive('/admin/content/images') ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}
                >
                  🖼️ Images
                </Link>
              </div>
            )}
          </div>
        </nav>
        
        <div className="pt-4 border-t border-white/10">
          <Link
            href="/admin/settings"
            className={`block px-4 py-3 text-sm rounded transition-colors ${
              isActive('/admin/settings') ? 'bg-white/10' : 'hover:bg-white/10'
            }`}
          >
            ⚙️ Settings
          </Link>
          <Link
            href="/"
            className="block px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors mt-1"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}