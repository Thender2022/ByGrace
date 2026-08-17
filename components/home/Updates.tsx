'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  tags: string[];
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Updates() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 1; // Show one full post at a time

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/posts');
        const data = await res.json();
        
        if (res.ok) {
          const publishedPosts = data.posts.filter((p: Post) => p.status === 'Published');
          setPosts(publishedPosts);
        } else {
          setError('Failed to load updates');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error loading updates');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const startIndex = currentIndex * ITEMS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light tracking-wider">Loading updates...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-gray-900 uppercase">
          Latest Updates
        </h2>
        <p className="text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-1">
          News and events from the ByGrace community
        </p>
        <div className="w-12 h-px bg-gold-500 mx-auto mt-4" />
      </div>

      {/* Updates Container */}
      <div className="relative px-10 sm:px-12">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 hover:border-gold-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 sm:p-8 md:p-10">
              {/* Category & Date */}
              <div className="flex items-center justify-between mb-4">
                {post.category && (
                  <span className="text-sm text-gold-500 font-light tracking-wider uppercase">
                    {post.category.name}
                  </span>
                )}
                <span className="text-sm text-gray-400 font-light">
                  {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900">
                {post.title}
              </h3>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="w-12 h-px bg-gold-500 my-6" />

              {/* Full Content */}
              <div className="text-gray-700 font-light text-base leading-relaxed whitespace-pre-wrap space-y-4">
                {post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Link to Full Post */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  href={`/updates/${post.slug}`}
                  className="inline-block text-sm text-gray-400 hover:text-gold-500 transition-colors font-light tracking-wider uppercase"
                >
                  Read Full Post →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors z-10 bg-white border border-gray-200 rounded-full shadow-sm ${
                currentIndex === 0
                  ? 'text-gray-200 cursor-not-allowed'
                  : 'text-gray-400 hover:text-gold-500 hover:border-gold-500'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= totalPages - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors z-10 bg-white border border-gray-200 rounded-full shadow-sm ${
                currentIndex >= totalPages - 1
                  ? 'text-gray-200 cursor-not-allowed'
                  : 'text-gray-400 hover:text-gold-500 hover:border-gold-500'
              }`}
              aria-label="Next"
            >
              <ChevronRight size={24} />
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

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          href="/updates"
          className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-light tracking-[0.15em] uppercase text-sm"
        >
          View All Updates
        </Link>
      </div>
    </section>
  );
}