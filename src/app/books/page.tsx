import { Metadata } from 'next';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentDataLayer } from '@/lib/data';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Books | Wisdom',
  description: 'Academic and professional books on business, technology, and research methodology.',
};

export default async function BooksPage() {
  const books = await ContentDataLayer.getByType('book');

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <BookOpenIcon className="w-4 h-4 text-pink-300 mr-2" />
              <span className="text-sm font-medium text-white/90">Academic Publications</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Academic Books
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed px-4">
              Comprehensive books covering business strategy, research methodology, technology implementation, and academic excellence.
            </p>
            
            {/* Search bar */}
            <div className="mt-8 max-w-xl mx-auto px-4">
              <Link 
                href="/search?type=book"
                className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/60 hover:bg-white/20 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                <span className="text-sm sm:text-base">Search books...</span>
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
              <BookOpenIcon className="w-5 h-5 mr-2 text-purple-500" />
              <span className="font-semibold text-gray-900">{books.length}</span>
              <span className="ml-1">Books Available</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-500" />
              <span>Peer Reviewed</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
              <span>Expert Authors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Books
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore our collection of peer-reviewed books written by leading academics and industry experts.
            </p>
          </div>

          {/* Books Grid */}
          {books.length > 0 ? (
            <ContentGrid content={books} columns={3} />
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Books Available</h3>
              <p className="text-gray-600 max-w-md mx-auto px-4">
                Books are currently being prepared for publication. Check back soon!
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 sm:mt-16">
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4 sm:mb-6">
                  <PencilSquareIcon className="w-4 h-4 text-white mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-white">Submit Your Work</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Interested in Publishing a Book?
                </h3>
                <p className="text-purple-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
                  We welcome book proposals from established academics and industry experts. Our rigorous peer-review process ensures the highest quality publications.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link
                    href="/auth/signin?redirect=/dashboard/create"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold rounded-xl text-purple-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Submit Book Proposal
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold rounded-xl text-white border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                  >
                    Learn About Publishing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
