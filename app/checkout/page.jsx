'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/order-confirmation');
    }, 1500);
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Your cart is empty
        </h1>
        <p className="text-gray-500 font-light mt-2">
          Add some items to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 bg-gold-500 text-black px-8 py-3 hover:bg-gold-400 transition-colors font-light tracking-[0.15em] uppercase text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Diamonds */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
        <span className="text-gold-500 text-2xl">✦</span>
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Checkout
        </h1>
        <span className="text-gold-500 text-2xl">✦</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="order-2 lg:order-1">
          <h2 className="text-sm font-light tracking-[0.2em] text-gray-900 uppercase mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-light">{item.name}</p>
                  <p className="text-xs text-gray-500 font-light">
                    {item.selectedSize} | {item.selectedColor} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-gold-500 font-light">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600 font-light">Total</span>
              <span className="text-gold-500 font-light">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-light tracking-[0.15em] text-gray-900 uppercase mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 font-light focus:outline-none focus:border-black transition-colors"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gold-500 text-black py-3 hover:bg-gold-400 transition-colors font-light tracking-[0.2em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}