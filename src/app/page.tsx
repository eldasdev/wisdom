'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ContentDataLayer } from '@/lib/data';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';

const contentTypes = [
  {
    type: 'articles' as const,
    title: 'Articles',
    description: 'In-depth analysis and insights from leading scholars and practitioners',
    icon: '📄',
  },
  {
    type: 'case-studies' as const,
    title: 'Case Studies',
    description: 'Real-world business challenges and strategic solutions',
    icon: '📊',
  },
  {
    type: 'books' as const,
    title: 'Books & Chapters',
    description: 'Comprehensive works and specialized chapters on business topics',
    icon: '📚',
  },
  {
    type: 'collections' as const,
    title: 'Collections',
    description: 'Curated selections of related content for focused learning',
    icon: '📂',
  },
];

export default function Home() {
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: () => ContentDataLayer.getFeatured(),
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-content'],
    queryFn: () => ContentDataLayer.getRecent(6),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => ContentDataLayer.getStats(),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Wisdom
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional academic and business publishing platform featuring articles, case studies, books, and curated collections from leading scholars and practitioners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors focus-ring"
              >
                Explore Content
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors focus-ring"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.byType.article || 0}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.byType['case-study'] || 0}</div>
                <div className="text-sm text-gray-600">Case Studies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.authors}</div>
                <div className="text-sm text-gray-600">Authors</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Content</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most highly regarded articles, case studies, and research from leading scholars and practitioners.
            </p>
          </div>

          {featuredLoading ? (
            <ContentSkeleton count={3} />
          ) : featuredContent && featuredContent.length > 0 ? (
            <ContentGrid content={featuredContent.slice(0, 6)} columns={3} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured content available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Content Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Content Type</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the right content for your learning objectives, from detailed case studies to comprehensive research articles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentTypes.map((contentType) => (
              <Link
                key={contentType.type}
                href={`/${contentType.type}`}
                className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{contentType.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {contentType.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {contentType.description}
                  </p>
                  <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Browse {contentType.title} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recently Published</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay current with the latest insights and research from our community of scholars and practitioners.
            </p>
          </div>

          {recentLoading ? (
            <ContentSkeleton count={6} />
          ) : recentContent && recentContent.length > 0 ? (
            <ContentGrid content={recentContent} columns={3} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recent content available.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors focus-ring"
            >
              View All Content
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Access premium business education content and connect with leading scholars and practitioners worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/authors"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors focus-ring"
            >
              Become an Author
            </Link>
            <Link
              href="/institutions"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors focus-ring"
            >
              Institutional Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
