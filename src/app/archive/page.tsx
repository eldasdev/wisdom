'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import Link from 'next/link';
import { 
  ArchiveBoxIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface ArchiveStats {
  years: Record<number, number>;
  types: { type: string; count: number }[];
  total: number;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ARTICLE: DocumentTextIcon,
  CASE_STUDY: ClipboardDocumentListIcon,
  BOOK: BookOpenIcon,
  BOOK_CHAPTER: BookOpenIcon,
  TEACHING_NOTE: AcademicCapIcon,
  COLLECTION: FolderIcon,
};

const typeLabels: Record<string, string> = {
  ARTICLE: 'Articles',
  CASE_STUDY: 'Case Studies',
  BOOK: 'Books',
  BOOK_CHAPTER: 'Book Chapters',
  TEACHING_NOTE: 'Teaching Notes',
  COLLECTION: 'Collections',
};

export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['archive', selectedYear, selectedType, searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedYear !== 'all') params.append('year', selectedYear);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      
      const response = await fetch(`/api/archive?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch archive');
      return response.json();
    },
  });

  const stats: ArchiveStats = data?.stats || { years: {}, types: [], total: 0 };
  const content = data?.content || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  // Sort years in descending order
  const sortedYears = Object.entries(stats.years)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .map(([year, count]) => ({ year: parseInt(year), count }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 mb-6">
              <ArchiveBoxIcon className="w-5 h-5 text-amber-400 mr-2" />
              <span className="text-sm font-medium text-amber-300">Content Archive</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Archive
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Access our preserved collection of historical publications, past editions, 
              and legacy content that shaped our academic discourse
            </p>
            
            {/* Archive Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-300">Archived Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">{sortedYears.length}</div>
                <div className="text-sm text-slate-300">Years of Content</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">{stats.types.length}</div>
                <div className="text-sm text-slate-300">Content Types</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              {/* Search */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Search Archive</h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                </form>
              </div>

              {/* Year Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  Browse by Year
                </h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleYearChange('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedYear === 'all'
                        ? 'bg-amber-100 text-amber-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Years</span>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{stats.total}</span>
                  </button>
                  {sortedYears.map(({ year, count }) => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year.toString())}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedYear === year.toString()
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{year}</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-gray-400" />
                  Filter by Type
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleTypeChange('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === 'all'
                        ? 'bg-amber-100 text-amber-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Types</span>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{stats.total}</span>
                  </button>
                  {stats.types.map(({ type, count }) => {
                    const Icon = typeIcons[type] || DocumentTextIcon;
                    return (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type
                            ? 'bg-amber-100 text-amber-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {typeLabels[type] || type}
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Active Filters */}
              {(selectedYear !== 'all' || selectedType !== 'all' || searchQuery) && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {selectedYear !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                        Year: {selectedYear}
                        <button onClick={() => handleYearChange('all')} className="ml-1 hover:text-amber-900">×</button>
                      </span>
                    )}
                    {selectedType !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                        Type: {typeLabels[selectedType] || selectedType}
                        <button onClick={() => handleTypeChange('all')} className="ml-1 hover:text-amber-900">×</button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-amber-900">×</button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedYear('all');
                        setSelectedType('all');
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : (
                    pagination.total > 0 
                      ? `${pagination.total} Archived ${pagination.total === 1 ? 'Item' : 'Items'}`
                      : 'No Items Found'
                  )}
                </h2>
              </div>

              {/* Content Grid */}
              {isLoading ? (
                <ContentSkeleton count={6} />
              ) : error ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="text-red-500 mb-4">Failed to load archive</div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : content.length > 0 ? (
                <>
                  <ContentGrid content={content} columns={3} />
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg ${
                                currentPage === pageNum
                                  ? 'bg-amber-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={currentPage === pagination.totalPages}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <ArchiveBoxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Archived Content</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedYear !== 'all' || selectedType !== 'all'
                      ? 'Try adjusting your filters or search query to find what you\'re looking for.'
                      : 'There is no archived content at the moment. Check back later!'}
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Browse Latest Content
                  </Link>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
