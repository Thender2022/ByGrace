"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
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

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHomepage, setFilterHomepage] = useState("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch team members from API
  const fetchTeamMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (res.ok) {
        setMembers(data.teamMembers || []);
      } else {
        setMessage({ text: "❌ Failed to load team members", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "❌ Network error", type: "error" });
    }
  }, []);

  // Load members on mount
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      await fetchTeamMembers();
      setLoading(false);
    };
    loadMembers();
  }, [fetchTeamMembers]);

  // Filter members
  const filteredMembers = useMemo(() => {
    let list = members;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (member) =>
          member.name.toLowerCase().includes(term) ||
          member.role.toLowerCase().includes(term) ||
          (member.quote?.toLowerCase().includes(term))
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((member) =>
        filterStatus === "active" ? member.isActive : !member.isActive
      );
    }
    if (filterHomepage !== "all") {
      list = list.filter((member) =>
        filterHomepage === "homepage" ? member.showOnHomepage : !member.showOnHomepage
      );
    }
    return list;
  }, [members, searchTerm, filterStatus, filterHomepage]);

  // Toggle active status
  const toggleStatus = async (id: string, current: boolean) => {
    const res = await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      await fetchTeamMembers();
      setMessage({ text: `✅ Member ${!current ? "activated" : "deactivated"}`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Toggle homepage visibility
  const toggleHomepage = async (id: string, current: boolean) => {
    const res = await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showOnHomepage: !current }),
    });
    if (res.ok) {
      await fetchTeamMembers();
      setMessage({ text: `✅ Member ${!current ? "added to" : "removed from"} homepage`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Delete member
  const deleteMember = async (id: string) => {
    if (!confirm("Delete this team member? This cannot be undone.")) return;
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchTeamMembers();
      setMessage({ text: "✅ Team member deleted", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/team/placeholder.jpg';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">👥 Manage Team</h1>
        <Link
          href="/admin/content/team/new"
          className="bg-gold-500 text-black px-6 py-2 hover:bg-gold-400 transition-colors text-sm font-light tracking-wider"
        >
          + Add Team Member
        </Link>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 mb-4 rounded border ${
            message.type === "success" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            🔍 Search Team Members
          </label>
          <input
            type="text"
            placeholder="Search by name, role, or quote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            📂 Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
          >
            <option value="all">All Members</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-light tracking-wider uppercase text-gray-500 mb-1.5">
            🏠 Homepage
          </label>
          <select
            value={filterHomepage}
            onChange={(e) => setFilterHomepage(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
          >
            <option value="all">All Members</option>
            <option value="homepage">On Homepage</option>
            <option value="notHomepage">Not on Homepage</option>
          </select>
        </div>
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-light">Loading team members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-light border border-gray-200 bg-white rounded-lg p-12">
          {members.length === 0 ? (
            <div>
              <p className="text-lg font-light mb-2">No team members yet</p>
              <p className="text-sm text-gray-400">Click Add Team Member to get started.</p>
            </div>
          ) : (
            "No matches found"
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-lg shadow-sm border ${
                member.isActive ? "border-gray-200" : "border-red-200 opacity-60"
              } overflow-hidden hover:shadow-md transition-shadow`}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-contain p-2 bg-gray-50"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={handleImageError}
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-4xl text-gray-300">👤</span>
                  </div>
                )}
                {member.showOnHomepage && (
                  <div className="absolute top-2 left-2 bg-gold-500 text-black text-xs px-2 py-1 rounded font-light tracking-wider uppercase z-10">
                    🏠 Homepage
                  </div>
                )}
                {!member.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-light tracking-wider uppercase z-10">
                    Inactive
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-light text-gray-900 text-sm truncate">{member.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gold-500">{member.role}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    member.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {member.quote && (
                  <p className="text-sm text-gray-500 font-light mt-1 line-clamp-2 italic">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                )}
                <p className="text-xs text-gray-400 font-light mt-2">
                  Order: {member.order}
                </p>

                {/* Homepage Toggle */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={member.showOnHomepage}
                    onChange={() => toggleHomepage(member.id, member.showOnHomepage)}
                    className="w-4 h-4 accent-gold-500 cursor-pointer"
                  />
                  <label className="text-xs text-gray-600 font-light cursor-pointer">
                    Show on Homepage
                  </label>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/content/team/${member.id}/edit`}
                    className="flex-1 text-center text-sm bg-gold-500 text-black px-3 py-1.5 hover:bg-gold-400 transition-colors rounded"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => toggleStatus(member.id, member.isActive)}
                    className={`flex-1 text-sm px-3 py-1.5 rounded transition-colors ${
                      member.isActive
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {member.isActive ? "🔴 Deactivate" : "🟢 Activate"}
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-1.5 hover:bg-red-200 transition-colors rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}