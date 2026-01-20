'use client';

import { useState } from 'react';
import { CaseStudy } from '@/lib/types';
import Link from 'next/link';

interface CaseStudyViewProps {
  content: CaseStudy;
  relatedContent?: any[];
}

export function CaseStudyView({ content, relatedContent = [] }: CaseStudyViewProps) {
  const [activeTab, setActiveTab] = useState<'case' | 'teaching' | 'analysis'>('case');
  const [isExpanded, setIsExpanded] = useState(false);

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
    { id: 'case', label: 'Case Study', icon: '📋' },
    { id: 'analysis', label: 'Analysis', icon: '🔍' },
    { id: 'teaching', label: 'Teaching Notes', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="inline-block px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                Case Study
              </span>
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                {content.industry}
              </span>
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

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6 max-w-4xl">
            {content.description}
          </p>

          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Company</div>
                <div className="font-medium text-gray-900">{content.company || 'Anonymous Company'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Industry</div>
                <div className="font-medium text-gray-900">{content.industry}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Published</div>
                <div className="font-medium text-gray-900">{formatDate(content.publishedAt)}</div>
              </div>
            </div>
          </div>

          {/* Authors */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {getAuthorsText().charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Author</div>
                <div className="font-medium text-gray-900">{getAuthorsText()}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Citation Index</div>
              <div className="font-medium text-gray-900">{content.citationCount || 0}</div>
            </div>
          </div>
        </header>

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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'case' && (
              <div className="prose prose-lg prose-gray max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: content.content }}
                  className="leading-relaxed"
                />

                {/* Expandable Teaching Notes Preview */}
                {content.teachingNotes && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">Teaching Notes Available</h3>
                      <button
                        onClick={() => setActiveTab('teaching')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Teaching Notes
                      </button>
                    </div>
                    <p className="text-blue-800 text-sm">
                      This case study includes comprehensive teaching notes with discussion questions,
                      analysis frameworks, and suggested assignments.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-8">
                {/* Learning Objectives */}
                {content.learningObjectives && content.learningObjectives.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Learning Objectives</h3>
                    <div className="grid gap-3">
                      {content.learningObjectives.map((objective, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-medium">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Issues & Analysis */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Strategic Issues</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      This case study explores critical strategic challenges faced by {content.company || 'the organization'}
                      in the {content.industry} industry. Students are encouraged to analyze the situation from multiple
                      perspectives and develop comprehensive recommendations.
                    </p>
                  </div>
                </div>

                {/* Discussion Questions */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Discussion Questions</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">1. Strategic Analysis</p>
                      <p className="text-gray-700 text-sm">
                        What are the key strategic challenges facing {content.company || 'the company'}?
                        How do these challenges reflect broader industry trends?
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">2. Decision Framework</p>
                      <p className="text-gray-700 text-sm">
                        Using the appropriate strategic frameworks, analyze the company's current position
                        and future options.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">3. Implementation</p>
                      <p className="text-gray-700 text-sm">
                        What specific actions should management take to address the identified issues?
                        Consider implementation challenges and success metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teaching' && (
              <div className="space-y-8">
                {content.teachingNotes ? (
                  <div className="prose prose-lg prose-gray max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: content.teachingNotes }}
                      className="leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Teaching Notes Not Available</h3>
                    <p className="text-gray-600">
                      Teaching notes for this case study are not yet available. Check back later or contact the author.
                    </p>
                  </div>
                )}

                {/* Teaching Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">Teaching Resources</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• PowerPoint slides</li>
                      <li>• Discussion questions</li>
                      <li>• Analysis frameworks</li>
                      <li>• Assignment suggestions</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-green-900 mb-3">Learning Outcomes</h4>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Strategic thinking skills</li>
                      <li>• Industry analysis</li>
                      <li>• Decision-making frameworks</li>
                      <li>• Implementation planning</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Citation Information */}
        {(content.doi || content.citationCount !== undefined) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Citation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.doi && (
                <div>
                  <span className="text-sm font-medium text-gray-700">DOI:</span>
                  <a
                    href={`https://doi.org/${content.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 font-mono text-sm break-all block"
                  >
                    {content.doi}
                  </a>
                </div>
              )}
              {content.citationCount !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Citation Count:</span>
                  <span className="ml-2 text-gray-900 font-medium">{content.citationCount}</span>
                </div>
              )}
            </div>

            {content.bibtex && (
              <div className="mt-4">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-2 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    BibTeX Citation
                  </summary>
                  <pre className="mt-3 p-4 bg-gray-50 rounded text-xs font-mono text-gray-800 overflow-x-auto">
                    {content.bibtex}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Related Case Studies */}
        {relatedContent && relatedContent.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Case Studies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.slice(0, 6).map((related: any) => (
                <Link
                  key={related.id}
                  href={`/case-studies/${related.slug}`}
                  className="group"
                >
                  <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                        Case Study
                      </span>
                      <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                        {related.industry}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {related.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {related.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{related.company || 'Anonymous'}</span>
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