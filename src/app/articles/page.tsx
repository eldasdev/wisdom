'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  DocumentTextIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

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
  const [showFilters, setShowFilters] = useState(false);

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
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <DocumentTextIcon className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-sm font-medium text-white/90">Research & Analysis</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Articles
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              In-depth analysis and insights from leading scholars and practitioners on business strategy, innovation, leadership, and more.
            </p>
            
            {/* Search bar */}
            <div className="mt-8 max-w-xl mx-auto px-4">
              <Link 
                href="/search?type=article"
                className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/60 hover:bg-white/20 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                <span className="text-sm sm:text-base">Search articles...</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Mobile filter toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium"
              >
                <FunnelIcon className="w-4 h-4" />
                Filters
                {selectedCategory !== 'All Categories' && (
                  <span className="ml-1 px-2 py-0.5 bg-[#0C2C55] text-white text-xs rounded-full">1</span>
                )}
              </button>
              <span className="text-sm text-gray-500">
                {data ? `${data.total} articles` : 'Loading...'}
              </span>
            </div>

            {/* Filter pills - desktop always visible, mobile toggle */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-[#0C2C55] text-white shadow-lg shadow-[#0C2C55]/25'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:block text-sm text-gray-500 font-medium">
                  {data ? `${data.total} articles found` : 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={9} />
          ) : error ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Error Loading Articles</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                There was a problem loading the articles. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-[#0C2C55] hover:bg-[#0C2C55]/90 transition-all duration-200 shadow-lg shadow-[#0C2C55]/25"
              >
                Try Again
              </button>
            </div>
          ) : data && data.items.length > 0 ? (
            <ContentGrid content={data.items} columns={3} />
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No Articles Found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                {selectedCategory === 'All Categories'
                  ? 'No articles are available at this time.'
                  : `No articles found in the "${selectedCategory}" category.`
                }
              </p>
              {selectedCategory !== 'All Categories' && (
                <button
                  onClick={() => setSelectedCategory('All Categories')}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  View All Articles
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <SparklesIcon className="w-4 h-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">Share Your Knowledge</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Want to Contribute?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Share your insights and expertise with our global community of business professionals and academics.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl text-emerald-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <PencilSquareIcon className="w-5 h-5 mr-2" />
            Become an Author
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
