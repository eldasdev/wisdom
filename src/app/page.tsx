'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { SerializableContent, Content } from '@/lib/types';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentSkeleton } from '@/components/content/ContentSkeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  DocumentTextIcon,
  ChartBarIcon,
  BookOpenIcon,
  FolderIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const contentTypes = [
  {
    type: 'articles' as const,
    title: 'Articles',
    description: 'In-depth analysis and insights from leading scholars',
    icon: DocumentTextIcon,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
  },
  {
    type: 'case-studies' as const,
    title: 'Case Studies',
    description: 'Real-world business challenges and solutions',
    icon: ChartBarIcon,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
  },
  {
    type: 'books' as const,
    title: 'Books',
    description: 'Comprehensive works on business topics',
    icon: BookOpenIcon,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
  },
  {
    type: 'collections' as const,
    title: 'Collections',
    description: 'Curated selections for focused learning',
    icon: FolderIcon,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
];

// Utility function to convert SerializableContent to Content
function deserializeContent(serializableContent: SerializableContent): Content {
  return {
    ...serializableContent,
    publishedAt: new Date(serializableContent.publishedAt),
    updatedAt: serializableContent.updatedAt ? new Date(serializableContent.updatedAt) : undefined,
  } as Content;
}

export default function Home() {
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-content'],
    queryFn: async () => {
      const response = await fetch('/api/content/recent?limit=6');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return data.items || data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[128px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[128px] opacity-20 -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[128px] opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <AcademicCapIcon className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-sm font-medium text-white/90">Academic Publishing Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Where Knowledge
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meets Excellence
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Discover peer-reviewed articles, case studies, and research from leading scholars and practitioners worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                href="/articles"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-[#0C2C55] bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                <SparklesIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Explore Content
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/search"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Search Library
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-400">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Peer Reviewed</span>
              </div>
              <div className="flex items-center">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span>DOI Registered</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-purple-400" />
                <span>Open Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-8 sm:py-12 bg-white -mt-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0C2C55]/5 to-transparent hover:from-[#0C2C55]/10 transition-all duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0C2C55] to-slate-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {((stats.total ?? stats.totalPublications) ?? 0).toLocaleString()}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600 font-medium">
                  <BookOpenIcon className="w-4 h-4 mr-1.5 text-[#0C2C55]" />
                  Total Items
                </div>
              </div>
              <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent hover:from-emerald-500/10 transition-all duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {(stats.byType?.article ?? 0).toLocaleString()}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600 font-medium">
                  <DocumentTextIcon className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Articles
                </div>
              </div>
              <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent hover:from-violet-500/10 transition-all duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {(stats.byType?.['case-study'] ?? 0).toLocaleString()}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600 font-medium">
                  <ChartBarIcon className="w-4 h-4 mr-1.5 text-violet-600" />
                  Case Studies
                </div>
              </div>
              <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-pink-500/5 to-transparent hover:from-pink-500/10 transition-all duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {((stats.authors ?? stats.activeAuthors) ?? 0).toLocaleString()}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600 font-medium">
                  <UserIcon className="w-4 h-4 mr-1.5 text-pink-600" />
                  Authors
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Types */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore by Content Type
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the right content for your learning objectives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contentTypes.map((contentType) => (
              <Link
                key={contentType.type}
                href={`/${contentType.type}`}
                className="group relative p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white"
              >
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${contentType.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 ${contentType.bgColor} group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300`}>
                    <contentType.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">
                    {contentType.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/80 text-sm leading-relaxed transition-colors duration-300">
                    {contentType.description}
                  </p>
                  <div className="mt-4 flex items-center text-[#0C2C55] group-hover:text-white font-medium text-sm transition-colors duration-300">
                    Browse
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-3">
                <SparklesIcon className="w-4 h-4 mr-1.5" />
                Featured
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Editor's Picks
              </h2>
            </div>
            <Link href="/articles" className="text-[#0C2C55] hover:text-[#0C2C55]/80 font-medium flex items-center group">
              View all
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredLoading ? (
            <ContentSkeleton count={3} />
          ) : featuredContent && featuredContent.length > 0 ? (
            <ContentGrid content={featuredContent.slice(0, 6).map(deserializeContent)} columns={3} />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <SparklesIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No featured content available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Content */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-3">
                <ClockIcon className="w-4 h-4 mr-1.5" />
                Latest
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Recently Published
              </h2>
            </div>
            <Link href="/search" className="text-[#0C2C55] hover:text-[#0C2C55]/80 font-medium flex items-center group">
              View all
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentLoading ? (
            <ContentSkeleton count={6} />
          ) : recentContent && recentContent.length > 0 ? (
            <ContentGrid content={recentContent} columns={3} />
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
              <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent content available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900"></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-white/90">Open for new authors</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Join Our Community
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Access premium business education content and connect with leading scholars and practitioners worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-[#0C2C55] bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                <UserIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Become an Author
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <BookOpenIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Institutional Access
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-slate-400">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Leading academic journal
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Peer reviewed
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                DOI registration
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
