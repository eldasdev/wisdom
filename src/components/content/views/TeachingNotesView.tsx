'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SerializableContent } from '@/lib/types';
import Link from 'next/link';
import {
  ClipboardDocumentListIcon,
  BookOpenIcon,
  LightBulbIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// Dynamically import PdfViewer to avoid SSR issues with react-pdf
const PdfViewer = dynamic(() => import('@/components/PdfViewer').then(mod => ({ default: mod.PdfViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface TeachingNotesViewProps {
  content: SerializableContent;
  relatedContent?: any[];
}

export function TeachingNotesView({ content, relatedContent = [] }: TeachingNotesViewProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'materials' | 'objectives' | 'activities'>('overview');

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

  const sections = [
    { id: 'overview', label: 'Overview', icon: ClipboardDocumentListIcon },
    { id: 'materials', label: 'Teaching Materials', icon: BookOpenIcon },
    { id: 'objectives', label: 'Learning Objectives', icon: LightBulbIcon },
    { id: 'activities', label: 'Class Activities', icon: AcademicCapIcon },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                    Teaching Notes
                  </span>
                  <span className="text-sm text-gray-500">
                    {content.duration ? `${content.duration} minutes` : 'Duration not specified'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                📥 Download PDF
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                🔗 Share
              </button>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-6 max-w-4xl">
            {content.description}
          </p>

          {/* PDF Action Buttons */}
          {content.pdfUrl && (
            <div className="mb-6 flex flex-wrap gap-4">
              <a
                href={content.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <EyeIcon className="w-5 h-5" />
                View PDF
              </a>
              <a
                href={content.pdfUrl}
                download={content.pdfFileName || 'teaching-notes.pdf'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 font-semibold rounded-xl border-2 border-cyan-600 hover:bg-cyan-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          )}

          {/* Related Content Info */}
          {content.relatedContentId && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div>
                  <span className="font-medium text-blue-900">Related Content:</span>
                  <span className="ml-2 text-blue-800">
                    {content.relatedContentType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Author</div>
                <div className="font-medium text-gray-900">{getAuthorsText()}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium text-gray-900">
                  {content.duration ? `${content.duration} minutes` : 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Published</div>
                <div className="font-medium text-gray-900">{formatDate(content.publishedAt)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeSection === 'overview' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg p-8 sm:p-12">
                  <div 
                    className="text-gray-900 text-lg leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.content }}
                  />
                </div>

                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div
                    className="bg-blue-50 border border-blue-200 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setActiveSection('objectives')}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <LightBulbIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900">Learning Objectives</h3>
                    </div>
                    <p className="text-blue-800">
                      Review the specific learning outcomes and educational goals for this material.
                    </p>
                  </div>

                  <div
                    className="bg-green-50 border border-green-200 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => setActiveSection('materials')}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <BookOpenIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-900">Teaching Materials</h3>
                    </div>
                    <p className="text-green-800">
                      Access slides, handouts, and supplementary materials for your class.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'materials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Teaching Materials</h3>
                  <p className="text-gray-700 mb-6">
                    Download and use these materials to enhance your teaching experience.
                  </p>
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Lecture Slides</h4>
                        <p className="text-sm text-gray-600">PowerPoint presentation (45 slides)</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Download Slides
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Discussion Guide</h4>
                        <p className="text-sm text-gray-600">Questions and talking points (PDF)</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      Download Guide
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Case Analysis</h4>
                        <p className="text-sm text-gray-600">Framework and analysis tools</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      Download Analysis
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Assignments</h4>
                        <p className="text-sm text-gray-600">Homework and project templates</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                      Download Assignments
                    </button>
                  </div>
                </div>

                {/* Custom Materials */}
                {content.materials && content.materials.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Materials</h4>
                    <ul className="space-y-2">
                      {content.materials.map((material, index) => (
                        <li key={index} className="flex items-center space-x-3 text-gray-700">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'objectives' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Learning Objectives</h3>
                  <p className="text-gray-700 mb-6">
                    After completing this material, students should be able to:
                  </p>
                </div>

                {content.objectives && content.objectives.length > 0 ? (
                  <div className="space-y-4">
                    {content.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-medium text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-900 font-medium">{objective}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Knowledge
                            </span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Application
                            </span>
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                              Analysis
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Learning Objectives Defined</h4>
                    <p className="text-gray-600">
                      Learning objectives have not been specified for this teaching material.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'activities' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Suggested Class Activities</h3>
                  <p className="text-gray-700 mb-6">
                    Engage your students with these interactive activities and exercises.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Group Discussion</h4>
                        <span className="text-sm text-gray-600">15-20 minutes</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Divide students into small groups to discuss the key concepts and share their initial reactions.
                      Have each group prepare 2-3 discussion questions for the class.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Discussion</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Group Work</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎭</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Role-Playing Exercise</h4>
                        <span className="text-sm text-gray-600">25-30 minutes</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Students role-play different stakeholders in the scenario, presenting their perspectives
                      and negotiating solutions.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Role-Playing</span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Negotiation</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ClipboardDocumentListIcon className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Case Analysis</h4>
                        <span className="text-sm text-gray-600">45-60 minutes</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Students apply analytical frameworks to dissect the case, identify key issues,
                      and develop strategic recommendations.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Analysis</span>
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Strategic Thinking</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PDF Document Section */}
        {content.pdfUrl && (
          <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Teaching Notes Document</h3>
                  <p className="text-sm text-cyan-100">
                    {content.pdfFileName || 'View and download the full teaching notes'}
                  </p>
                </div>
              </div>
              <a
                href={content.pdfUrl}
                download={content.pdfFileName || 'teaching-notes.pdf'}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-cyan-600 bg-white rounded-xl hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl"
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

        {/* Related Teaching Materials */}
        {relatedContent && relatedContent.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Teaching Materials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.slice(0, 6).map((related: any) => (
                <Link
                  key={related.id}
                  href={`/teaching-notes/${related.slug}`}
                  className="group"
                >
                  <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                        Teaching Notes
                      </span>
                      <span className="text-sm text-gray-500">
                        {related.duration ? `${related.duration}min` : ''}
                      </span>
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