'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function OrderConfirmationPage() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  // Clear cart only once when component mounts
  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Success Icon */}
      <div className="text-6xl text-gold-500 mb-6">✦</div>
      
      <h1 className="text-3xl font-light tracking-[0.2em] text-gray-900 uppercase">
        Order Confirmed
      </h1>
      
      <p className="text-gray-500 font-light mt-4">
        Thank you for your order! You will receive a confirmation email shortly.
      </p>
      
      <div className="mt-8 space-y-4">
        <Link
          href="/products"
          className="inline-block bg-gold-500 text-black px-8 py-3 hover:bg-gold-400 transition-colors font-light tracking-[0.15em] uppercase text-sm"
        >
          Continue Shopping
        </Link>
        <br />
        <Link
          href="/"
          className="inline-block text-gray-500 hover:text-gold-500 transition-colors font-light text-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}