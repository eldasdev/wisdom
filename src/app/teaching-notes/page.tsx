'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

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
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-900 via-sky-800 to-blue-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <ClipboardDocumentListIcon className="w-4 h-4 text-cyan-300 mr-2" />
              <span className="text-sm font-medium text-white/90">Instructor Resources</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Teaching Notes
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed px-4">
              Instructor-focused materials that support classroom discussion, case teaching, and experiential learning.
            </p>
            
            {/* Search bar */}
            <div className="mt-8 max-w-xl mx-auto px-4">
              <Link 
                href="/search?type=teaching-note"
                className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/60 hover:bg-white/20 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                <span className="text-sm sm:text-base">Search teaching notes...</span>
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
              <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-cyan-500" />
              <span className="font-semibold text-gray-900">{data?.total || 0}</span>
              <span className="ml-1">Teaching Notes</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2 text-cyan-500" />
              <span>For Instructors</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center">
              <PresentationChartLineIcon className="w-5 h-5 mr-2 text-cyan-500" />
              <span>Classroom Ready</span>
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
                <ClipboardDocumentListIcon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Error Loading Teaching Notes</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                There was a problem loading the teaching notes. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-200 shadow-lg shadow-cyan-600/25"
              >
                Try Again
              </button>
            </div>
          ) : data && data.items.length > 0 ? (
            <ContentGrid content={data.items} columns={3} />
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-100 flex items-center justify-center">
                <ClipboardDocumentListIcon className="w-8 h-8 text-cyan-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No Teaching Notes Yet</h2>
              <p className="text-gray-600 max-w-md mx-auto px-4">
                Teaching notes are currently being prepared. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 mb-4">
              <LightBulbIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">What You Get</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Comprehensive Teaching Support
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-cyan-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <PresentationChartLineIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Discussion Guides</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Structured questions and discussion points to facilitate engaging classroom conversations.
              </p>
            </div>
            
            <div className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-cyan-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Role-Play Scenarios</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Ready-to-use role-play exercises that bring case studies to life in the classroom.
              </p>
            </div>
            
            <div className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-cyan-200 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Assessment Tools</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Rubrics, sample answers, and evaluation frameworks for student assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Share Your Teaching Materials
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Contribute teaching notes and classroom materials to help other instructors bring these cases to life.
          </p>
          <Link
            href="/auth/signin?redirect=/dashboard/create"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl text-cyan-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
            Upload Teaching Note
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
