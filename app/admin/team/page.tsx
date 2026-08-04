'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  quote: string | null;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    role: '',
    quote: '',
    image: '',
    order: 0,
    isActive: true,
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/team');
      const data = await res.json();
      if (res.ok) {
        setMembers(data.teamMembers || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: '❌ Image must be less than 5MB', type: 'error' });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage({ text: '❌ Please upload an image file', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setForm((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const openEditForm = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      quote: member.quote || '',
      image: member.image || '',
      order: member.order || 0,
      isActive: member.isActive,
    });
    setImagePreview(member.image || null);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingMember(null);
    setForm({
      name: '',
      role: '',
      quote: '',
      image: '',
      order: 0,
      isActive: true,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage({ text: '✅ Team member created successfully!', type: 'success' });
        setForm({ name: '', role: '', quote: '', image: '', order: 0, isActive: true });
        setImagePreview(null);
        setShowAddForm(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await fetchMembers();
      } else {
        const data = await res.json();
        setMessage({ text: `❌ ${data.error || 'Error creating member'}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '❌ Network error. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/team/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage({ text: '✅ Team member updated successfully!', type: 'success' });
        closeEditForm();
        await fetchMembers();
      } else {
        const data = await res.json();
        setMessage({ text: `❌ ${data.error || 'Error updating member'}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '❌ Network error. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ text: '✅ Team member deleted successfully!', type: 'success' });
        await fetchMembers();
      } else {
        setMessage({ text: '❌ Failed to delete member', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '❌ Network error. Please try again.', type: 'error' });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        await fetchMembers();
        setMessage({ 
          text: `✅ Member ${!currentStatus ? 'activated' : 'deactivated'}`, 
          type: 'success' 
        });
      }
    } catch (error) {
      setMessage({ text: '❌ Failed to update status', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showEditForm) closeEditForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Team Member'}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 mb-4 rounded border ${message.type === 'success' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
          {message.text}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h2 className="text-xl font-semibold mb-4">➕ Add New Team Member</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Pro Skater"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quote</label>
              <textarea
                name="quote"
                value={form.quote}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Profile Image</label>
              <div className="flex items-center gap-4">
                <div 
                  className="relative w-24 h-24 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-gold-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center p-2">
                      Click to upload
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                  >
                    Choose Image
                  </button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setForm((prev) => ({ ...prev, image: '' }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-600 mt-1"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <label className="text-sm font-medium">Active</label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : '🚀 Create Member'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">✏️ Edit Team Member</h2>
              <button onClick={closeEditForm} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role *</label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quote</label>
                <textarea
                  name="quote"
                  value={form.quote}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Image Upload for Edit */}
              <div>
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div 
                    className="relative w-24 h-24 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-gold-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center p-2">
                        Click to upload
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                    >
                      Choose Image
                    </button>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForm((prev) => ({ ...prev, image: '' }));
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-600 mt-1"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <label className="text-sm font-medium">Active</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={closeEditForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Members List */}
      {loading ? (
        <div className="text-center py-8">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No team members yet. Click &ldquo;Add Team Member&rdquo; to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                !member.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={member.image || '/team/placeholder.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                {member.quote && (
                  <p className="text-sm text-gray-600 italic mt-2">&ldquo;{member.quote}&rdquo;</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Order: {member.order}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-4 pt-0">
                <button
                  onClick={() => openEditForm(member)}
                  className="flex-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => toggleStatus(member.id, member.isActive)}
                  className={`flex-1 text-sm px-3 py-1 rounded ${
                    member.isActive
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {member.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}