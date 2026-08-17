import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function UpdatesPage() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'Published',
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
    },
  });

  // Get the first (most recent) post as the featured one
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-light tracking-[0.2em] uppercase text-gray-900">
            Updates
          </h1>
          <p className="text-gray-500 font-light tracking-wider mt-2 text-sm">
            Latest news, events, and stories from the ByGrace community
          </p>
          <div className="w-12 h-px bg-gold-500 mx-auto mt-4" />
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-light">
            No updates available yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Post - 2/3 width */}
            {featuredPost && (
              <div className="flex justify-center">
                <div className="w-full lg:w-2/3">
                  <Link
                    href={`/updates/${featuredPost.slug}`}
                    className="group bg-white border border-gray-200 hover:border-gold-500 hover:shadow-lg transition-all duration-300 overflow-hidden block"
                  >
                    <div className="p-6 sm:p-8">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-3">
                        {featuredPost.category && (
                          <span className="text-sm text-gold-500 font-light tracking-wider uppercase">
                            {featuredPost.category.name}
                          </span>
                        )}
                        <span className="text-sm text-gray-400 font-light">
                          {format(new Date(featuredPost.createdAt), 'MMMM d, yyyy')}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 group-hover:text-gold-500 transition-colors">
                        {featuredPost.title}
                      </h2>

                      {/* Full Content - limited height with scroll */}
                      <div className="mt-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <div className="text-gray-600 font-light text-sm leading-relaxed whitespace-pre-wrap space-y-3">
                          {featuredPost.content.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-3">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      {featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {featuredPost.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {featuredPost.tags.length > 5 && (
                            <span className="text-[10px] text-gray-400">
                              +{featuredPost.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400 group-hover:text-gold-500 transition-colors font-light tracking-wider uppercase">
                          Read Full Post →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Remaining Posts - Square Grid like Team page */}
            {remainingPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-light tracking-[0.15em] uppercase text-gray-700 mb-6 text-center">
                  More Updates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {remainingPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/updates/${post.slug}`}
                      className="group bg-white border border-gray-200 hover:border-gold-500 hover:shadow-lg transition-all duration-300 overflow-hidden aspect-square flex flex-col"
                    >
                      <div className="p-4 flex-1 flex flex-col">
                        {/* Category & Date */}
                        <div className="flex items-center justify-between mb-2">
                          {post.category && (
                            <span className="text-xs text-gold-500 font-light tracking-wider uppercase">
                              {post.category.name}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 font-light">
                            {format(new Date(post.createdAt), 'MMM d')}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-light tracking-wide text-gray-900 group-hover:text-gold-500 transition-colors line-clamp-2 flex-1">
                          {post.title}
                        </h3>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-[9px] text-gray-400">
                                +{post.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Read More */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <span className="text-[10px] text-gray-400 group-hover:text-gold-500 transition-colors font-light tracking-wider uppercase">
                            Read →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}