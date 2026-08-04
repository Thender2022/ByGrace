"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";

type Video = {
  id: string;
  title: string;
  youtubeId: string;
  description: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  tags: string[];
  thumbnail: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch videos from API
  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      if (res.ok) {
        setVideos(data.videos || []);
      } else {
        setMessage({ text: "❌ Failed to load videos", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "❌ Network error", type: "error" });
    }
  }, []);

  // Load videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      await fetchVideos();
      setLoading(false);
    };
    loadVideos();
  }, [fetchVideos]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let list = videos;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(term) ||
          (v.description?.toLowerCase().includes(term)) ||
          (v.category?.name?.toLowerCase().includes(term)) ||
          v.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((v) =>
        filterStatus === "active" ? v.isActive : !v.isActive
      );
    }
    return list;
  }, [videos, searchTerm, filterStatus]);

  // Toggle active status
  const toggleStatus = async (id: string, current: boolean) => {
    const res = await fetch(`/api/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      await fetchVideos();
      setMessage({ text: `✅ Video ${!current ? "activated" : "deactivated"}`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Delete video
  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchVideos();
      setMessage({ text: "✅ Video deleted", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">🎬 Manage Videos</h1>
        <Link
          href="/admin/content/videos/new"
          className="bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
        >
          + Upload Video
        </Link>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 mb-4 rounded border ${
            message.type === "success" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            🔍 Search Videos
          </label>
          <input
            type="text"
            placeholder="Search by title, description, category, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            📂 Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
          >
            <option value="all">All Videos</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-light">Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-light border border-gray-200 bg-white rounded-lg p-12">
          {videos.length === 0
            ? "No videos yet. Click 'Upload Video' to get started!"
            : "No matches found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className={`bg-white rounded-lg shadow-sm border ${
                video.isActive ? "border-gray-200" : "border-red-200 opacity-60"
              } overflow-hidden hover:shadow-md transition-shadow`}
            >
              {/* Video Player */}
              <div className="aspect-video bg-gray-100 relative">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <div className="p-4">
                <h3 className="font-light text-gray-900 text-lg truncate">{video.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gold-500">{video.category?.name || "Uncategorized"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    video.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {video.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-light mt-1 line-clamp-2">
                  {video.description || "No description"}
                </p>
                {video.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.tags.map((t, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 font-light mt-2">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/content/videos/${video.id}/edit`}
                    className="flex-1 text-center text-sm bg-gold-500 text-black px-3 py-1.5 hover:bg-gold-400 transition-colors"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => toggleStatus(video.id, video.isActive)}
                    className={`flex-1 text-sm px-3 py-1.5 rounded transition-colors ${
                      video.isActive
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {video.isActive ? "🔴 Deactivate" : "🟢 Activate"}
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-1.5 hover:bg-red-200 transition-colors rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}