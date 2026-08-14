// app/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  quote: string | null;
  image: string;
  order: number;
  isActive: boolean;
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/team');
        const data = await res.json();
        
        if (res.ok) {
          const activeMembers = data.teamMembers?.filter((m: TeamMember) => m.isActive === true) || [];
          setMembers(activeMembers);
          if (activeMembers.length > 0) {
            setSelectedMember(activeMembers[0]);
          }
        } else {
          setError(data.error || 'Failed to load team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Error loading team members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 font-light tracking-wider">Loading team...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-[0.2em] text-black mb-4">The Team</h1>
          <p className="text-gray-400 font-light">No team members yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title - matching other pages */}
        <h1 className="text-3xl sm:text-4xl font-light tracking-[0.2em] text-center text-black mb-12">
          The Team
        </h1>

        {/* Main Featured Member */}
        {selectedMember && (
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row">
                {/* Image - Left side on desktop */}
                <div className="md:w-1/2 relative h-[400px] md:h-[500px] bg-gray-100">
                  <Image
                    src={selectedMember.image || '/team/placeholder.jpg'}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                {/* Info - Right side on desktop */}
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-light text-black mb-2">
                    {selectedMember.name}
                  </h2>
                  <p className="text-sm text-gold-500 font-light tracking-[0.15em] mb-4">
                    {selectedMember.role}
                  </p>
                  {selectedMember.quote && (
                    <div className="mt-2">
                      <p className="text-gray-600 font-light italic leading-relaxed">
                        &ldquo;{selectedMember.quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Grid - Clickable boxes in rows of 4 */}
        <div>
          <h3 className="text-sm font-light tracking-[0.2em] text-gray-400 text-center mb-6">
            Meet the Team
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`group bg-white rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                  selectedMember?.id === member.id
                    ? 'border-gold-500 shadow-md'
                    : 'border-gray-200 hover:border-gold-300'
                }`}
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={member.image || '/team/placeholder.jpg'}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  {selectedMember?.id === member.id && (
                    <div className="absolute top-2 right-2 bg-gold-500 text-white text-xs px-2 py-1 rounded font-light tracking-wider">
                      Selected
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-sm font-light text-black truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-light truncate">
                    {member.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}