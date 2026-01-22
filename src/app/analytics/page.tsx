'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout/PublicLayout';
import Link from 'next/link';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CalendarIcon,
  GlobeAltIcon,
  FireIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalContent: number;
    totalUsers: number;
    totalTags: number;
    totalViews: number;
  };
  contentByType: {
    ARTICLE: number;
    CASE_STUDY: number;
    BOOK: number;
    TEACHING_NOTE: number;
    COLLECTION: number;
  };
  contentByStatus: {
    DRAFT: number;
    REVIEW: number;
    PUBLISHED: number;
    ARCHIVED: number;
  };
  userRoles: {
    ADMIN: number;
    AUTHOR: number;
    REVIEWER: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
    publishedAt: string;
  }>;
  topTags: Array<{
    name: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    articles: number;
    caseStudies: number;
    books: number;
    total: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'content_created' | 'content_published' | 'user_registered';
    description: string;
    timestamp: string;
  }>;
}

const contentTypeLabels = {
  ARTICLE: 'Articles',
  CASE_STUDY: 'Case Studies',
  BOOK: 'Books',
  TEACHING_NOTE: 'Teaching Notes',
  COLLECTION: 'Collections',
};

const statusLabels = {
  DRAFT: 'Drafts',
  REVIEW: 'In Review',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

const roleLabels = {
  ADMIN: 'Administrators',
  AUTHOR: 'Authors',
  REVIEWER: 'Reviewers',
};

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json() as Promise<AnalyticsData>;
    },
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
              <ChartBarIcon className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-600 font-medium">Loading analytics...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !analytics) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <ChartBarIcon className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Unavailable</h1>
            <p className="text-gray-600">Unable to load analytics data. Please try again later.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const totalContent = analytics.overview.totalContent;
  const totalViews = analytics.overview.totalViews;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <SparklesIcon className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-medium text-white">Platform Insights</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-indigo-100 max-w-2xl">
                Comprehensive insights into your platform's performance and content engagement
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value as typeof timeRange)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    timeRange === option.value
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Content</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalContent.toLocaleString()}</p>
            </div>

            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalUsers.toLocaleString()}</p>
            </div>

            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TagIcon className="w-6 h-6 text-white" />
                </div>
                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Tags</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalTags.toLocaleString()}</p>
            </div>

            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-orange-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <EyeIcon className="w-6 h-6 text-white" />
                </div>
                <FireIcon className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalViews.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Content by Type */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Content by Type</h3>
                <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="space-y-4">
                {Object.entries(analytics.contentByType).map(([type, count]) => {
                  const percentage = totalContent > 0 ? (count / totalContent) * 100 : 0;
                  const colors = {
                    ARTICLE: 'from-blue-500 to-indigo-600',
                    CASE_STUDY: 'from-emerald-500 to-teal-600',
                    BOOK: 'from-purple-500 to-violet-600',
                    TEACHING_NOTE: 'from-cyan-500 to-blue-600',
                    COLLECTION: 'from-amber-500 to-orange-600',
                  };
                  
                  return (
                    <div key={type} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[type as keyof typeof colors]}`}></div>
                          <span className="text-sm font-medium text-gray-700">{contentTypeLabels[type as keyof typeof contentTypeLabels]}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[type as keyof typeof colors]} transition-all duration-500 group-hover:shadow-lg`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Content Status</h3>
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-4">
                {Object.entries(analytics.contentByStatus).map(([status, count]) => {
                  const percentage = totalContent > 0 ? (count / totalContent) * 100 : 0;
                  const statusConfig = {
                    PUBLISHED: { color: 'from-green-500 to-emerald-600', icon: CheckCircleIcon, label: 'Published' },
                    REVIEW: { color: 'from-amber-500 to-orange-600', icon: ClockIcon, label: 'In Review' },
                    DRAFT: { color: 'from-gray-400 to-gray-600', icon: PencilSquareIcon, label: 'Drafts' },
                    ARCHIVED: { color: 'from-red-500 to-rose-600', icon: ArchiveBoxIcon, label: 'Archived' },
                  };
                  const config = statusConfig[status as keyof typeof statusConfig];
                  const Icon = config.icon;
                  
                  return (
                    <div key={status} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color}`}></div>
                          <span className="text-sm font-medium text-gray-700">{config.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-500 group-hover:shadow-lg`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Most Viewed Content</h3>
                <FireIcon className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-4">
                {analytics.topContent.slice(0, 5).map((content, index) => (
                  <Link
                    key={content.id}
                    href={`/articles/${content.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {content.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {contentTypeLabels[content.type as keyof typeof contentTypeLabels]}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <EyeIcon className="w-3 h-3" />
                          {content.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Tags */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Popular Tags</h3>
                <TagIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-4">
                {analytics.topTags.slice(0, 5).map((tag, index) => (
                  <Link
                    key={tag.name}
                    href={`/tags/${tag.name}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                      index === 2 ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {tag.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{tag.count} pieces of content</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Publication Trends</h3>
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Case Studies
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Books
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {analytics.monthlyTrends.slice(0, 6).map((trend, index) => (
                    <tr key={trend.month} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trend.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {trend.articles}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {trend.caseStudies}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {trend.books}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                        {trend.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Roles */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">User Roles Distribution</h3>
              <UsersIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Object.entries(analytics.userRoles).map(([role, count], index) => {
                const roleColors = [
                  'from-red-500 to-rose-600',
                  'from-blue-500 to-indigo-600',
                  'from-emerald-500 to-teal-600',
                ];
                
                return (
                  <div key={role} className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 group">
                    <div className={`w-16 h-16 bg-gradient-to-br ${roleColors[index]} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <UsersIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm font-medium text-gray-600">{roleLabels[role as keyof typeof roleLabels]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
