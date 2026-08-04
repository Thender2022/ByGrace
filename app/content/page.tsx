"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type Video = {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  thumbnail: string | null;
  tags: string[];
  isActive: boolean;
  createdAt: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (res.ok) {
          // Only show active videos
          const activeVideos = data.videos.filter((v: Video) => v.isActive);
          setVideos(activeVideos);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Diamonds */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        <span className="text-gold-500 text-2xl">✦</span>
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Videos
        </h1>
        <span className="text-gold-500 text-2xl">✦</span>
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 text-gold-500">✦</div>
          <p className="text-gray-900 text-lg font-light">No videos yet</p>
          <p className="text-gray-500 text-sm mt-2 font-light">Check back soon for new content</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link key={video.id} href={`/videos/${video.id}`}>
              <div className="group cursor-pointer border border-gray-200 hover:border-gold-500 transition-all duration-300 bg-white overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-50 overflow-hidden">
                  <img
                    src={getYouTubeThumbnail(video.youtubeId)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-lg font-light text-gray-900 group-hover:text-gold-500 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  
                  {video.description && (
                    <p className="text-gray-500 font-light text-sm mt-2 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {video.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{video.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}