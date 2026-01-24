'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SerializableContent } from '@/lib/types';
import Link from 'next/link';
import {
  ListBulletIcon,
  StarIcon,
  BookOpenIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  EyeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { CitationSection } from '../CitationSection';
import { ContentActionButtons } from '../ContentActionButtons';

// Dynamically import PdfViewer to avoid SSR issues with react-pdf
const PdfViewer = dynamic(() => import('@/components/PdfViewer').then(mod => ({ default: mod.PdfViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface BookViewProps {
  content: SerializableContent;
  relatedContent?: any[];
}

export function BookView({ content, relatedContent = [] }: BookViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contents' | 'reviews' | 'citations'>('overview');

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpenIcon },
    { id: 'contents', label: 'Table of Contents', icon: ListBulletIcon },
    { id: 'reviews', label: 'Reviews', icon: StarIcon },
    { id: 'citations', label: 'Citations', icon: BookOpenIcon },
  ];

  // Mock table of contents - in real app, this would come from metadata
  const tableOfContents = [
    { title: 'Introduction', page: 1, level: 1 },
    { title: 'Chapter 1: Foundation Concepts', page: 15, level: 1 },
    { title: 'Theoretical Framework', page: 15, level: 2 },
    { title: 'Key Principles', page: 35, level: 2 },
    { title: 'Chapter 2: Core Methodologies', page: 65, level: 1 },
    { title: 'Implementation Strategies', page: 65, level: 2 },
    { title: 'Case Studies', page: 95, level: 2 },
    { title: 'Chapter 3: Advanced Applications', page: 125, level: 1 },
    { title: 'Future Trends', page: 155, level: 2 },
    { title: 'Conclusion', page: 185, level: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover Placeholder */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpenIcon className="w-16 h-16 mb-2" />
                  <div className="text-sm font-medium">Book Cover</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {content.pdfUrl && (
                  <a
                    href={content.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <EyeIcon className="w-5 h-5" />
                    Read Sample
                  </a>
                )}
                <button className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-medium shadow-md">
                  <ShoppingCartIcon className="w-5 h-5" />
                  Purchase Book
                </button>
                {content.pdfUrl && (
                  <a
                    href={content.pdfUrl}
                    download
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download Resources
                  </a>
                )}
              </div>
              
              {/* Share/Save Buttons */}
              <div className="mt-4">
                <ContentActionButtons
                  title={content.title}
                  description={content.description}
                  pdfUrl={content.pdfUrl}
                  showDownload={false}
                  showPrint={false}
                  variant="compact"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                  Book
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

              <div className="text-xl text-gray-600 mb-6">
                by {getAuthorsText()}
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl">
                {content.description}
              </p>

              {/* PDF Action Buttons */}
              {content.pdfUrl && (
                <div className="mb-6 flex flex-wrap gap-4">
                  <a
                    href={content.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <EyeIcon className="w-5 h-5" />
                    View PDF
                  </a>
                  <a
                    href={content.pdfUrl}
                    download={content.pdfFileName || 'book.pdf'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download PDF
                  </a>
                </div>
              )}

              {/* Book Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-500">Pages</div>
                  <div className="font-semibold text-gray-900">{content.pages}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Publisher</div>
                  <div className="font-semibold text-gray-900">{content.publisher || 'Self-published'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Edition</div>
                  <div className="font-semibold text-gray-900">{content.edition || '1st'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Published</div>
                  <div className="font-semibold text-gray-900">{formatDate(content.publishedAt)}</div>
                </div>
              </div>

              {/* ISBN */}
              {content.isbn && (
                <div className="mb-6">
                  <span className="text-sm text-gray-500">ISBN:</span>
                  <span className="ml-2 font-mono text-gray-900">{content.isbn}</span>
                </div>
              )}

              {/* Tags */}
              {content.tags && Array.isArray(content.tags) && content.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Citation Info */}
              {(content.doi || content.citationCount !== undefined) && (
                <div className="border-t border-gray-200 pt-6">
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
                        <span className="text-sm font-medium text-gray-700">Citations:</span>
                        <span className="ml-2 text-gray-900 font-medium">{content.citationCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Book Description */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Book</h3>
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-8 sm:p-12">
                      <div 
                        className="text-gray-900 text-lg leading-relaxed prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Comprehensive Coverage</h4>
                        <p className="text-gray-600 text-sm">In-depth exploration of key concepts and methodologies</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Practical Applications</h4>
                        <p className="text-gray-600 text-sm">Real-world examples and case studies throughout</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Research-Based</h4>
                        <p className="text-gray-600 text-sm">Grounded in rigorous academic research and analysis</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Instructor Resources</h4>
                        <p className="text-gray-600 text-sm">Teaching guides and supplementary materials available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contents' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="space-y-2">
                      {tableOfContents.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between py-2 px-4 rounded ${
                            item.level === 1 ? 'bg-white font-medium' : 'bg-gray-50'
                          }`}
                          style={{ marginLeft: `${(item.level - 1) * 20}px` }}
                        >
                          <span className="text-gray-900">{item.title}</span>
                          <span className="text-gray-500 text-sm">p. {item.page}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-900">Detailed Table of Contents</h4>
                      <p className="text-blue-800 text-sm">Download the complete table of contents with sub-sections</p>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Testimonials</h3>

                <div className="space-y-6">
                  {/* Sample Reviews */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">JD</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Dr. Jane Doe</div>
                        <div className="text-sm text-gray-500">Professor of Business Strategy, Harvard Business School</div>
                      </div>
                      <div className="ml-auto flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "This book provides an excellent foundation for understanding modern business strategy.
                      The authors combine theoretical rigor with practical insights that are immediately applicable
                      in real-world business environments."
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">MR</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Michael Rodriguez</div>
                        <div className="text-sm text-gray-500">CEO, TechStart Inc.</div>
                      </div>
                      <div className="ml-auto flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "As a business leader, I found the strategic frameworks and decision-making models
                      presented in this book to be incredibly valuable. The case studies are particularly
                      well-chosen and illustrate key concepts effectively."
                    </p>
                  </div>

                  <div className="text-center">
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'citations' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Citation Information</h3>

                <div className="space-y-6">
                  {/* Citation Formats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">APA Format</h4>
                      <code className="text-sm text-gray-700 font-mono bg-white p-3 rounded block">
                        {getAuthorsText().split(', ')[0]}. ({new Date(content.publishedAt).getFullYear()}). <em>{content.title}</em>. {content.publisher || 'Publisher'}.
                      </code>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">MLA Format</h4>
                      <code className="text-sm text-gray-700 font-mono bg-white p-3 rounded block">
                        {getAuthorsText().split(', ')[0]}. <em>{content.title}</em>. {content.publisher || 'Publisher'}, {new Date(content.publishedAt).getFullYear()}.
                      </code>
                    </div>
                  </div>

                  {/* BibTeX */}
                  {content.bibtex && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">BibTeX</h4>
                      <pre className="text-xs text-gray-700 font-mono bg-white p-4 rounded overflow-x-auto">
                        {content.bibtex}
                      </pre>
                    </div>
                  )}

                  {/* Citation Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{content.citationCount || 0}</div>
                      <div className="text-sm text-blue-800">Total Citations</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">4.8</div>
                      <div className="text-sm text-green-800">Average Rating</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">127</div>
                      <div className="text-sm text-purple-800">Reader Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PDF Document Section */}
        {content.pdfUrl && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Book Preview / Full Text</h3>
                  <p className="text-sm text-purple-100">
                    {content.pdfFileName || 'View and download the full book'}
                  </p>
                </div>
              </div>
              <a
                href={content.pdfUrl}
                download={content.pdfFileName || 'book.pdf'}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-purple-600 bg-white rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download PDF
              </a>
            </div>
            <div className="p-6">
              <PdfViewer 
                pdfUrl={content.pdfUrl} 
                fileName={content.pdfFileName || undefined}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

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

        {/* Related Books */}
        {relatedContent && relatedContent.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Books</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.slice(0, 6).map((related: any) => (
                <Link
                  key={related.id}
                  href={`/books/${related.slug}`}
                  className="group"
                >
                  <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded">
                        Book
                      </span>
                      {related.featured && (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {related.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {related.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {related.authors?.[0]?.name || 'Anonymous'}</span>
                      <span>{related.pages} pages</span>
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