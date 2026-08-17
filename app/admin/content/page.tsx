"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminContent() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    {
      id: "videos",
      icon: "🎬",
      title: "Videos",
      description: "Manage your video content. Upload, edit, and organize videos for your supporters.",
      href: "/admin/content/videos",
    },
    {
      id: "posts",
      icon: "📝",
      title: "Posts",
      description: "Create and manage blog posts, announcements, and updates for your community.",
      href: "/admin/content/posts",
    },
    {
      id: "images",
      icon: "🖼️",
      title: "Images",
      description: "Upload and organize images for your website, products, and marketing.",
      href: "/admin/content/images",
    },
    {
      id: "team",
      icon: "👥",
      title: "Team",
      description: "Manage team members, their roles, and profiles.",
      href: "/admin/content/team",
    },
    {
      id: "hero",
      icon: "🎯",
      title: "Hero Slideshow",
      description: "Manage the hero section slideshow images.",
      href: "/admin/content/hero",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">📝 Content Management</h1>

        {/* Dropdown Button - visible on all screen sizes */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:border-gold-500 transition-colors text-sm font-light tracking-wider flex items-center gap-2"
        >
          <span>Menu</span>
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu - visible on all screen sizes */}
      {isDropdownOpen && (
        <div className="mb-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-light tracking-[0.15em] uppercase">{item.title}</h3>
                  <p className="text-xs text-gray-500 font-light mt-0.5 line-clamp-1">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}