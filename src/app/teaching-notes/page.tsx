'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';

export default function TeachingNotesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['teaching-notes'],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('type', 'teaching-note');

      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teaching notes');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Teaching Notes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Instructor-focused materials that support classroom discussion, case teaching, and experiential learning.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Teaching Notes</h2>
              <p className="text-gray-600 mb-6">There was a problem loading the teaching notes. Please try again later.</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Teaching Notes Found</h2>
              <p className="text-gray-600 mb-6">
                Teaching notes are currently being prepared. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Teaching CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Teaching Materials</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contribute teaching notes and classroom materials to help other instructors bring these cases to life.
          </p>
          <Link
            href="/auth/signin?redirect=/dashboard/create"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Upload Teaching Note
          </Link>
        </div>
      </section>
    </div>
  );
}

