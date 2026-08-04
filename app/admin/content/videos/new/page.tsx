"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Helper function to extract YouTube ID from various URL formats
function extractYouTubeId(input: string): string | null {
  if (!input) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  return null;
}

export default function UploadVideo() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    youtubeId: "",
    description: "",
    tags: "",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extract YouTube ID from URL or direct ID
      const youtubeId = extractYouTubeId(formData.youtubeId);
      if (!youtubeId) {
        alert("❌ Invalid YouTube URL or ID. Please check and try again.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category || null,
          youtubeId: youtubeId,
          description: formData.description || null,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          isActive: formData.isActive,
        }),
      });

      if (res.ok) {
        router.push("/admin/content/videos");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create video");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Upload Video</h1>
        <button
          onClick={() => router.push("/admin/content/videos")}
          className="text-gray-400 hover:text-gray-600 hover:underline transition-all duration-200 text-sm"
        >
          ← Back to Videos
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Title */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Video Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="Enter video title..."
          />
        </div>

        {/* YouTube ID/URL */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            YouTube URL or Video ID *
          </label>
          <input
            type="text"
            name="youtubeId"
            value={formData.youtubeId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="https://youtube.com/watch?v=... or Video ID"
          />
          <p className="text-xs text-gray-400 mt-1">Paste any YouTube URL or just the video ID.</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="e.g., Skate, Tutorial, Behind the Scenes"
          />
          <p className="text-xs text-gray-400 mt-1">Category will be created automatically if it doesn&apos;t exist.</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200 resize-none"
            placeholder="Video description..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="skateboarding, tricks, event"
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleCheckbox}
            className="w-4 h-4 accent-gold-500 cursor-pointer"
          />
          <label className="text-sm text-gray-700 font-light cursor-pointer">Active (visible on site)</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gold-500 border-2 border-gold-500 text-black px-8 py-2.5 hover:bg-gold-600 hover:border-gold-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light tracking-[0.15em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading..." : "Upload Video"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/content/videos")}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-2.5 hover:border-gold-500 hover:text-gold-500 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light uppercase text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}