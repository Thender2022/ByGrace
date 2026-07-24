'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { getTotalItems, toggleCart } = useCart();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-gold-500 text-xl">✦</span>
            <span className="font-light tracking-[0.2em] text-gray-900 uppercase text-sm">
              Skate Shop
            </span>
            <span className="text-gold-500 text-xl">✦</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
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
              Collection
            </Link>
            <Link
              href="/content"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light tracking-wider"
            >
              Content
            </Link>
            
            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative text-2xl text-gold-500 hover:text-gold-400 transition-colors duration-300"
            >
              <i className="fas fa-shopping-cart"></i>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-gold-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}