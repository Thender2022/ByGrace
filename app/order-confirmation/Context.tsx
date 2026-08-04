'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface OrderDetails {
  id: string;
  amount: number;
  currency: string;
  customerEmail: string | null;
  status: string;
}

export default function OrderConfirmationContent() {  // ← This is the component name
  const { clearCart } = useCart();
  const hasCleared = useRef(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear cart only once when component mounts
  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  // Fetch order details
  useEffect(() => {
    let isMounted = true;

    async function fetchOrderDetails() {
      if (!sessionId) {
        if (isMounted) {
          setError('No session ID found');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`/api/order-details?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order details');
        }

        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setLoading(false);
        }
      }
    }

    fetchOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl text-gold-500 mb-6 animate-pulse">✦</div>
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Loading Order...
        </h1>
        <p className="text-gray-500 font-light mt-4">
          Please wait while we confirm your purchase.
        </p>
      </div>
    );
  }

  // Show error state
  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl text-red-500 mb-6">✕</div>
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Something Went Wrong
        </h1>
        <p className="text-gray-500 font-light mt-4">
          {error || 'We could not find your order details.'}
        </p>
        <div className="mt-8 space-y-4">
          <Link
            href="/products"
            className="inline-block bg-gold-500 text-black px-8 py-3 hover:bg-gold-400 transition-colors font-light tracking-[0.15em] uppercase text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl text-gold-500 mb-6">✦</div>
      
      <h1 className="text-3xl font-light tracking-[0.2em] text-gray-900 uppercase">
        Order Confirmed
      </h1>
      
      <p className="text-gray-500 font-light mt-4">
        Thank you for your order! You will receive a confirmation email shortly.
      </p>

      <div className="mt-8 border-t border-b border-gray-200 py-6 text-left">
        <h2 className="text-sm font-medium tracking-[0.15em] text-gray-400 uppercase mb-4">
          Order Summary
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 font-light">Order ID</dt>
            <dd className="font-mono text-gray-900">{order.id.slice(0, 14)}...</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-light">Total</dt>
            <dd className="font-medium text-gray-900">
              ${(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-light">Status</dt>
            <dd className="text-green-600 font-medium">Paid</dd>
          </div>
          {order.customerEmail && (
            <div className="flex justify-between">
              <dt className="text-gray-500 font-light">Email</dt>
              <dd className="text-gray-900">{order.customerEmail}</dd>
            </div>
          )}
        </dl>
      </div>
      
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