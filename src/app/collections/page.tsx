'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  FolderIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  RectangleStackIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function CollectionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('type', 'collection');

      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      return response.json();
    },
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <FolderIcon className="w-4 h-4 text-amber-300 mr-2" />
              <span className="text-sm font-medium text-white/90">Curated Learning</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Curated Collections
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed px-4">
              Expertly curated sets of articles, case studies, and books organized around key themes and teaching objectives.
            </p>
            
            {/* Search bar */}
            <div className="mt-8 max-w-xl mx-auto px-4">
              <Link 
                href="/search?type=collection"
                className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/60 hover:bg-white/20 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                <span className="text-sm sm:text-base">Search collections...</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <RectangleStackIcon className="w-5 h-5 mr-2 text-amber-500" />
              <span className="font-semibold text-gray-900">{data?.total || 0}</span>
              <span className="ml-1">Collections</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-amber-500" />
              <span>Expert Curated</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2 text-amber-500" />
              <span>Course Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <FolderIcon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Error Loading Collections</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                There was a problem loading the collections. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-all duration-200 shadow-lg shadow-amber-600/25"
              >
                Try Again
              </button>
            </div>
          ) : data && data.items.length > 0 ? (
            <ContentGrid content={data.items} columns={3} />
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <FolderIcon className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No Collections Yet</h2>
              <p className="text-gray-600 max-w-md mx-auto px-4">
                Curated collections are currently being prepared. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <SparklesIcon className="w-4 h-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">For Instructors</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Design a Collection
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Instructors can work with our editorial team to build custom collections tailored to their course or program.
          </p>
          <Link
            href="/auth/signin?redirect=/dashboard/create"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl text-amber-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <FolderIcon className="w-5 h-5 mr-2" />
            Start a New Collection
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
