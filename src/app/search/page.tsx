'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { ContentType } from '@/lib/types';

const contentTypes: { value: ContentType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Content' },
  { value: 'article', label: 'Articles' },
  { value: 'case-study', label: 'Case Studies' },
  { value: 'book', label: 'Books' },
  { value: 'book-chapter', label: 'Book Chapters' },
  { value: 'teaching-note', label: 'Teaching Notes' },
  { value: 'collection', label: 'Collections' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>(searchParams.get('type') as ContentType || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || []);
  const [showFilters, setShowFilters] = useState(false);

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await fetch('/api/filters');
      return response.json();
    },
  });

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query, selectedType, selectedTags],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedType !== 'all') params.set('type', selectedType);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));

      const response = await fetch(`/api/search?${params}`);
      return response.json();
    },
    enabled: query.trim().length > 0 || selectedType !== 'all' || selectedTags.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));

    router.push(`/search?${params}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedTags([]);
    router.push('/search');
  };

  const hasActiveFilters = query.trim() || selectedType !== 'all' || selectedTags.length > 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
            <p className="text-lg text-gray-600 mb-8">
              Find articles, case studies, books, and more from our collection
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for content..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Content Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ContentType | 'all')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {contentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {searchResults ? `${searchResults.total} results found` : 'Enter search terms to find content'}
            </div>
          </div>

          {/* Tag Filters */}
          {showFilters && filters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                {filters.tags.slice(0, 20).map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={9} />
          ) : searchResults && searchResults.items.length > 0 ? (
            <>
              <ContentGrid content={searchResults.items} columns={3} />
            </>
          ) : hasActiveFilters ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
              <p className="text-gray-600 mb-6">
                No content matches your search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h2>
              <p className="text-gray-600">
                Enter keywords, select content types, or choose tags to find relevant content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}