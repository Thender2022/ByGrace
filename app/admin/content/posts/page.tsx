"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";

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
  status: "Published" | "Draft";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        setMessage({ text: "❌ Failed to load posts", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "❌ Network error", type: "error" });
    }
  }, []);

  // Load posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    loadPosts();
  }, [fetchPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let list = posts;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term) ||
          (p.category?.name?.toLowerCase().includes(term)) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((p) => p.status === filterStatus);
    }
    return list;
  }, [posts, searchTerm, filterStatus]);

  // Toggle status
  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "Published" ? "Draft" : "Published";
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      await fetchPosts();
      setMessage({ text: `✅ Post ${newStatus}`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Toggle featured
  const toggleFeatured = async (id: string, current: boolean) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    if (res.ok) {
      await fetchPosts();
      setMessage({ text: `✅ Featured ${!current ? "added" : "removed"}`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchPosts();
      setMessage({ text: "✅ Post deleted", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">📝 Manage Posts</h1>
        <Link
          href="/admin/content/posts/new"
          className="bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
        >
          + Create Post
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
            🔍 Search Posts
          </label>
          <input
            type="text"
            placeholder="Search by title, content, category, or tags..."
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
            <option value="all">All Posts</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-light">Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-light border border-gray-200 bg-white rounded-lg p-12">
          {posts.length === 0
            ? "No posts yet. Click 'Create Post' to get started!"
            : "No matches found"}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 font-light">{post.title}</p>
                        {post.featured && (
                          <span className="text-xs text-gold-500 font-light">⭐ Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gold-500">{post.category?.name || "Uncategorized"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          post.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 font-light">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/content/posts/${post.id}/edit`}
                          className="text-xs text-gold-500 hover:text-gold-600 transition-colors"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => toggleStatus(post.id, post.status)}
                          className={`text-xs transition-colors ${
                            post.status === "Published"
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-green-500 hover:text-green-600"
                          }`}
                        >
                          {post.status === "Published" ? "🔴 Unpublish" : "🟢 Publish"}
                        </button>
                        <button
                          onClick={() => toggleFeatured(post.id, post.featured)}
                          className={`text-xs transition-colors ${
                            post.featured
                              ? "text-gray-400 hover:text-gray-600"
                              : "text-gold-500 hover:text-gold-600"
                          }`}
                        >
                          {post.featured ? "☆ Unfeature" : "⭐ Feature"}
                        </button>
                        <Link
                          href={`/content/posts/${post.slug}`}
                          target="_blank"
                          className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          👁️ View
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}