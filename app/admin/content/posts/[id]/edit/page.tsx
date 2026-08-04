"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "Draft" as "Draft" | "Published",
    content: "",
    excerpt: "",
    tags: "",
    featured: false,
  });

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      // Check if postId exists and is a string
      if (!postId || typeof postId !== "string") {
        console.error("No valid post ID found in URL");
        alert("Invalid post ID. Please try again from the posts list.");
        router.push("/admin/content/posts");
        return;
      }

      try {
        console.log("📝 Fetching post with ID:", postId);
        
        const res = await fetch(`/api/posts/${postId}`);
        console.log("📝 Response status:", res.status);
        
        // Handle different response statuses
        if (res.status === 405) {
          console.error("📝 API route not found");
          alert("API route not found. Please check that the file exists at: src/app/api/posts/[id]/route.ts");
          router.push("/admin/content/posts");
          return;
        }
        
        if (res.status === 404) {
          console.error("📝 Post not found with ID:", postId);
          alert(`Post not found with ID: ${postId}`);
          router.push("/admin/content/posts");
          return;
        }
        
        if (res.status === 400) {
          console.error("📝 Bad request - invalid post ID:", postId);
          alert("Invalid post ID format. Please try again.");
          router.push("/admin/content/posts");
          return;
        }
        
        if (!res.ok) {
          console.error("📝 Error response status:", res.status);
          alert(`Failed to load post (Status: ${res.status})`);
          router.push("/admin/content/posts");
          return;
        }
        
        // Only try to parse JSON if the response is OK
        let data;
        try {
          data = await res.json();
        } catch (parseError) {
          console.error("📝 Failed to parse JSON:", parseError);
          alert("Failed to parse post data. Please try again.");
          router.push("/admin/content/posts");
          return;
        }
        
        console.log("📝 Post data received:", data);
        const post = data.post;
        setFormData({
          title: post.title,
          category: post.category?.name || "",
          status: post.status,
          content: post.content,
          excerpt: post.excerpt || "",
          tags: post.tags.join(", "),
          featured: post.featured,
        });
      } catch (error) {
        console.error("📝 Network error:", error);
        alert("Network error. Please try again.");
        router.push("/admin/content/posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

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
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category || null,
          status: formData.status,
          content: formData.content,
          excerpt: formData.excerpt || null,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          featured: formData.featured,
        }),
      });

      if (res.ok) {
        router.push("/admin/content/posts");
      } else if (res.status === 405) {
        alert("API route not found. Please check that the file exists at: src/app/api/posts/[id]/route.ts");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update post");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 text-gray-500 font-light">
        Loading post...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Edit Post</h1>
        <button
          onClick={() => router.push("/admin/content/posts")}
          className="text-gray-400 hover:text-gray-600 hover:underline transition-all duration-200 text-sm"
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
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
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
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            >
              <option value="">Select or create category...</option>
              <option value="Announcement">Announcement</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Event">Event</option>
              <option value="Update">Update</option>
              <option value="Behind the Scenes">Behind the Scenes</option>
              <option value="Interview">Interview</option>
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
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
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
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
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
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
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
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200 resize-none"
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
            className="w-4 h-4 accent-gold-500 cursor-pointer"
          />
          <label className="text-sm text-gray-700 font-light cursor-pointer">Feature this post on homepage</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gold-500 border-2 border-gold-500 text-black px-8 py-2.5 hover:bg-gold-600 hover:border-gold-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light tracking-[0.15em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Update Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/content/posts")}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-2.5 hover:border-gold-500 hover:text-gold-500 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light uppercase text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}