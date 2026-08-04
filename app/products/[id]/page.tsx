'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  isActive: boolean;
};

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart, openCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (res.ok) {
          const foundProduct = data.products.find((p: Product) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Product not found');
          }
        } else {
          setError('Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 'Default', 'Default');
      setAddedToCart(true);
      openCart();
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">{error || 'Product not found'}</h1>
          <Link href="/products" className="text-black underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-[#f7f7f7] overflow-hidden">
          {product.images && product.images.length > 0 ? (
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
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
            {product.name}
          </h1>
          
          <p className="text-xl sm:text-2xl font-light mt-2">
            {product.currency.toUpperCase()} {product.price.toFixed(2)}
          </p>
          
          {product.description && (
            <p className="text-gray-600 font-light mt-4 leading-relaxed">
              {product.description}
            </p>
          )}

          <button
            onClick={handleAddToCart}
            className={`mt-6 sm:mt-8 px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-light tracking-[0.15em] uppercase text-sm ${
              addedToCart ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>

          <Link
            href="/products"
            className="mt-4 text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}