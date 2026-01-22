'use client';

import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { 
  LightBulbIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function PhilosophyPage() {
  const { data: content, isLoading } = useQuery({
    queryKey: ['topic', 'philosophy'],
    queryFn: async () => {
      const response = await fetch('/api/content?type=article');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      // Filter by philosophy-related tags
      return data.filter((item: any) => 
        item.tags?.some((tag: string) => 
          tag.toLowerCase().includes('philosophy') || 
          tag.toLowerCase().includes('ethics') ||
          tag.toLowerCase().includes('logic') ||
          tag.toLowerCase().includes('metaphysics')
        )
      );
    },
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <LightBulbIcon className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">Major Topic</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Philosophy
            </h1>
            <p className="text-xl text-slate-100 max-w-3xl mx-auto">
              Explore philosophical inquiry, ethics, logic, metaphysics, and the fundamental questions of existence
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Topic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <SparklesIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Research Areas</h3>
                <p className="text-sm text-gray-600">Ethics, Logic, Metaphysics, Epistemology</p>
              </div>
              <div className="text-center">
                <BookOpenIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Classical & Modern</h3>
                <p className="text-sm text-gray-600">Historical and contemporary philosophy</p>
              </div>
              <div className="text-center">
                <AcademicCapIcon className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Critical Thinking</h3>
                <p className="text-sm text-gray-600">Analytical and continental traditions</p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Philosophy Content</h2>
            {isLoading ? (
              <ContentSkeleton count={6} />
            ) : content && content.length > 0 ? (
              <ContentGrid content={content} columns={3} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <LightBulbIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Available</h3>
                <p className="text-gray-600">
                  Check back soon for philosophy-related publications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
