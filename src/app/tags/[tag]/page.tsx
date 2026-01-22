'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, TagIcon, DocumentTextIcon, ChartBarIcon, BookOpenIcon, AcademicCapIcon, FolderIcon } from '@heroicons/react/24/outline';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';

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

export default function TagPage() {
  const params = useParams();
  const tagName = decodeURIComponent(params.tag as string);
  const [selectedType, setSelectedType] = useState<string>('all');

  const { data: tagData, isLoading: isLoadingTag } = useQuery({
    queryKey: ['tag', tagName],
    queryFn: async () => {
      const response = await fetch(`/api/tags/${encodeURIComponent(tagName)}`);
      if (!response.ok) {
        throw new Error('Tag not found');
      }
      return response.json();
    },
    enabled: !!tagName,
  });

  const { data: contentData, isLoading: isLoadingContent } = useQuery({
    queryKey: ['tag-content', tagName, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('tags', tagName);
      if (selectedType !== 'all') {
        params.set('type', selectedType);
      }
      const response = await fetch(`/api/search?${params}`);
      return response.json();
    },
    enabled: !!tagName,
  });

  if (isLoadingTag) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tag...</p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!tagData) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TagIcon className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Tag Not Found</h1>
              <p className="text-gray-600 mb-6">The tag "{tagName}" doesn't exist or has no published content.</p>
              <Link
                href="/tags"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Browse All Tags
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const filteredContent = selectedType === 'all'
    ? contentData?.items || []
    : (contentData?.items || []).filter((item: any) => item.type === selectedType);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/tags"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                All Tags
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TagIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{tagName}</h1>
                  <p className="text-gray-600">{tagData.totalContent} pieces of content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tag Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(tagData.contentTypes).map(([type, count]) => {
              if (count === 0) return null;
              const IconComponent = contentTypeIcons[type as keyof typeof contentTypeIcons];
              const label = contentTypeLabels[type as keyof typeof contentTypeLabels];
              const countValue = typeof count === 'number' ? count : 0;

              return (
                <div key={type} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{countValue}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filter by type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Content ({contentData?.total || 0})</option>
                {Object.entries(tagData.contentTypes)
                  .filter(([_, count]) => count > 0)
                  .map(([type, count]) => (
                    <option key={type} value={type}>
                      {contentTypeLabels[type as keyof typeof contentTypeLabels]} ({typeof count === 'number' ? count : 0})
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredContent.length} of {contentData?.total || 0} items
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mb-12">
          {isLoadingContent ? (
            <ContentSkeleton count={9} />
          ) : filteredContent.length > 0 ? (
            <ContentGrid content={filteredContent} columns={3} />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600">
                {selectedType === 'all'
                  ? `No published content is tagged with "${tagName}".`
                  : `No ${contentTypeLabels[selectedType as keyof typeof contentTypeLabels].toLowerCase()} are tagged with "${tagName}".`
                }
              </p>
            </div>
          )}
        </div>

        {/* Related Tags */}
        {tagData.relatedTags && tagData.relatedTags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagData.relatedTags.map((relatedTag: string) => (
                <Link
                  key={relatedTag}
                  href={`/tags/${encodeURIComponent(relatedTag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  {relatedTag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </PublicLayout>
  );
}