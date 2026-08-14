"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadImage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Upload the image file
      let imageUrl = "";
      
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        
        const uploadRes = await fetch("/api/admin/images/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload image");
        }
        
        imageUrl = uploadData.imageUrl;
      } else {
        throw new Error("Please select an image file");
      }

      // Step 2: Save the image metadata to the database
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category || null,
          imageUrl: imageUrl,
          description: formData.description || null,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          isActive: formData.isActive,
        }),
      });

      if (res.ok) {
        router.push("/admin/content/images");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save image metadata");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Upload Image</h1>
        <button
          onClick={() => router.push("/admin/content/images")}
          className="text-gray-400 hover:text-gray-600 hover:underline transition-all duration-200 text-sm"
        >
          ← Back to Images
        </button>
      </div>

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

        {/* File Upload */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Image File *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gold-500 file:text-black file:hover:bg-gold-400 file:cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">Select an image from your computer (JPEG, PNG, WebP, GIF, SVG - max 5MB)</p>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-light tracking-wider uppercase text-gray-500 mb-2">Preview</p>
            <div className="relative w-full max-h-64 overflow-hidden rounded">
              <Image
                src={previewUrl}
                alt="Preview"
                width={400}
                height={400}
                className="object-contain w-full h-auto max-h-64"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{selectedFile?.name} ({(selectedFile?.size && (selectedFile.size / 1024).toFixed(1))} KB)</p>
          </div>
        )}

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
            disabled={isSubmitting || !selectedFile}
            className="flex-1 bg-gold-500 border-2 border-gold-500 text-black px-8 py-2.5 hover:bg-gold-600 hover:border-gold-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light tracking-[0.15em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading..." : "Upload Image"}
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