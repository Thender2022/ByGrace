// components/sections/TeamSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
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
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/team');
        const data = await res.json();
        console.log('📥 Team API response:', data);
        
        if (res.ok) {
          const activeMembers = data.teamMembers.filter((m: TeamMember) => m.isActive);
          console.log('👥 Active members:', activeMembers);
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
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for swipe (mobile only)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    setIsSwiping(false);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    setTouchEndX(e.targetTouches[0].clientX);
    // Detect if user is swiping
    if (Math.abs(e.targetTouches[0].clientX - touchStartX) > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 768) return;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    }
    if (touchStartX - touchEndX < -50) {
      prevSlide();
    }
    setTouchStartX(0);
    setTouchEndX(0);
    // Reset swiping state after a delay
    setTimeout(() => setIsSwiping(false), 100);
  };

  // Handle click on arrows
  const handleArrowClick = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  // Get current page items for desktop
  const startIndex = currentIndex * itemsPerPage;
  const currentMembers = members.slice(startIndex, startIndex + itemsPerPage);
  const allMembers = members;

  // Mobile: Get single member for slideshow
  const mobileMember = members[currentIndex % members.length];

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

      {/* Desktop: Full Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {allMembers.map((member) => (
          <div
            key={member.id}
            className="group bg-white border border-gray-100 hover:border-gold-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <Link href="/team" className="block cursor-pointer">
              <div className="relative w-full bg-gray-100" style={{ paddingBottom: '100%' }}>
                <Image
                  src={member.image || '/team/placeholder.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Link>

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

      {/* Mobile: Single Member Slideshow */}
      <div 
        ref={containerRef}
        className="md:hidden relative max-w-xs mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white border border-gray-100 hover:border-gold-500 hover:shadow-lg transition-all duration-300 overflow-hidden">
          <Link href="/team" className="block cursor-pointer">
            <div className="relative w-full bg-gray-100" style={{ paddingBottom: '100%' }}>
              <Image
                src={mobileMember.image || '/team/placeholder.jpg'}
                alt={mobileMember.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Link>

          <div className="p-6">
            <h3 className="text-lg font-light tracking-wide text-black">
              {mobileMember.name}
            </h3>
            <p className="text-sm text-gray-500 font-light tracking-wider uppercase">
              {mobileMember.role}
            </p>
            {mobileMember.quote && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 font-light italic leading-relaxed">
                  &ldquo;{mobileMember.quote}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        {members.length > 1 && (
          <>
            <button
              onClick={() => handleArrowClick('prev')}
              className="absolute left-[-30px] top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gold-500 transition-colors duration-300 z-10 bg-white rounded-full shadow-sm border border-gray-200"
              aria-label="Previous"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleArrowClick('next')}
              className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gold-500 transition-colors duration-300 z-10 bg-white rounded-full shadow-sm border border-gray-200"
              aria-label="Next"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Mobile Dot Indicators */}
      {members.length > 1 && (
        <div className="md:hidden flex justify-center gap-2 mt-8">
          {members.map((_, index) => (
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

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          href="/team"
          className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-light tracking-[0.15em] uppercase text-sm"
        >
          View All
        </Link>
      </div>
    </section>
  );
}