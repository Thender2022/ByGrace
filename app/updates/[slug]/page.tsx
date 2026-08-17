import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function UpdateDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  
  const post = await prisma.post.findFirst({
    where: {
      slug: slug,
      status: 'Published',
    },
    include: {
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Get related updates (same category, exclude current)
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      id: { not: post.id },
      status: 'Published',
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/updates"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-8"
        >
          ← Back to Updates
        </Link>

        {/* Post Content */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-4">
              {post.category && (
                <span className="text-sm text-gold-500 font-light tracking-wider uppercase">
                  {post.category.name}
                </span>
              )}
              <span className="text-sm text-gray-400 font-light">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-gray-900">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="w-12 h-px bg-gold-500 my-6" />

            {/* Content */}
            <div className="prose prose-gold max-w-none font-light text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>

        {/* Related Updates */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-light tracking-[0.15em] uppercase text-gray-800 mb-6">
              Related Updates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/updates/${related.slug}`}
                  className="group bg-white border border-gray-200 hover:border-gold-500 hover:shadow-lg transition-all duration-300 p-4"
                >
                  <h4 className="font-light text-gray-900 group-hover:text-gold-500 transition-colors text-sm line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    {format(new Date(related.createdAt), 'MMM d, yyyy')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}