'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ContentType } from '@/lib/types';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

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
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>(searchParams.get('industry')?.split(',').filter(Boolean) || []);
  const [selectedCompany, setSelectedCompany] = useState<string[]>(searchParams.get('company')?.split(',').filter(Boolean) || []);
  const [selectedSector, setSelectedSector] = useState<string[]>(searchParams.get('sector')?.split(',').filter(Boolean) || []);
  const [selectedRegion, setSelectedRegion] = useState<string[]>(searchParams.get('region')?.split(',').filter(Boolean) || []);
  const [selectedCountry, setSelectedCountry] = useState<string[]>(searchParams.get('country')?.split(',').filter(Boolean) || []);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(searchParams.get('category')?.split(',').filter(Boolean) || []);
  const [selectedTopic, setSelectedTopic] = useState<string[]>(searchParams.get('topic')?.split(',').filter(Boolean) || []);
  const [selectedSubject, setSelectedSubject] = useState<string[]>(searchParams.get('subject')?.split(',').filter(Boolean) || []);
  const [showFilters, setShowFilters] = useState(false);

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await fetch('/api/filters');
      return response.json();
    },
  });

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query, selectedType, selectedTags, selectedIndustry, selectedCompany, selectedSector, selectedRegion, selectedCountry, selectedCategory, selectedTopic, selectedSubject],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedType !== 'all') params.set('type', selectedType);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      if (selectedIndustry.length > 0) params.set('industry', selectedIndustry.join(','));
      if (selectedCompany.length > 0) params.set('company', selectedCompany.join(','));
      if (selectedSector.length > 0) params.set('sector', selectedSector.join(','));
      if (selectedRegion.length > 0) params.set('region', selectedRegion.join(','));
      if (selectedCountry.length > 0) params.set('country', selectedCountry.join(','));
      if (selectedCategory.length > 0) params.set('category', selectedCategory.join(','));
      if (selectedTopic.length > 0) params.set('topic', selectedTopic.join(','));
      if (selectedSubject.length > 0) params.set('subject', selectedSubject.join(','));

      const response = await fetch(`/api/search?${params}`);
      return response.json();
    },
    enabled: query.trim().length > 0 || selectedType !== 'all' || selectedTags.length > 0 || selectedIndustry.length > 0 || selectedCompany.length > 0 || selectedSector.length > 0 || selectedRegion.length > 0 || selectedCountry.length > 0 || selectedCategory.length > 0 || selectedTopic.length > 0 || selectedSubject.length > 0,
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
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedTags([]);
    setSelectedIndustry([]);
    setSelectedCompany([]);
    setSelectedSector([]);
    setSelectedRegion([]);
    setSelectedCountry([]);
    setSelectedCategory([]);
    setSelectedTopic([]);
    setSelectedSubject([]);
    router.push('/search');
  };

  const hasActiveFilters = query.trim() || selectedType !== 'all' || selectedTags.length > 0 || selectedIndustry.length > 0 || selectedCompany.length > 0 || selectedSector.length > 0 || selectedRegion.length > 0 || selectedCountry.length > 0 || selectedCategory.length > 0 || selectedTopic.length > 0 || selectedSubject.length > 0;

  const activeFilterCount = (selectedType !== 'all' ? 1 : 0) + selectedTags.length + selectedIndustry.length + selectedCompany.length + selectedSector.length + selectedRegion.length + selectedCountry.length + selectedCategory.length + selectedTopic.length + selectedSubject.length;

  return (
    <PublicLayout>
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Search</h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Find articles, case studies, books, and more from our collection
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for content..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border-0 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-white/50 shadow-lg focus:outline-none"
                  style={{ color: '#000000' }}
                />
              </div>
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#0C2C55] rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Content Type */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ContentType | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent bg-white"
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? 'bg-[#0C2C55] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${showFilters ? 'bg-white text-[#0C2C55]' : 'bg-[#0C2C55] text-white'}`}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Clear All */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            <span className="text-sm text-gray-500">
              {searchResults ? `${searchResults.total} results` : 'Enter search terms'}
            </span>
          </div>

          {/* Expanded Filters */}
          {showFilters && filters && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              {/* Tags */}
              {filters.tags && filters.tags.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.slice(0, 15).map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                          selectedTags.includes(tag)
                            ? 'bg-[#0C2C55] text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry */}
              {filters.industries && filters.industries.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Industry</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.industries.slice(0, 10).map((industry: string) => (
                      <button
                        key={industry}
                        onClick={() => setSelectedIndustry(prev =>
                          prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
                        )}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                          selectedIndustry.includes(industry)
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Company */}
              {filters.companies && filters.companies.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Company</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.companies.slice(0, 10).map((company: string) => (
                      <button
                        key={company}
                        onClick={() => setSelectedCompany(prev =>
                          prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
                        )}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                          selectedCompany.includes(company)
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={9} />
          ) : searchResults && searchResults.items.length > 0 ? (
            <ContentGrid content={searchResults.items} columns={3} />
          ) : hasActiveFilters ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No Results Found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No content matches your search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0C2C55]/10 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-[#0C2C55]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Start Your Search</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter keywords, select content types, or choose filters to find relevant content.
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
