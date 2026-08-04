"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Announcement",
    status: "Draft",
    content: "",
    excerpt: "",
    tags: "",
    featured: false,
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
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          status: formData.status,
          content: formData.content,
          excerpt: formData.excerpt,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          featured: formData.featured,
        }),
      });

      if (res.ok) {
        router.push("/admin/content/posts");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create post");
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
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Create New Post</h1>
        <button
          onClick={() => router.push("/admin/content/posts")}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          ← Back to Posts
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Title */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="Enter post title..."
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
            >
              <option value="Announcement">Announcement</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Event">Event</option>
              <option value="Update">Update</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Excerpt (Short Preview)
          </label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="Brief summary of your post..."
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
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="skateboarding, tutorial, tricks"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors resize-none"
            placeholder="Write your post content here..."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleCheckbox}
            className="w-4 h-4 accent-gold-500"
          />
          <label className="text-sm text-gray-700 font-light">Feature this post on homepage</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gold-500 text-black px-8 py-2.5 hover:bg-gold-400 transition-colors font-light tracking-[0.15em] uppercase text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/content/posts")}
            className="border border-gray-300 text-gray-700 px-8 py-2.5 hover:border-gold-500 hover:text-gold-500 transition-colors font-light uppercase text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}