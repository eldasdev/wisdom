'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ContentViewer } from '@/components/content/ContentViewer';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { useImpressionTracker } from '@/hooks/useImpressionTracker';

export default function BookPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Track content impressions
  useImpressionTracker({ slug, enabled: !!slug });

  const { data, isLoading, error } = useQuery({
    queryKey: ['content', slug],
    queryFn: async () => {
      const response = await fetch(`/api/content/${slug}`);
      if (!response.ok) {
        throw new Error('Content not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ContentSkeleton count={1} compact={true} />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !data) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
            <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been moved.</p>
            <Link
              href="/books"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const { content, related } = data;

  return (
    <PublicLayout>
      <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href="/books" className="text-gray-400 hover:text-gray-600 transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{content.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <ContentViewer content={content} relatedContent={related} />
      </div>

      {/* Related Content */}
      {related && related.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Books</h2>
              <p className="text-lg text-gray-600">
                Explore more books in this area of study
              </p>
            </div>
            <ContentGrid content={related} columns={3} />
          </div>
        </section>
      )}
      </div>
    </PublicLayout>
  );
}