// components/sections/VideoSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (res.ok) {
          // Only show active videos, limit to 4
          const activeVideos = data.videos
            .filter((v: Video) => v.isActive)
            .slice(0, 4);
          setVideos(activeVideos);
          // Set the first video as selected by default
          if (activeVideos.length > 0) {
            setSelectedVideo(activeVideos[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (youtubeId: string) => {
    return `https://www.youtube.com/embed/${youtubeId}`;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-black uppercase">
            Latest Videos
          </h2>
          <p className="text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-1">
            Loading videos...
          </p>
        </div>
      </section>
    );
  }

  // Don't show section if no videos
  if (videos.length === 0 || !selectedVideo) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-black uppercase">
          Latest Videos
        </h2>
        <p className="text-xs text-gray-400 font-light tracking-[0.15em] uppercase mt-1">
          Watch the latest content from the team
        </p>
      </div>

      {/* Main Video Player - 2/3 width centered */}
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <iframe
              src={getYouTubeEmbedUrl(selectedVideo.youtubeId)}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          
          {/* Video Title & Description */}
          <div className="mt-4">
            <h3 className="text-lg font-light text-gray-900">
              {selectedVideo.title}
            </h3>
            {selectedVideo.description && (
              <p className="text-sm text-gray-500 font-light mt-1">
                {selectedVideo.description}
              </p>
            )}
            {selectedVideo.tags && selectedVideo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedVideo.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Grid - 4 columns */}
      {videos.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`group cursor-pointer border transition-all duration-300 overflow-hidden ${
                selectedVideo?.id === video.id
                  ? 'border-gold-500 ring-2 ring-gold-500/20'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-50 overflow-hidden">
                <img
                  src={getYouTubeThumbnail(video.youtubeId)}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="p-2">
                <p className="text-xs font-light text-gray-700 truncate">
                  {video.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* View All Button - linked to content page */}
      <div className="text-center mt-10">
        <Link
          href="/content"
          className="inline-block px-8 sm:px-10 py-2.5 sm:py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-light tracking-[0.15em] uppercase text-xs sm:text-sm"
        >
          View All Videos
        </Link>
      </div>
    </section>
  );
}