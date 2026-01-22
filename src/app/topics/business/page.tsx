'use client';

import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { 
  BriefcaseIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function BusinessPage() {
  const { data: content, isLoading } = useQuery({
    queryKey: ['topic', 'business'],
    queryFn: async () => {
      const response = await fetch('/api/content?type=article');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      // Filter by business-related tags
      return data.filter((item: any) => 
        item.tags?.some((tag: string) => 
          tag.toLowerCase().includes('business') || 
          tag.toLowerCase().includes('management') ||
          tag.toLowerCase().includes('strategy') ||
          tag.toLowerCase().includes('marketing')
        )
      );
    },
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <BriefcaseIcon className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">Major Topic</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Business
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover insights on business strategy, management, entrepreneurship, and organizational behavior
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
                <ChartBarIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Research Areas</h3>
                <p className="text-sm text-gray-600">Strategy, Management, Marketing, Operations</p>
              </div>
              <div className="text-center">
                <BuildingOfficeIcon className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Case Studies</h3>
                <p className="text-sm text-gray-600">Real-world business scenarios and analysis</p>
              </div>
              <div className="text-center">
                <LightBulbIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Innovation</h3>
                <p className="text-sm text-gray-600">Entrepreneurship and business innovation</p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Content</h2>
            {isLoading ? (
              <ContentSkeleton count={6} />
            ) : content && content.length > 0 ? (
              <ContentGrid content={content} columns={3} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Available</h3>
                <p className="text-gray-600">
                  Check back soon for business-related publications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
