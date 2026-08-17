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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (res.ok) {
          const activeVideos = data.videos.filter((v: Video) => v.isActive);
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

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (youtubeId: string) => {
    return `https://www.youtube.com/embed/${youtubeId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light tracking-wider">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-light tracking-[0.2em] uppercase text-gray-900">
            Videos
          </h1>
          <p className="text-gray-500 font-light tracking-wider mt-2 text-sm">
            Watch the latest from the ByGrace team
          </p>
          <div className="w-12 h-px bg-gold-500 mx-auto mt-4" />
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 text-gold-500">✦</div>
            <p className="text-gray-900 text-lg font-light">No videos yet</p>
            <p className="text-gray-500 text-sm mt-2 font-light">Check back soon for new content</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Video Player - 2/3 width centered */}
            {selectedVideo && (
              <div className="flex justify-center">
                <div className="w-full lg:w-2/3">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* YouTube Embed */}
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedVideo.youtubeId)}
                        title={selectedVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>

                    {/* Video Info */}
                    <div className="p-6">
                      <h2 className="text-xl font-light text-gray-900">
                        {selectedVideo.title}
                      </h2>
                      {selectedVideo.description && (
                        <p className="text-gray-500 font-light text-sm mt-2">
                          {selectedVideo.description}
                        </p>
                      )}
                      {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {selectedVideo.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Thumbnails Grid */}
            <div>
              <h3 className="text-sm font-light tracking-[0.15em] uppercase text-gray-400 mb-4 text-center">
                All Videos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group cursor-pointer border transition-all duration-300 bg-white overflow-hidden text-left ${
                      selectedVideo?.id === video.id
                        ? 'border-gold-500 ring-2 ring-gold-500/20'
                        : 'border-gray-200 hover:border-gold-500 hover:shadow-lg'
                    }`}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-gray-50 overflow-hidden">
                      <img
                        src={getYouTubeThumbnail(video.youtubeId)}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {selectedVideo?.id === video.id && (
                        <div className="absolute top-2 right-2 bg-gold-500 text-black text-xs px-2 py-0.5 font-light tracking-wider uppercase">
                          Playing
                        </div>
                      )}
                    </div>
                    
                    {/* Video Info */}
                    <div className="p-4">
                      <h4 className="text-sm font-light text-gray-900 group-hover:text-gold-500 transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      {video.tags && video.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {video.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                          {video.tags.length > 2 && (
                            <span className="text-[10px] text-gray-400">+{video.tags.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}