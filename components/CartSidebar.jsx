'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    closeCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Sidebar - White background */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-gold-500">✦</span>
            <h2 className="text-xl font-light tracking-[0.3em] text-gray-900 uppercase">
              Cart
            </h2>
            <span className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {getTotalItems()}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gold-500 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4" 
          style={{ 
            height: 'calc(100% - 180px)',
          }}
        >
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 text-gold-500">✦</div>
              <p className="text-gray-900 text-lg font-light">Your cart is empty</p>
              <p className="text-gray-500 text-sm mt-2 font-light">Discover our collection</p>
              <button
                onClick={closeCart}
                className="mt-8 bg-gold-500 text-white px-8 py-3 hover:bg-gold-400 transition-colors font-medium tracking-wide uppercase text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 border border-gray-200 hover:border-gold-500/40 transition-all">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-light text-gray-900 text-sm truncate">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-gray-200 text-gray-700 px-3 py-0.5">
                        {item.selectedSize}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-3 py-0.5">
                        {item.selectedColor}
                      </span>
                    </div>
                    <p className="text-gold-500 font-medium text-sm mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-7 h-7 border border-gray-300 hover:border-gold-500 hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-all"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-gray-900 font-light text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="w-7 h-7 border border-gray-300 hover:border-gold-500 hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="ml-auto text-xs text-gray-400 hover:text-gold-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-light tracking-wider text-sm uppercase">Total</span>
              <span className="text-2xl font-light text-gold-500">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/checkout"
                className="flex-1 bg-gold-500 text-white text-center py-3.5 hover:bg-gold-400 transition-colors font-medium tracking-[0.2em] uppercase text-sm"
                onClick={closeCart}
              >
                Checkout
              </Link>
              <button
                onClick={closeCart}
                className="flex-1 border border-gray-300 text-gray-700 py-3.5 hover:border-gold-500 hover:text-gold-500 transition-all font-light tracking-wider text-sm uppercase"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}