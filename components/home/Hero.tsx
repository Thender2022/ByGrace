// components/sections/HeroSection.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type HeroImage = {
  id: string;
  imageUrl: string;
  altText: string | null;
  title: string;
  description: string | null;
  isActive: boolean;
  isSlideshow: boolean;
};

export default function HeroSection() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch hero images
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        if (res.ok) {
          const slideshowImages = data.images?.filter((img: any) => img.isSlideshow) || [];
          console.log('✅ Hero images fetched:', slideshowImages);
          setImages(slideshowImages);
        } else {
          console.error('Failed to fetch hero images:', data);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // If no images, show nothing or a fallback
  if (loading) {
    return (
      <section className="relative h-[70vh] min-h-[500px] md:min-h-[600px] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="text-white/50 text-sm font-light tracking-wider uppercase">
          Loading...
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] md:min-h-[600px] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="text-center px-6 sm:px-8 max-w-4xl">
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

  const currentImage = images[currentIndex];
  
  // Debug: Log the current image URL
  console.log('🖼️ Current image URL:', currentImage.imageUrl);

  return (
    <section className="relative h-[70vh] min-h-[500px] md:min-h-[600px] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with fade transition - Full width */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.altText || 'ByGrace Skate Team'}
            width={1920}
            height={1080}
            className="w-full h-auto max-h-full object-cover object-center"
            priority
            onError={(e) => {
              console.error('❌ Image failed to load:', currentImage.imageUrl);
            }}
          />
        </div>
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

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}