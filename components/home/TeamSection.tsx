// components/sections/TeamSection.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  quote: string | null;
  image: string;
  order: number;
  isActive: boolean;
};

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/team');
        const data = await res.json();
        console.log('📥 Team API response:', data); // Debug log
        
        if (res.ok) {
          // Only show active members
          const activeMembers = data.teamMembers.filter((m: TeamMember) => m.isActive);
          console.log('👥 Active members:', activeMembers); // Debug log
          setMembers(activeMembers);
        } else {
          setError(data.error || 'Failed to load team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Error loading team members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const totalPages = Math.ceil(members.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    }
    if (touchStartX - touchEndX < -50) {
      prevSlide();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Get current page items
  const startIndex = currentIndex * itemsPerPage;
  const currentMembers = members.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-black uppercase">
            The Team
          </h2>
          <p className="text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-1">
            Loading team members...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-black uppercase">
            The Team
          </h2>
          <p className="text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-1">
            No team members yet
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-black uppercase">
          The Team
        </h2>
        <p className="text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-1">
          Meet the riders
        </p>
      </div>

      {/* Slideshow Container */}
      <div 
        ref={containerRef}
        className="relative px-10 sm:px-12"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-white border border-gray-100 hover:border-gold-500 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full bg-gray-100" style={{ paddingBottom: '100%' }}>
                <Image
                  src={member.image || '/team/placeholder.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-light tracking-wide text-black">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500 font-light tracking-wider uppercase">
                  {member.role}
                </p>
                {member.quote && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 font-light italic leading-relaxed">
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gold-500 transition-colors duration-300 z-10"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gold-500 transition-colors duration-300 z-10"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gold-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}