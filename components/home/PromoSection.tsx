// components/sections/PromoSection.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-white">
      {/* Top Large Image - More height */}
      <div className="mb-4 sm:mb-6">
        <Link href="/products" className="block group">
          <div className="relative w-full bg-[#f7f7f7] overflow-hidden" style={{ paddingBottom: '55%' }}>
            <Image
              src="/logoSkate.jpeg" // Replace with your image
              alt="ByGrace promotion"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Optional overlay with text */}
            {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.1em] uppercase">
                  New Collection
                </h3>
                <p className="text-xs sm:text-sm font-light tracking-[0.2em] uppercase text-white/80 mt-2">
                  Shop Now →
                </p>
              </div>
            </div> */}
          </div>
        </Link>
      </div>

      {/* Bottom Two Images - Even more height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Image */}
        <Link href="/products" className="block group">
          <div className="relative w-full bg-[#f7f7f7] overflow-hidden" style={{ paddingBottom: '85%' }}>
            <Image
              src="/hoodyPromo.jpeg" // Replace with your image
              alt="ByGrace promotion"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="text-lg sm:text-xl font-light tracking-[0.1em] uppercase">
                  Apparel
                </h4>
                <p className="text-[10px] sm:text-xs font-light tracking-[0.2em] uppercase text-white/80 mt-1">
                  Explore →
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Right Image */}
        <Link href="/products" className="block group">
          <div className="relative w-full bg-[#f7f7f7] overflow-hidden" style={{ paddingBottom: '85%' }}>
            <Image
              src="/sandlotBoard.jpeg" // Replace with your image
              alt="ByGrace promotion"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="text-lg sm:text-xl font-light tracking-[0.1em] uppercase">
                  Skateboards
                </h4>
                <p className="text-[10px] sm:text-xs font-light tracking-[0.2em] uppercase text-white/80 mt-1">
                  Explore →
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}