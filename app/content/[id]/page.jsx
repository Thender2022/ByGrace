import Link from 'next/link';
import Image from 'next/image';

// Temporary static data (same as above)
const contentItems = [
  {
    id: 1,
    title: 'How to Choose Your First Skateboard',
    content: '<p>Full article content goes here...</p>',
    category: 'Guide',
    date: 'July 20, 2026',
    image: '/images/content/skate-guide.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: '5 Essential Skateboarding Tricks for Beginners',
    content: '<p>Full article content goes here...</p>',
    category: 'Tutorial',
    date: 'July 15, 2026',
    image: '/images/content/skate-tricks.jpg',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Behind the Scenes: Our Latest Collection',
    content: '<p>Full article content goes here...</p>',
    category: 'Behind the Scenes',
    date: 'July 10, 2026',
    image: '/images/content/collection-bts.jpg',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'Skateboarding Through the Decades',
    content: '<p>Full article content goes here...</p>',
    category: 'Culture',
    date: 'July 5, 2026',
    image: '/images/content/skate-history.jpg',
    readTime: '6 min read',
  },
];

export default function ContentDetailPage({ params }) {
  const item = contentItems.find((c) => c.id === parseInt(params.id));

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">
          Content not found
        </h1>
        <Link href="/content" className="text-gold-500 hover:underline mt-4 inline-block">
          ← Back to content
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link href="/content" className="text-sm text-gray-500 hover:text-gold-500 transition-colors font-light">
        ← Back to content
      </Link>

      {/* Article */}
      <article className="mt-6">
        {/* Header with Diamonds */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gold-500 text-2xl">✦</span>
          <h1 className="text-3xl font-light tracking-[0.2em] text-gray-900 uppercase">
            {item.title}
          </h1>
          <span className="text-gold-500 text-2xl">✦</span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 font-light mb-8">
          <span className="text-gold-500 tracking-[0.15em] uppercase">{item.category}</span>
          <span>•</span>
          <span>{item.date}</span>
          <span>•</span>
          <span>{item.readTime}</span>
        </div>

        {/* Image Placeholder */}
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 mb-8">
          📹 Content Image
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none font-light text-gray-700"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </article>
    </div>
  );
}