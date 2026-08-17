"use client";

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      const isAdmin = localStorage.getItem("isAdmin");
      
      // If on login page, don't redirect
      if (pathname === "/admin/login") {
        setIsLoading(false);
        return;
      }
      
      if (!user || !isAdmin || isAdmin !== "true") {
        // Not authenticated, redirect to login
        router.push("/admin/login");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userRole");
    router.push("/admin/login");
  };

  // If on login page, just render children without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-light">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-black text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-light tracking-[0.3em] uppercase">ByGrace</h1>
          <p className="text-xs text-gray-400 tracking-wider">Admin Dashboard</p>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-gold-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black text-white p-4 border-t border-white/10">
          <nav className="space-y-1">
            <Link
              href="/admin"
              className={`block px-4 py-3 text-sm rounded transition-colors ${
                isActive('/admin') && !isActive('/admin/content') && !isActive('/admin/products') && !isActive('/admin/orders')
                  ? 'bg-white/10'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`block px-4 py-3 text-sm rounded transition-colors ${
                isActive('/admin/products') ? 'bg-white/10' : 'hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🛹 Products
            </Link>
            <Link
              href="/admin/orders"
              className={`block px-4 py-3 text-sm rounded transition-colors ${
                isActive('/admin/orders') ? 'bg-white/10' : 'hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📦 Orders
            </Link>
            
            {/* Content Dropdown */}
            <div className="mt-1">
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
                    href="/admin/content/team"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/team') ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    👥 Team
                  </Link>
                  <Link
                    href="/admin/content/videos"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/videos') ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🎬 Videos
                  </Link>
                  <Link
                    href="/admin/content/posts"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/posts') ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📝 Posts
                  </Link>
                  <Link
                    href="/admin/content/images"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/images') ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🖼️ Images
                  </Link>
                  <Link
                    href="/admin/content/hero"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/hero') ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🔄 Slideshow
                  </Link>
                </div>
              )}
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors mt-4"
            >
              🚪 Sign Out
            </button>
            
            <div className="pt-4 border-t border-white/10 mt-2">
              <Link
                href="/admin/settings"
                className={`block px-4 py-3 text-sm rounded transition-colors ${
                  isActive('/admin/settings') ? 'bg-white/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚙️ Settings
              </Link>
              <Link
                href="/"
                className="block px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors mt-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ← Back to Site
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white min-h-screen p-6 flex flex-col sticky top-0">
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
                    href="/admin/content/team"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/team') ? 'bg-white/10' : 'hover:bg-white/10'
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
                  <Link
                    href="/admin/content/hero"
                    className={`block px-4 py-2.5 text-sm rounded transition-colors pl-8 ${
                      isActive('/admin/content/hero') ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                  >
                    🔄 Slideshow
                  </Link>
                </div>
              )}
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors mt-4"
            >
              🚪 Sign Out
            </button>
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

      {/* Mobile Content */}
      <div className="md:hidden p-4">
        {children}
      </div>
    </div>
  );
}