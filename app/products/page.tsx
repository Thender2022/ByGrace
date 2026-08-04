'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  isActive: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (res.ok) {
          // Only show active products
          const activeProducts = data.products.filter((p: Product) => p.isActive !== false);
          setProducts(activeProducts);
        } else {
          setError('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Collection
        </h1>
        <p className="text-gray-500 font-light tracking-wider mt-1 text-sm">
          Discover our exclusive skate collection
        </p>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}