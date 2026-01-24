'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalContent: number;
  totalViews: number;
  publishedContent: number;
  draftContent: number;
  contentByType: { type: string; count: number }[];
  contentByStatus: { status: string; count: number }[];
  topContent: {
    id: string;
    title: string;
    slug: string;
    type: string;
    viewCount: number;
  }[];
  recentActivity: {
    id: string;
    title: string;
    type: string;
    action: string;
    date: string;
  }[];
  monthlyStats: {
    month: string;
    published: number;
    views: number;
  }[];
}

export default function DashboardAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/analytics?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ARTICLE': 'bg-blue-100 text-blue-800',
      'CASE_STUDY': 'bg-purple-100 text-purple-800',
      'BOOK': 'bg-green-100 text-green-800',
      'BOOK_CHAPTER': 'bg-teal-100 text-teal-800',
      'TEACHING_NOTE': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PUBLISHED': 'bg-green-100 text-green-800',
      'DRAFT': 'bg-yellow-100 text-yellow-800',
      'REVIEW': 'bg-blue-100 text-blue-800',
      'ARCHIVED': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your content performance</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: 'all', label: 'All Time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as typeof timeRange)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === option.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Content</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(analytics?.totalContent || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(analytics?.totalViews || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(analytics?.publishedContent || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(analytics?.draftContent || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content by Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Type</h3>
          <div className="space-y-3">
            {analytics?.contentByType?.map((item) => {
              const total = analytics.totalContent || 1;
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${getTypeColor(item.type)}`}>
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!analytics?.contentByType || analytics.contentByType.length === 0) && (
              <p className="text-gray-500 text-center py-8">No content yet</p>
            )}
          </div>
        </div>

        {/* Content by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Status</h3>
          <div className="space-y-3">
            {analytics?.contentByStatus?.map((item) => {
              const total = analytics.totalContent || 1;
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.status === 'PUBLISHED' ? 'bg-green-500' :
                        item.status === 'DRAFT' ? 'bg-yellow-500' :
                        item.status === 'REVIEW' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!analytics?.contentByStatus || analytics.contentByStatus.length === 0) && (
              <p className="text-gray-500 text-center py-8">No content yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
        {analytics?.topContent && analytics.topContent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topContent.map((content, index) => (
                  <tr key={content.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <a
                          href={`/dashboard/content/${content.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {content.title}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getTypeColor(content.type)}`}>
                        {content.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                        <EyeIcon className="w-4 h-4" />
                        {formatNumber(content.viewCount)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No content performance data yet</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.action === 'published' ? 'bg-green-100' :
                  activity.action === 'created' ? 'bg-blue-100' :
                  activity.action === 'updated' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <DocumentTextIcon className={`w-5 h-5 ${
                    activity.action === 'published' ? 'text-green-600' :
                    activity.action === 'created' ? 'text-blue-600' :
                    activity.action === 'updated' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} • {activity.type.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
