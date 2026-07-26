'use client';

import { useState, useEffect, useMemo } from 'react';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Video = {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  category: Category | null;
  tags: string[];
  thumbnail: string | null;
  isActive: boolean;
  createdAt: string;
};

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

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    youtubeId: '',
    categoryId: '',
    tags: '',
  });

  // ✅ MOVED: fetchVideos declared BEFORE the useEffect that calls it
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (res.ok) {
        const list = data.videos || [];
        setVideos(list);
        // Extract category names from the relation
        const cats = [...new Set(list.filter((v: Video) => v.category).map((v: Video) => v.category.name))];
        setCategories(cats as string[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshVideos = async () => {
    const res = await fetch('/api/videos');
    const data = await res.json();
    if (res.ok) {
      const list = data.videos || [];
      setVideos(list);
      const cats = [...new Set(list.filter((v: Video) => v.category).map((v: Video) => v.category.name))];
      setCategories(cats as string[]);
    }
  };

  // ✅ useEffect now comes AFTER fetchVideos is declared
  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    let list = videos;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((v) =>
        v.title.toLowerCase().includes(term) ||
        (v.description?.toLowerCase().includes(term)) ||
        (v.category?.name?.toLowerCase().includes(term)) ||
        v.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (selectedCategory !== 'all') {
      list = list.filter((v) => v.category?.name === selectedCategory);
    }
    return list;
  }, [videos, searchTerm, selectedCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditForm = (video: Video) => {
    setEditingVideo(video);
    setForm({
      title: video.title,
      description: video.description || '',
      youtubeId: video.youtubeId,
      categoryId: video.category?.id || '',
      tags: video.tags.join(', '),
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingVideo(null);
    setForm({ title: '', description: '', youtubeId: '', categoryId: '', tags: '' });
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const youtubeId = extractYouTubeId(form.youtubeId);
      if (!youtubeId) {
        setMessage({ text: '❌ Invalid YouTube URL or ID. Please check and try again.', type: 'error' });
        setIsSubmitting(false);
        return;
      }

      const data = {
        title: form.title,
        description: form.description || null,
        youtubeId: youtubeId,
        categoryId: form.categoryId || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      };

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ text: '✅ Video created successfully!', type: 'success' });
        setForm({ title: '', description: '', youtubeId: '', categoryId: '', tags: '' });
        setShowAddForm(false);
        await refreshVideos();
      } else {
        const result = await res.json();
        setMessage({ text: `❌ ${result.error || 'Error'}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '❌ Network error. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const youtubeId = extractYouTubeId(form.youtubeId);
      if (!youtubeId) {
        setMessage({ text: '❌ Invalid YouTube URL or ID. Please check and try again.', type: 'error' });
        setIsSubmitting(false);
        return;
      }

      const data = {
        title: form.title,
        description: form.description || null,
        youtubeId: youtubeId,
        categoryId: form.categoryId || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      };

      const res = await fetch(`/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ text: '✅ Video updated successfully!', type: 'success' });
        closeEditForm();
        await refreshVideos();
      } else {
        const result = await res.json();
        setMessage({ text: `❌ ${result.error || 'Error'}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '❌ Network error. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const res = await fetch(`/api/videos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      await refreshVideos();
      setMessage({ text: `✅ Video ${!current ? 'activated' : 'deactivated'}`, type: 'success' });
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await refreshVideos();
      setMessage({ text: '✅ Video deleted', type: 'success' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎬 Manage Videos</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showEditForm) closeEditForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Video'}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded border ${message.type === 'success' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h2 className="text-xl font-semibold mb-4">➕ Add New Video</h2>
          <form onSubmit={submitCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Video Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g., How to Skateboard"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">YouTube Link or Video ID *</label>
              <input
                type="text"
                name="youtubeId"
                value={form.youtubeId}
                onChange={handleChange}
                required
                placeholder="https://youtu.be/afBTbvL4iz0 or afBTbvL4iz0"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste any YouTube link or just the video ID.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your video..."
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  placeholder="Enter category name (e.g., Tutorials)"
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the category name (it will be created if it doesn't exist)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="skateboarding, tricks, tutorial"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Creating...' : '🚀 Create Video'}
            </button>
          </form>
        </div>
      )}

      {showEditForm && editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">✏️ Edit Video</h2>
              <button onClick={closeEditForm} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <form onSubmit={submitUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Video Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">YouTube Link or Video ID *</label>
                <input
                  type="text"
                  name="youtubeId"
                  value={form.youtubeId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button type="button" onClick={closeEditForm} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">🔍 Search Videos</label>
          <input
            type="text"
            placeholder="Search by title, description, category, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">📂 Filter by Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2 border rounded">
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {videos.length === 0 ? 'No videos yet. Click "Add Video" to get started!' : 'No matches found'}
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">Showing {filteredVideos.length} of {videos.length} videos</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((v) => (
              <div key={v.id} className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!v.isActive ? 'opacity-60' : ''}`}>
                {/* Video Player */}
                <div className="aspect-video bg-gray-100 relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{v.title}</h3>
                  {v.category && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      📂 {v.category.name}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{v.description || 'No description'}</p>
                  {v.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {v.tags.map((t, i) => (
                        <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded">🏷️ {t}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditForm(v)}
                      className="flex-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(v.id, v.isActive)}
                      className={`flex-1 text-sm px-3 py-1 rounded ${v.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {v.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                    </button>
                    <button onClick={() => deleteVideo(v.id)} className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}