import Link from 'next/link';
import Image from 'next/image';
import { products, getFeaturedProducts } from '@/lib/products';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <div className="relative z-20 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white uppercase">
            Skate Culture
          </h1>
          <p className="text-gray-300 font-light tracking-wider mt-4 text-lg">
            Premium skateboards, parts, and apparel for the modern rider
          </p>
          <Link
            href="/products"
            className="inline-block mt-8 bg-gold-500 text-black px-10 py-4 hover:bg-gold-400 transition-colors duration-300 font-light tracking-[0.2em] uppercase text-sm"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
            Featured
          </h2>
          <Link
            href="/products"
            className="text-sm text-gold-500 hover:text-gold-400 transition-colors font-light tracking-wider"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="group cursor-pointer border border-gray-200 hover:border-gold-500 transition-all duration-300 bg-white">
                <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                  <Image
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-light text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-gold-500 font-light mt-1">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      
      
    </div>
  );
}