'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { getTotalItems, toggleCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('isAdmin');
    
    // Use a timeout to avoid the warning
    const timer = setTimeout(() => {
      setIsLoggedIn(!!user);
      setIsAdmin(!!admin);
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex justify-between items-center h-20">
          {/* Left Section - Logo + Desktop Navigation */}
          <div className="flex items-center -ml-8 md:-ml-12 lg:-ml-16">
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="relative w-[180px] h-[55px] sm:w-[200px] sm:h-[60px] md:w-[220px] md:h-[70px]">
                <Image
                  src="/BYGRACE_cutout.jpg"
                  alt="ByGrace"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-4 lg:ml-6">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              >
                Merch
              </Link>
              <Link
                href="/team"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              >
                Team
              </Link>
              <Link
                href="/content"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              >
                Videos
              </Link>
              <Link
                href="/updates"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              >
                Updates
              </Link>
            </div>
          </div>

          {/* Right Section - Sign In + Cart + Mobile Menu Button */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 pr-4 md:pr-6 lg:pr-8">
            {/* Desktop Sign In - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4">
              {mounted && isLoggedIn ? (
                <div className="flex items-center gap-3 md:gap-4">
                  {mounted && isAdmin && (
                    <Link
                      href="/admin"
                      className="text-xs text-gold-500 hover:text-gold-600 transition-colors font-light tracking-wider uppercase"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors font-light tracking-wider"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
            
            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative text-xl sm:text-2xl text-gold-500 hover:text-gold-400 transition-colors duration-300"
            >
              <i className="fas fa-shopping-cart"></i>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-gold-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 px-4 space-y-3">
            <Link
              href="/"
              className="block text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Merch
            </Link>
            <Link
              href="/team"
              className="block text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/content"
              className="block text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Videos
            </Link>
            <Link
              href="/updates"
              className="block text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Updates
            </Link>

            {/* Mobile Sign In/Out */}
            <div className="pt-3 border-t border-gray-100">
              {mounted && isLoggedIn ? (
                <div className="space-y-3">
                  {mounted && isAdmin && (
                    <Link
                      href="/admin"
                      className="block text-sm text-gold-500 hover:text-gold-600 transition-colors font-light tracking-wider"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-sm text-gray-500 hover:text-red-500 transition-colors font-light tracking-wider"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}