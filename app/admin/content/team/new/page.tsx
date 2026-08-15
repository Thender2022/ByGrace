"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadTeamMember() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    isActive: true,
    showOnHomepage: false,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // File size validation is handled by the server
    // The server will return an error if file is > 5MB

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setFileInfo({ name: file.name, size: file.size });

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setImageUrl(data.imageUrl);
      
      console.log('✅ File uploaded successfully:', data.imageUrl);
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
      // Clear preview on error
      setPreviewUrl(null);
      setFileInfo(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      alert('Please upload an image first');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        role: formData.role,
        image: imageUrl,
        quote: formData.quote || null,
        isActive: formData.isActive,
        showOnHomepage: formData.showOnHomepage,
        order: 0,
      };

      console.log('📤 Sending payload to API:', payload);

      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('📥 API Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Team member created:', data);
        router.push("/admin/content/team");
      } else {
        const data = await res.json();
        console.error('❌ API Error:', data);
        alert(data.error || "Failed to upload team member");
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URL when component unmounts
  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">👥 Add Team Member</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Upload a new team member. This will be saved to the TeamMember table.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/content/team")}
          className="text-gray-400 hover:text-gray-600 hover:underline transition-all duration-200 text-sm"
        >
          ← Back to Team
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Name */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Team Member Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="Enter team member name..."
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Role *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200"
            placeholder="e.g., Skater, Designer, Team Manager"
          />
        </div>

        {/* File Upload */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-light tracking-wider uppercase text-gray-500">
              Upload Team Photo *
            </label>
            {/* Show on Homepage Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="showOnHomepage"
                checked={formData.showOnHomepage}
                onChange={handleCheckbox}
                className="w-4 h-4 accent-gold-500 cursor-pointer"
              />
              <label className="text-xs text-gray-600 font-light cursor-pointer whitespace-nowrap">
                Show on Homepage
              </label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* File Upload Button - LEFT side */}
            <div className="flex-1 w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-6 py-4 w-full text-center transition-colors ${
                  uploading ? 'bg-gray-100' : 'hover:bg-gray-50 hover:border-gold-500'
                }`}
              >
                <span className="text-gray-600 font-light">
                  {uploading ? '⏳ Uploading...' : '📁 Click to select team photo'}
                </span>
              </label>
              <p className="text-xs text-gray-400 mt-3">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</p>
            </div>
            
            {/* Preview Image - RIGHT side */}
            {previewUrl ? (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                  onError={() => {
                    setPreviewUrl(null);
                    setFileInfo(null);
                  }}
                />
                {fileInfo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 truncate px-1">
                    {fileInfo.name.split('.').pop()?.toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                <span className="text-2xl text-gray-300">🖼️</span>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload Success Message */}
        {imageUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 font-light">
              ✅ Image uploaded successfully
            </p>
          </div>
        )}

        {/* Quote */}
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            Quote / Bio
          </label>
          <textarea
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-200 resize-none"
            placeholder="Team member quote or bio..."
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
          <label className="text-sm text-gray-700 font-light cursor-pointer">Active (visible on team page)</label>
        </div>

        {/* Team Member Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-light">
            👥 This will be saved to the TeamMember table and appear on the team page.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || uploading || !imageUrl}
            className="flex-1 bg-gold-500 border-2 border-gold-500 text-black px-8 py-2.5 hover:bg-gold-600 hover:border-gold-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light tracking-[0.15em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Add Team Member"}
          </button>
          <button
            type="button"
            onClick={() => {
              cleanup();
              router.push("/admin/content/team");
            }}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-2.5 hover:border-gold-500 hover:text-gold-500 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light uppercase text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}