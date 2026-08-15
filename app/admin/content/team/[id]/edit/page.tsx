// app/admin/content/team/[id]/edit/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  quote: string | null;
  image: string;
  order: number;
  isActive: boolean;
  showOnHomepage: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function EditTeamMember() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    isActive: true,
    showOnHomepage: false,
  });

  // Fetch team member data
  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const res = await fetch(`/api/team/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch team member");
        }
        const data = await res.json();
        const member = data.teamMember;
        
        setFormData({
          name: member.name || "",
          role: member.role || "",
          quote: member.quote || "",
          isActive: member.isActive ?? true,
          showOnHomepage: member.showOnHomepage ?? false,
        });
        setImageUrl(member.image || "");
      } catch (error) {
        console.error("Error fetching team member:", error);
        setError("Failed to load team member data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeamMember();
    }
  }, [id]);

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
      alert('Please upload an image');
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

      console.log('📤 Updating payload:', payload);

      const res = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('📥 API Response status:', res.status);

      // Check if response has content before parsing JSON
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', text);
        throw new Error('Server returned invalid response');
      }

      if (res.ok) {
        console.log('✅ Team member updated:', data);
        router.push("/admin/content/team");
      } else {
        console.error('❌ API Error:', data);
        alert(data.error || "Failed to update team member");
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert(error instanceof Error ? error.message : "Network error. Please try again.");
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12 text-gray-500 font-light">
          Loading team member...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-light">{error}</p>
          <button
            onClick={() => router.push("/admin/content/team")}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← Back to Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">✏️ Edit Team Member</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Update team member information
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
              Team Photo
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
                  {uploading ? '⏳ Uploading...' : '📁 Click to change photo'}
                </span>
              </label>
              <p className="text-xs text-gray-400 mt-3">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</p>
            </div>
            
            {/* Preview Image - RIGHT side */}
            {(previewUrl || imageUrl) ? (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={previewUrl || imageUrl}
                  alt="Preview"
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                  onError={() => {
                    if (previewUrl) {
                      setPreviewUrl(null);
                      setFileInfo(null);
                    }
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
        {imageUrl && !previewUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 font-light">
              ✅ Current image
            </p>
          </div>
        )}

        {/* Image Upload Success Message for new upload */}
        {previewUrl && imageUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 font-light">
              ✅ New image uploaded successfully
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

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-light">
            ✏️ Update the team member information. Changes will be saved to the TeamMember table.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || uploading || !imageUrl}
            className="flex-1 bg-gold-500 border-2 border-gold-500 text-black px-8 py-2.5 hover:bg-gold-600 hover:border-gold-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-light tracking-[0.15em] uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Team Member"}
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