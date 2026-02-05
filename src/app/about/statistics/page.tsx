'use client';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { useQuery } from '@tanstack/react-query';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  TagIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface StatisticsData {
  totalPublications: number;
  activeAuthors: number;
  totalAuthors: number;
  totalViews: number;
  researchTopics: number;
  institutions: number;
  thisMonth: number;
  editorialBoard: number;
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function StatisticsPage() {
  const { data, isLoading, error } = useQuery<StatisticsData>({
    queryKey: ['public-statistics'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      return response.json();
    },
  });

  const stats = data ? [
    {
      icon: DocumentTextIcon,
      label: 'Total Publications',
      value: formatNumber(data.totalPublications),
      rawValue: data.totalPublications,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: UsersIcon,
      label: 'Active Authors',
      value: formatNumber(data.activeAuthors),
      rawValue: data.activeAuthors,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: EyeIcon,
      label: 'Total Views',
      value: formatNumber(data.totalViews),
      rawValue: data.totalViews,
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: TagIcon,
      label: 'Research Topics',
      value: formatNumber(data.researchTopics),
      rawValue: data.researchTopics,
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: AcademicCapIcon,
      label: 'Institutions',
      value: formatNumber(data.institutions),
      rawValue: data.institutions,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: CalendarIcon,
      label: 'This Month',
      value: formatNumber(data.thisMonth),
      rawValue: data.thisMonth,
      color: 'from-pink-500 to-rose-600'
    },
  ] : [];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <ChartBarIcon className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">Open Statistics</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Open Statistics Data
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              For New Comers - Transparent insights into our publishing platform&apos;s growth and impact
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12 text-center">
              <p className="text-red-600">Failed to load statistics. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.rawValue !== undefined && stat.rawValue > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Exact: {stat.rawValue.toLocaleString()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Information Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Open Statistics?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                  <p className="text-gray-600 text-sm">
                    We believe in open access to data. All statistics are publicly available to help researchers and authors make informed decisions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For New Comers</h3>
                  <p className="text-gray-600 text-sm">
                    New authors and researchers can explore our platform&apos;s activity and understand the community before submitting their work.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                  <p className="text-gray-600 text-sm">
                    Statistics are updated in real-time, providing the most current view of our platform&apos;s growth and engagement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TagIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Research Insights</h3>
                  <p className="text-gray-600 text-sm">
                    Discover trending topics, popular research areas, and emerging fields within our publishing ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to Join Our Platform?</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Become part of our growing community of researchers and authors. Start publishing your work today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg"
              >
                Get Started
              </a>
              <a
                href="/about/publishing"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/30"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
