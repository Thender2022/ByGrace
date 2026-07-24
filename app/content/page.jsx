import Link from 'next/link';
import Image from 'next/image';

// Temporary static content data (we'll connect to database later)
const contentItems = [
  {
    id: 1,
    title: 'How to Choose Your First Skateboard',
    excerpt: 'A complete guide for beginners on picking the right skateboard setup.',
    category: 'Guide',
    date: 'July 20, 2026',
    image: '/images/content/skate-guide.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: '5 Essential Skateboarding Tricks for Beginners',
    excerpt: 'Master these fundamental tricks to progress your skateboarding skills.',
    category: 'Tutorial',
    date: 'July 15, 2026',
    image: '/images/content/skate-tricks.jpg',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Behind the Scenes: Our Latest Collection',
    excerpt: 'Get an exclusive look at how we design and produce our premium skate gear.',
    category: 'Behind the Scenes',
    date: 'July 10, 2026',
    image: '/images/content/collection-bts.jpg',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Skateboarding Through the Decades',
    excerpt: 'A look at how skateboarding culture has evolved from the 1970s to today.',
    category: 'Culture',
    date: 'July 5, 2026',
    image: '/images/content/skate-history.jpg',
    readTime: '6 min read',
  },
];

export default function ContentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Diamonds */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        <span className="text-gold-500 text-2xl">✦</span>
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Content
        </h1>
        <span className="text-gold-500 text-2xl">✦</span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contentItems.map((item) => (
          <Link key={item.id} href={`/content/${item.id}`}>
            <div className="group cursor-pointer border border-gray-200 hover:border-gold-500 transition-all duration-300 bg-white overflow-hidden">
              {/* Image */}
              <div className="relative h-56 w-full bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  <span>📹</span>
                </div>
              </div>
              
              {/* Content Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gold-500 font-light tracking-[0.15em] uppercase">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 font-light">•</span>
                  <span className="text-xs text-gray-400 font-light">
                    {item.readTime}
                  </span>
                </div>
                
                <h3 className="text-lg font-light text-gray-900 group-hover:text-gold-500 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-500 font-light text-sm mt-2">
                  {item.excerpt}
                </p>
                
                <p className="text-xs text-gray-400 font-light mt-3">
                  {item.date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State - No content yet (for when database is empty) */}
      {contentItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 text-gold-500">✦</div>
          <p className="text-gray-900 text-lg font-light">No content yet</p>
          <p className="text-gray-500 text-sm mt-2 font-light">Check back soon for new posts</p>
        </div>
      )}
    </div>
  );
}