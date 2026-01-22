'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const industries = [
  'All Industries',
  'Technology & Software',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail & E-commerce',
  'Entertainment & Media',
  'Energy & Utilities',
  'Transportation & Logistics',
];

export default function CaseStudiesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['case-studies', selectedIndustry],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('type', 'case-study');
      if (selectedIndustry !== 'All Industries') {
        params.set('industries', selectedIndustry);
      }

      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch case studies');
      }
      return response.json();
    },
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-emerald-800 to-green-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <ChartBarIcon className="w-4 h-4 text-emerald-300 mr-2" />
              <span className="text-sm font-medium text-white/90">Real-World Business Insights</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Case Studies
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed px-4">
              Real-world business challenges and strategic solutions. Learn from successful implementations and strategic decisions across industries.
            </p>
            
            {/* Search bar */}
            <div className="mt-8 max-w-xl mx-auto px-4">
              <Link 
                href="/search?type=case-study"
                className="flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white/60 hover:bg-white/20 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                <span className="text-sm sm:text-base">Search case studies...</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Mobile filter toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium"
              >
                <FunnelIcon className="w-4 h-4" />
                Industries
                {selectedIndustry !== 'All Industries' && (
                  <span className="ml-1 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">1</span>
                )}
              </button>
              <span className="text-sm text-gray-500">
                {data ? `${data.total} case studies` : 'Loading...'}
              </span>
            </div>

            {/* Filter pills */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                        selectedIndustry === industry
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:block text-sm text-gray-500 font-medium">
                  {data ? `${data.total} case studies found` : 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ContentSkeleton count={9} />
          ) : error ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <ChartBarIcon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Error Loading Case Studies</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                There was a problem loading the case studies. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-600/25"
              >
                Try Again
              </button>
            </div>
          ) : data && data.items.length > 0 ? (
            <ContentGrid content={data.items} columns={3} />
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <ChartBarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No Case Studies Found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                {selectedIndustry === 'All Industries'
                  ? 'No case studies are available at this time.'
                  : `No case studies found in the "${selectedIndustry}" industry.`
                }
              </p>
              {selectedIndustry !== 'All Industries' && (
                <button
                  onClick={() => setSelectedIndustry('All Industries')}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  View All Case Studies
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Educational Value Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 mb-4">
              <LightBulbIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Why Case Studies?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Learning from Case Studies
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Case studies provide valuable insights into real business situations, helping you understand complex challenges and effective solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <LightBulbIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Strategic Insights</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Understand how successful companies make critical strategic decisions and navigate complex business challenges.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Leadership Lessons</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Learn from real leadership challenges and how executives navigate uncertainty and drive organizational change.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <ArrowTrendingUpIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Industry Applications</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Apply lessons from different industries to your own business context and understand cross-industry patterns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
