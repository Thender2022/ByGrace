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
              src="/logoSkate.jpeg"
              alt="ByGrace promotion"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </Link>
      </div>

      {/* Bottom Two Images - Side by side on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2">
        {/* Left Image */}
        <Link href="/products" className="block group">
          <div className="relative w-full bg-[#f7f7f7] overflow-hidden" style={{ paddingBottom: '100%' }}>
            <Image
              src="/hoodyPromo.jpeg"
              alt="ByGrace promotion"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="text-xs sm:text-xl font-light tracking-[0.1em] uppercase">
                  Apparel
                </h4>
                <p className="text-[8px] sm:text-xs font-light tracking-[0.2em] uppercase text-white/80 mt-0.5 sm:mt-1">
                  Explore →
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Right Image */}
        <Link href="/products" className="block group">
          <div className="relative w-full bg-[#f7f7f7] overflow-hidden" style={{ paddingBottom: '100%' }}>
            <Image
              src="/sandlotBoard.jpeg"
              alt="ByGrace promotion"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="text-xs sm:text-xl font-light tracking-[0.1em] uppercase">
                  Skateboards
                </h4>
                <p className="text-[8px] sm:text-xs font-light tracking-[0.2em] uppercase text-white/80 mt-0.5 sm:mt-1">
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