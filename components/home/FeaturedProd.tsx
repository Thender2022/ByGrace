// components/sections/FeaturedProducts.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images?: string[];
  isActive?: boolean;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Much smaller image container */}
        <div className="relative w-full bg-[#f7f7f7] overflow-hidden" style={{ paddingBottom: '75%' }}>
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="mt-2">
          <h3 className="font-light text-black text-xs sm:text-sm tracking-wide truncate">
            {product.name}
          </h3>
          <p className="font-light text-xs sm:text-sm text-black mt-0.5">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          // Filter for active products and take first 4
          const activeProducts = data.products
            .filter((p: Product) => p.isActive !== false)
            .slice(0, 4);
          setFeaturedProducts(activeProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-white">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-light tracking-[0.15em] text-black uppercase">
            Latest Drop
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-0.5">
            Loading products...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-white">
      {/* Centered Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-light tracking-[0.15em] text-black uppercase">
          Latest Drop
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-0.5">
          All Merch
        </p>
      </div>

      {/* Fixed 4-column grid - no scrolling */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Centered View All button */}
      <div className="text-center mt-8 sm:mt-10">
        <Link
          href="/products"
          className="inline-block px-8 sm:px-10 py-2.5 sm:py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-light tracking-[0.15em] uppercase text-xs sm:text-sm"
        >
          View All
        </Link>
      </div>
    </section>
  );
}