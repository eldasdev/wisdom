'use client';

import { useState } from 'react';
import { SerializableContent } from '@/lib/types';
import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { CitationSection } from '../CitationSection';

interface CollectionViewProps {
  content: SerializableContent;
  relatedContent?: any[];
}

export function CollectionView({ content, relatedContent = [] }: CollectionViewProps) {
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'type' | 'date'>('order');
  const [filterType, setFilterType] = useState<string>('all');

  const getAuthorsText = () => {
    if (!content.authors || !Array.isArray(content.authors) || content.authors.length === 0) return 'Anonymous';
    if (content.authors.length === 1) return content.authors[0].name || 'Anonymous';
    return content.authors.map(author => author.name || 'Anonymous').join(', ');
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'case-study': return 'bg-green-100 text-green-800';
      case 'book': return 'bg-purple-100 text-purple-800';
      case 'book-chapter': return 'bg-orange-100 text-orange-800';
      case 'teaching-note': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Article';
      case 'case-study': return 'Case Study';
      case 'book': return 'Book';
      case 'book-chapter': return 'Book Chapter';
      case 'teaching-note': return 'Teaching Note';
      default: return type;
    }
  };

  // Sort and filter items
  const sortedAndFilteredItems = (content.items || [])
    .filter(item => filterType === 'all' || item.contentType === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.contentId.localeCompare(b.contentId);
        case 'type':
          return a.contentType.localeCompare(b.contentType);
        case 'date':
          return new Date(b.contentId).getTime() - new Date(a.contentId).getTime();
        case 'order':
        default:
          return a.order - b.order;
      }
    });

  const getContentUrl = (type: string, slug: string) => {
    const typeMap: Record<string, string> = {
      'ARTICLE': 'articles',
      'CASE_STUDY': 'case-studies',
      'BOOK': 'books',
      'BOOK_CHAPTER': 'books',
      'TEACHING_NOTE': 'teaching-notes',
      'COLLECTION': 'collections'
    };

    const urlPath = typeMap[type] || 'articles';
    return `/${urlPath}/${slug}`;
  };

  const typeCounts = (content.items || []).reduce((acc, item) => {
    acc[item.contentType] = (acc[item.contentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Collection Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  Collection
                </span>
                {content.featured && (
                  <span className="inline-block px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6 max-w-3xl">
                {content.description}
              </p>

              {/* Collection Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{(content.items || []).length}</div>
                  <div className="text-sm text-gray-600">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{Object.keys(typeCounts).length}</div>
                  <div className="text-sm text-gray-600">Content Types</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{content.citationCount || 0}</div>
                  <div className="text-sm text-gray-600">Citations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {formatDate(content.publishedAt)}
                  </div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
              </div>

              {/* Curator Info */}
              {content.curator && (
                <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {content.curator.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-indigo-900">Curated by {content.curator.name}</div>
                    <div className="text-sm text-indigo-700">
                      {content.curator.title && `${content.curator.title} at `}
                      {content.curator.institution || 'Academic Institution'}
                    </div>
                  </div>
                </div>
              )}

              {/* Theme */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Collection Theme</h3>
                <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium">
                  {content.theme}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:w-80">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    <BookOpenIcon className="w-5 h-5 mr-2 inline" />
                    Read Collection
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    📥 Download All
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    🔗 Share Collection
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    ⭐ Add to Favorites
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Types ({(content.items || []).length})</option>
                  {Object.entries(typeCounts).map(([type, count]) => (
                    <option key={type} value={type}>
                      {getTypeLabel(type)} ({count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="order">Collection Order</option>
                  <option value="title">Title</option>
                  <option value="type">Content Type</option>
                  <option value="date">Publication Date</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {sortedAndFilteredItems.length} of {(content.items || []).length} items
            </div>
          </div>
        </div>

        {/* Collection Items */}
        <div className="space-y-6">
          {sortedAndFilteredItems.map((item, index) => (
            <article
              key={`${item.contentId}-${item.contentType}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTypeColor(item.contentType)}`}>
                      {getTypeLabel(item.contentType)}
                    </span>
                    <span className="text-sm text-gray-500">Item {index + 1}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {/* This would need actual content data - for now showing placeholder */}
                    {item.contentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Content Item
                  </h3>

                  {item.notes && (
                    <p className="text-gray-600 mb-3">{item.notes}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {getAuthorsText()}</span>
                    <span>•</span>
                    <span>{formatDate(content.publishedAt)}</span>
                  </div>
                </div>

                <div className="ml-6 flex flex-col items-end space-y-3">
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm font-medium"
                    title="Collections not yet fully implemented"
                  >
                    Coming Soon
                  </button>

                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
                    📥 Download
                  </button>
                </div>
              </div>
            </article>
          ))}

          {sortedAndFilteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
              <p className="text-gray-600">
                {filterType === 'all'
                  ? 'This collection appears to be empty.'
                  : `No ${getTypeLabel(filterType).toLowerCase()} items found in this collection.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Collection Footer */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Collection</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              This curated collection brings together diverse perspectives and insights on <strong>{content.theme}</strong>.
              Each piece has been carefully selected to provide comprehensive coverage of the topic from multiple angles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Curated Selection</h4>
                <p className="text-gray-600 text-sm">Carefully chosen content from leading experts and institutions</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Diverse Perspectives</h4>
                <p className="text-gray-600 text-sm">Multiple viewpoints and approaches to enrich understanding</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Educational Value</h4>
                <p className="text-gray-600 text-sm">Designed to support learning and academic exploration</p>
              </div>
            </div>

            {/* Citation Information */}
            {(content.doi || content.citationCount !== undefined) && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Collection Citation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.doi && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">DOI:</span>
                      <a
                        href={`https://doi.org/${content.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 font-mono text-sm"
                      >
                        {content.doi}
                      </a>
                    </div>
                  )}
                  {content.citationCount !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Collection Citations:</span>
                      <span className="ml-2 text-gray-900 font-medium">{content.citationCount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cite This Content Section */}
        <div className="mb-8">
          <CitationSection
            title={content.title}
            authors={content.authors || []}
            publishedAt={content.publishedAt}
            doi={content.doi}
            contentType={content.type}
          />
        </div>

        {/* Related Collections */}
        {relatedContent && relatedContent.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.slice(0, 6).map((related: any) => (
                <Link
                  key={related.id}
                  href={`/collections/${related.slug}`}
                  className="group"
                >
                  <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded">
                        Collection
                      </span>
                      <span className="text-sm text-gray-500">{related.items?.length || 0} items</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {related.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {related.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {related.authors?.[0]?.name || 'Anonymous'}</span>
                      <span>{formatDate(related.publishedAt)}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}