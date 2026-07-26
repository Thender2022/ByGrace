'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
  tags: string[];
  inventoryCount: number;
  isDigital: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'usd',
    category: '',
    tags: '',
    inventoryCount: 0,
    isDigital: false,
    images: [] as string[],
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // ✅ GOOD: Calculate filtered products during rendering with useMemo
  const filteredProducts = useMemo(() => {
    let list = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term)) ||
        (p.category?.toLowerCase().includes(term)) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [products, searchTerm, selectedCategory]);

  // ✅ GOOD: Fetch products - this is an effect because it syncs with an external system (the API)
  useEffect(() => {
    let ignore = false;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!ignore && res.ok) {
          const list = data.products || [];
          setProducts(list);
          // Extract unique categories
          const cats = [...new Set(list.filter((p: Product) => p.category).map((p: Product) => p.category))];
          setCategories(cats as string[]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    // ✅ GOOD: Cleanup to prevent race conditions
    return () => {
      ignore = true;
    };
  }, []); // Empty dependency array = run once on mount

  // Refresh products function (used after create/update/delete)
  const refreshProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (res.ok) {
      const list = data.products || [];
      setProducts(list);
      const cats = [...new Set(list.filter((p: Product) => p.category).map((p: Product) => p.category))];
      setCategories(cats as string[]);
    }
  };

  // Handle image files
  const handleImageFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const str = reader.result as string;
        setPreviews((prev) => [...prev, str]);
        setForm((prev) => ({ ...prev, images: [...prev.images, str] }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInput.current) fileInput.current.value = '';
  };

  // File input change handler
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageFiles(e.target.files);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Open edit form with product data
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      currency: product.currency,
      category: product.category || '',
      tags: product.tags.join(', '),
      inventoryCount: product.inventoryCount,
      isDigital: product.isDigital,
      images: product.images || [],
    });
    setPreviews(product.images || []);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  // Close edit form
  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: 0,
      currency: 'usd',
      category: '',
      tags: '',
      inventoryCount: 0,
      isDigital: false,
      images: [],
    });
    setPreviews([]);
  };

  // ✅ GOOD: Event handler for creating a product
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        price: parseFloat(form.price.toString()),
        inventoryCount: parseInt(form.inventoryCount.toString()),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ text: '✅ Product created successfully!', type: 'success' });
        setForm({ name: '', description: '', price: 0, currency: 'usd', category: '', tags: '', inventoryCount: 0, isDigital: false, images: [] });
        setPreviews([]);
        setShowAddForm(false);
        await refreshProducts();
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

  // ✅ GOOD: Event handler for updating a product
  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price.toString()),
        currency: form.currency,
        category: form.category || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        inventoryCount: parseInt(form.inventoryCount.toString()),
        isDigital: form.isDigital,
        images: form.images,
      };

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ text: '✅ Product updated successfully!', type: 'success' });
        closeEditForm();
        await refreshProducts();
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

  // ✅ GOOD: Event handler for toggling status
  const toggleStatus = async (id: string, current: boolean) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      await refreshProducts();
      setMessage({ text: `✅ Product ${!current ? 'activated' : 'deactivated'}`, type: 'success' });
    }
  };

  // ✅ GOOD: Event handler for deleting
  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await refreshProducts();
      setMessage({ text: '✅ Product deleted', type: 'success' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Manage Products</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showEditForm) closeEditForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 mb-4 rounded border ${message.type === 'success' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
          {message.text}
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h2 className="text-xl font-semibold mb-4">➕ Add New Product</h2>
          <form onSubmit={submitCreate} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Premium T-Shirt"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your product..."
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* Price, Currency, Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  name="inventoryCount"
                  value={form.inventoryCount}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g., Clothing, Electronics, Books"
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
                  placeholder="featured, sale, new-arrival"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Image Upload with Drag & Drop */}
            <div>
              <label className="block text-sm font-medium mb-1">Product Images</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                }`}
                onClick={() => fileInput.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInput}
                  onChange={handleImages}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm text-gray-600">
                  {isDragging ? 'Drop your images here!' : 'Click to upload or drag & drop images'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
              </div>
              {previews.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative">
                      <Image src={src} alt="" width={80} height={80} className="w-20 h-20 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Digital Product Checkbox */}
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isDigital" checked={form.isDigital} onChange={handleChange} />
              <label className="text-sm font-medium">💾 Digital product (no shipping required)</label>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Creating...' : '🚀 Create Product'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Product Form (Modal) */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">✏️ Edit Product</h2>
              <button
                onClick={closeEditForm}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={submitUpdate} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Premium T-Shirt"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe your product..."
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Price, Currency, Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="29.99"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select name="currency" value={form.currency} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="inventoryCount"
                    value={form.inventoryCount}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g., Clothing, Electronics, Books"
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
                    placeholder="featured, sale, new-arrival"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* Image Upload with Drag & Drop */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Images</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={() => fileInput.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInput}
                    onChange={handleImages}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600">
                    {isDragging ? 'Drop your images here!' : 'Click to upload or drag & drop images'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                </div>
                {previews.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative">
                        <Image src={src} alt="" width={80} height={80} className="w-20 h-20 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Digital Product Checkbox */}
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isDigital" checked={form.isDigital} onChange={handleChange} />
                <label className="text-sm font-medium">💾 Digital product (no shipping required)</label>
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

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">🔍 Search Products</label>
          <input
            type="text"
            placeholder="Search by name, description, category, or tags..."
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

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{products.length === 0 ? 'No products yet. Click "Add Product" to get started!' : 'No matches found'}</div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">Showing {filteredProducts.length} of {products.length} products</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!p.isActive ? 'opacity-60' : ''}`}>
                {/* Product Image */}
                <div className="h-48 bg-gray-100 relative">
                  {p.images?.length > 0 ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No image</div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{p.name}</h3>
                  {p.category && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📂 {p.category}</span>}
                  <p className="text-xl font-bold mt-2">{p.currency.toUpperCase()} {p.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">📦 Stock: {p.inventoryCount}</p>
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.map((t, i) => (
                        <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded">🏷️ {t}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditForm(p)}
                      className="flex-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(p.id, p.isActive)}
                      className={`flex-1 text-sm px-3 py-1 rounded ${p.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {p.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
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