"use client";

import Link from "next/link";

export default function AdminContent() {
  return (
    <div>
      <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-6">📝 Content Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Videos Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎬</span>
            <h2 className="text-lg font-light tracking-[0.15em] uppercase">Videos</h2>
          </div>
          <p className="text-sm text-gray-500 font-light mb-4">
            Manage your video content. Upload, edit, and organize videos for your supporters.
          </p>
          <Link
            href="/admin/content/videos"
            className="inline-block bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
          >
            Manage Videos →
          </Link>
        </div>

        {/* Posts Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📝</span>
            <h2 className="text-lg font-light tracking-[0.15em] uppercase">Posts</h2>
          </div>
          <p className="text-sm text-gray-500 font-light mb-4">
            Create and manage blog posts, announcements, and updates for your community.
          </p>
          <Link
            href="/admin/content/posts"
            className="inline-block bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
          >
            Manage Posts →
          </Link>
        </div>

        {/* Images Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🖼️</span>
            <h2 className="text-lg font-light tracking-[0.15em] uppercase">Images</h2>
          </div>
          <p className="text-sm text-gray-500 font-light mb-4">
            Upload and organize images for your website, products, and marketing.
          </p>
          <Link
            href="/admin/content/images"
            className="inline-block bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
          >
            Manage Images →
          </Link>
        </div>
      </div>
    </div>
  );
}