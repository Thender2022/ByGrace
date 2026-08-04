"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function EditImage() {
  const router = useRouter();
  const params = useParams();
  const imageId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageUrl: "",
    description: "",
    tags: "",
    isActive: true,
  });

  // Fetch image data
  useEffect(() => {
    const fetchImage = async () => {
      // Check if imageId exists and is a string
      if (!imageId || typeof imageId !== "string") {
        console.error("No valid image ID found in URL");
        alert("Invalid image ID. Please try again from the images list.");
        router.push("/admin/content/images");
        return;
      }

      try {
        console.log("🖼️ Fetching image with ID:", imageId);
        
        const res = await fetch(`/api/images/${imageId}`);
        console.log("🖼️ Response status:", res.status);
        
        // Handle different response statuses
        if (res.status === 405) {
          console.error("🖼️ API route not found");
          alert("API route not found. Please check that the file exists at: src/app/api/images/[id]/route.ts");
          router.push("/admin/content/images");
          return;
        }
        
        if (res.status === 404) {
          console.error("🖼️ Image not found with ID:", imageId);
          alert(`Image not found with ID: ${imageId}`);
          router.push("/admin/content/images");
          return;
        }
        
        if (res.status === 400) {
          console.error("🖼️ Bad request - invalid image ID:", imageId);
          alert("Invalid image ID format. Please try again.");
          router.push("/admin/content/images");
          return;
        }
        
        if (!res.ok) {
          console.error("🖼️ Error response status:", res.status);
          alert(`Failed to load image (Status: ${res.status})`);
          router.push("/admin/content/images");
          return;
        }
        
        // Only try to parse JSON if the response is OK
        let data;
        try {
          data = await res.json();
        } catch (parseError) {
          console.error("🖼️ Failed to parse JSON:", parseError);
          alert("Failed to parse image data. Please try again.");
          router.push("/admin/content/images");
          return;
        }
        
        console.log("🖼️ Image data received:", data);
        const image = data.image;
        setFormData({
          title: image.title,
          category: image.category?.name || "",
          imageUrl: image.imageUrl,
          description: image.description || "",
          tags: image.tags.join(", "),
          isActive: image.isActive,
        });
      } catch (error) {
        console.error("🖼️ Network error:", error);
        alert("Network error. Please try again.");
        router.push("/admin/content/images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [imageId, router]);

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
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category || null,
          imageUrl: formData.imageUrl,
          description: formData.description || null,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          isActive: formData.isActive,
        }),
      });

      if (res.ok) {
        router.push("/admin/content/images");
      } else if (res.status === 405) {
        alert("API route not found. Please check that the file exists at: src/app/api/images/[id]/route.ts");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update image");
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
        Loading image...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Edit Image</h1>
        <button
          onClick={() => router.push("/admin/content/images")}
          className="text-gray-400 hover:text-gray-600 hover:underline transition-all duration-200 text-sm"
        >
          ← Back to Images
        </button>
      </div>

      {/* Image Preview */}
      {formData.imageUrl && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-light tracking-wider uppercase text-gray-500 mb-2">Image Preview</p>
          <div className="relative w-48 h-48 mx-auto bg-gray-100 overflow-hidden rounded-lg">
            <Image
              src={formData.imageUrl}
              alt={formData.title || "Image preview"}
              fill
              className="object-cover"
              onError={() => alert("Failed to load image preview. Please check the URL.")}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Title */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Image Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="Enter image title..."
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Image URL *
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-400 mt-1">Enter a direct URL to your image.</p>
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
            placeholder="e.g., Team, Products, Events, Behind the Scenes"
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
            placeholder="Image description..."
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
            placeholder="skateboarding, team, event"
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
            {isSubmitting ? "Saving..." : "Update Image"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/content/images")}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-2.5 hover:border-gold-500 hover:text-gold-500 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light uppercase text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}