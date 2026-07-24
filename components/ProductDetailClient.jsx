'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Safely get arrays
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];

  const handleAddToCart = () => {
    // Check if size is required and selected
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Check if color is required and selected
    if (colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    setIsAdding(true);
    addToCart(product, selectedSize || 'Default', selectedColor || 'Default');
    
    // Show notification only
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsAdding(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="relative h-96 md:h-[600px] bg-gray-50 overflow-hidden border border-gold-500/20">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image available
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-500 uppercase tracking-[0.2em] bg-gray-100 px-4 py-1">
            {product.category}
          </span>
          <span className={`text-xs px-4 py-1 tracking-[0.1em] ${
            product.stock > 0 ? 'bg-black text-white' : 'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <h1 className="text-3xl font-light tracking-wide text-gray-900">
          {product.name}
        </h1>
        
        <div className="flex items-center mt-3">
          <span className="text-gold-500 text-xl">✦</span>
          <span className="text-lg font-light ml-2">{product.rating}</span>
          <span className="text-gray-400 ml-2">({product.reviews} reviews)</span>
        </div>

        <p className="text-3xl font-light text-gold-500 mt-4">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-gray-600 mt-4 leading-relaxed font-light">
          {product.description}
        </p>

        {/* Size Options */}
        {sizes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 border transition-all duration-300 text-sm ${
                    selectedSize === size
                      ? 'border-gold-500 bg-black text-white'
                      : 'border-gray-300 hover:border-gold-500 hover:bg-black hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Options */}
        {colors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase mb-3">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 border-2 transition-all duration-300 ${
                    selectedColor === color
                      ? 'border-gold-500 ring-2 ring-offset-2 ring-gold-500'
                      : 'border-gray-300 hover:border-gold-500'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className="mt-8 w-full bg-black text-white py-4 hover:bg-gray-900 transition-colors duration-300 font-light tracking-[0.2em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-gold-500/30 hover:border-gold-500 flex items-center justify-center gap-3"
        >
          <i className="fas fa-shopping-cart"></i>
          {isAdding ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

        {/* Notification Toast */}
        {showNotification && (
          <div className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 border border-gold-500/50 shadow-2xl z-50 animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="text-gold-500 text-xl">✦</span>
              <span className="font-light tracking-wide">Added to cart</span>
              <span className="text-gold-500 text-xl">✦</span>
            </div>
          </div>
        )}

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-4 text-xs text-gray-500 font-light tracking-wider">
            <span>✦ Secure checkout</span>
            <span className="w-px h-4 bg-gray-300"></span>
            <span>✦ Free shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
}