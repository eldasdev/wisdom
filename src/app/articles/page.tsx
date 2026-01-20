'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';

const categories = [
  'All Categories',
  'Strategy & Execution',
  'Innovation & Technology',
  'Leadership & Teams',
  'Finance & Economics',
  'Marketing & Sales',
  'Operations & Supply Chain',
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const { data, isLoading, error } = useQuery({
    queryKey: ['articles', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('type', 'article');
      if (selectedCategory !== 'All Categories') {
        params.set('categories', selectedCategory);
      }

      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In-depth analysis and insights from leading scholars and practitioners on business strategy, innovation, leadership, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {data ? `${data.total} articles found` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={9} />
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Articles</h2>
              <p className="text-gray-600 mb-6">There was a problem loading the articles. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : data && data.items.length > 0 ? (
            <ContentGrid content={data.items} columns={3} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h2>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'All Categories'
                  ? 'No articles are available at this time.'
                  : `No articles found in the "${selectedCategory}" category.`
                }
              </p>
              {selectedCategory !== 'All Categories' && (
                <button
                  onClick={() => setSelectedCategory('All Categories')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  View All Articles
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      {data && data.total > data.items.length && (
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to Contribute?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Share your insights and expertise with our global community of business professionals and academics.
            </p>
            <Link
              href="/authors"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Become an Author
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}