'use client';

import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function ProductsPage() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}