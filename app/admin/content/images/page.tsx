"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

type ImageType = {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminImages() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch images from API
  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (res.ok) {
        setImages(data.images || []);
      } else {
        setMessage({ text: "❌ Failed to load images", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "❌ Network error", type: "error" });
    }
  }, []);

  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      await fetchImages();
      setLoading(false);
    };
    loadImages();
  }, [fetchImages]);

  // Filter images
  const filteredImages = useMemo(() => {
    let list = images;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (img) =>
          img.title.toLowerCase().includes(term) ||
          (img.description?.toLowerCase().includes(term)) ||
          (img.category?.name?.toLowerCase().includes(term)) ||
          img.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((img) =>
        filterStatus === "active" ? img.isActive : !img.isActive
      );
    }
    return list;
  }, [images, searchTerm, filterStatus]);

  // Toggle active status
  const toggleStatus = async (id: string, current: boolean) => {
    const res = await fetch(`/api/images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      await fetchImages();
      setMessage({ text: `✅ Image ${!current ? "activated" : "deactivated"}`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Delete image
  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchImages();
      setMessage({ text: "✅ Image deleted", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">🖼️ Manage Images</h1>
        <Link
          href="/admin/content/images/new"
          className="bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
        >
          + Upload Image
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
            🔍 Search Images
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
            <option value="all">All Images</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-light">Loading images...</div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-light border border-gray-200 bg-white rounded-lg p-12">
          {images.length === 0
            ? "No images yet. Click 'Upload Image' to get started!"
            : "No matches found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`bg-white rounded-lg shadow-sm border ${
                image.isActive ? "border-gray-200" : "border-red-200 opacity-60"
              } overflow-hidden hover:shadow-md transition-shadow`}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-light text-gray-900 text-sm truncate">{image.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gold-500">{image.category?.name || "Uncategorized"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    image.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {image.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-light mt-1 line-clamp-2">
                  {image.description || "No description"}
                </p>
                {image.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.map((t, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 font-light mt-2">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/content/images/${image.id}/edit`}
                    className="flex-1 text-center text-sm bg-gold-500 text-black px-3 py-1.5 hover:bg-gold-400 transition-colors rounded"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => toggleStatus(image.id, image.isActive)}
                    className={`flex-1 text-sm px-3 py-1.5 rounded transition-colors ${
                      image.isActive
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {image.isActive ? "🔴 Deactivate" : "🟢 Activate"}
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
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