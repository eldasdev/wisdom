'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  TagIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  FolderIcon, 
  ArrowRightIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

interface TagWithCount {
  name: string;
  count: number;
  contentTypes: {
    ARTICLE: number;
    CASE_STUDY: number;
    BOOK: number;
    TEACHING_NOTE: number;
    COLLECTION: number;
  };
}

const contentTypeIcons = {
  ARTICLE: DocumentTextIcon,
  CASE_STUDY: ChartBarIcon,
  BOOK: BookOpenIcon,
  TEACHING_NOTE: AcademicCapIcon,
  COLLECTION: FolderIcon,
};

const contentTypeLabels = {
  ARTICLE: 'Articles',
  CASE_STUDY: 'Case Studies',
  BOOK: 'Books',
  TEACHING_NOTE: 'Teaching Notes',
  COLLECTION: 'Collections',
};

export default function TagsPage() {
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'cloud'>('grid');

  const { data: tagsData, isLoading } = useQuery({
    queryKey: ['tags-with-counts'],
    queryFn: async () => {
      const response = await fetch('/api/tags');
      return response.json();
    },
  });

  const sortedTags = tagsData?.tags?.sort((a: TagWithCount, b: TagWithCount) => {
    if (sortBy === 'count') return b.count - a.count;
    return a.name.localeCompare(b.name);
  }) || [];

  const filteredTags = filterBy === 'all'
    ? sortedTags
    : sortedTags.filter((tag: TagWithCount) => tag.contentTypes[filterBy as keyof typeof tag.contentTypes] > 0);

  const getTagSize = (count: number) => {
    if (count >= 20) return 'text-xl sm:text-2xl';
    if (count >= 10) return 'text-lg sm:text-xl';
    if (count >= 5) return 'text-base sm:text-lg';
    return 'text-sm sm:text-base';
  };

  const getTagColor = (count: number) => {
    if (count >= 20) return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
    if (count >= 10) return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
    if (count >= 5) return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
              <TagIcon className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-gray-600">Loading tags...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <TagIcon className="w-4 h-4 text-indigo-300 mr-2" />
              <span className="text-sm font-medium text-white/90">Discover Topics</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Browse by Tags
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed px-4">
              Discover content organized by topics and themes. Click on any tag to explore related articles, case studies, books, and teaching materials.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {tagsData?.totalTags || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Tags</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {tagsData?.totalContent || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Tagged Content</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {tagsData?.avgTagsPerContent?.toFixed(1) || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg per Content</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 sm:flex-none">
                <label htmlFor="sort" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'count')}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="count">Most Popular</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              <div className="flex-1 sm:flex-none">
                <label htmlFor="filter" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Filter by type
                </label>
                <select
                  id="filter"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Content</option>
                  <option value="ARTICLE">Articles</option>
                  <option value="CASE_STUDY">Case Studies</option>
                  <option value="BOOK">Books</option>
                  <option value="TEACHING_NOTE">Teaching Notes</option>
                  <option value="COLLECTION">Collections</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4">
              <span className="text-sm text-gray-500">
                {filteredTags.length} of {sortedTags.length} tags
              </span>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cloud')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'cloud' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTags.map((tag: TagWithCount) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="group"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className={`font-bold text-gray-900 group-hover:text-indigo-600 transition-colors ${getTagSize(tag.count)}`}>
                      {tag.name}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTagColor(tag.count)}`}>
                      {tag.count}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(tag.contentTypes)
                      .filter(([_, count]) => count > 0)
                      .map(([type, count]) => {
                        const IconComponent = contentTypeIcons[type as keyof typeof contentTypeIcons];
                        const label = contentTypeLabels[type as keyof typeof contentTypeLabels];
                        return (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{label}</span>
                            </div>
                            <span className="text-gray-900 font-medium">{count}</span>
                          </div>
                        );
                      })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-indigo-600 group-hover:text-indigo-700 font-medium">
                      Explore content
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Tag Cloud</h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {filteredTags.slice(0, 60).map((tag: TagWithCount) => (
                <Link
                  key={`cloud-${tag.name}`}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all hover:shadow-lg hover:scale-105 ${getTagColor(tag.count)} ${getTagSize(tag.count)}`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            {filteredTags.length > 60 && (
              <p className="text-center text-sm text-gray-500 mt-6">
                Showing top 60 tags. Switch to grid view to see all.
              </p>
            )}
          </div>
        )}

        {filteredTags.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <TagIcon className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tags found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filterBy === 'all'
                ? 'No tags are currently available.'
                : `No tags found for ${contentTypeLabels[filterBy as keyof typeof contentTypeLabels]}.`
              }
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
