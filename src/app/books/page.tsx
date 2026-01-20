import { Metadata } from 'next';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentDataLayer } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Books | Wisdom',
  description: 'Academic and professional books on business, technology, and research methodology.',
};

export default async function BooksPage() {
  const books = await ContentDataLayer.getByType('book');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Academic Books
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Comprehensive books covering business strategy, research methodology, technology implementation, and academic excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of peer-reviewed books written by leading academics and industry experts.
            </p>
          </div>

          {/* Books Grid */}
          {books.length > 0 ? (
            <ContentGrid content={books} columns={3} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Available</h3>
              <p className="text-gray-600">Books are currently being prepared for publication.</p>
            </div>
          )}

          {/* Call to Action */}
          {books.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Interested in Publishing a Book?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  We welcome book proposals from established academics and industry experts. Our rigorous peer-review process ensures the highest quality publications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/auth/signin?redirect=/dashboard/create"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Submit Book Proposal
                  </Link>
                  <Link
                    href="/about/publishing"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Learn About Publishing
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}