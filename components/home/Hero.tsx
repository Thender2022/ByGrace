// components/sections/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] md:min-h-[600px] lg:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/squad.jpeg"
          alt="ByGrace Skate Team"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-4xl">
        <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-1.5 md:py-2 border border-white/20 rounded-full backdrop-blur-sm">
          <span className="text-[10px] md:text-xs font-light tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/80">
            Established 2026
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-light tracking-[0.1em] md:tracking-[0.15em] text-white uppercase leading-[1.1]">
          ByGrace
        </h1>
        <p className="text-white/70 font-light tracking-[0.15em] md:tracking-[0.25em] mt-3 md:mt-4 text-xs md:text-sm uppercase">
          Premium skateboards · parts · apparel
        </p>
        <div className="w-10 md:w-12 h-px bg-white/40 mx-auto mt-5 md:mt-6" />
        <p className="text-white/60 font-light tracking-wider mt-4 md:mt-6 text-sm md:text-base max-w-xl mx-auto leading-relaxed px-4">
          Curated for the modern rider who values craftsmanship, 
          quality, and timeless style.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-3.5 bg-white text-black hover:bg-white/90 transition-all duration-300 font-light tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs md:text-sm"
          >
            Shop Collection
          </Link>
          <Link
            href="/content"
            className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-3.5 border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 font-light tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs md:text-sm"
          >
            Explore Content
          </Link>
        </div>
      </div>
    </section>
  );
}