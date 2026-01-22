'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SerializableContent } from '@/lib/types';
import Link from 'next/link';
import { ArrowDownTrayIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

// Dynamically import PdfViewer to avoid SSR issues with react-pdf
const PdfViewer = dynamic(() => import('@/components/PdfViewer').then(mod => ({ default: mod.PdfViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface ArticleViewProps {
  content: SerializableContent;
  relatedContent?: any[];
}

export function ArticleView({ content, relatedContent = [] }: ArticleViewProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [claps, setClaps] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to user's bookmarks
  };

  const handleClap = () => {
    setClaps(claps + 1);
    // Here you would send to backend
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="mb-12">
        {/* Category */}
        <div className="mb-6">
          <Link
            href={`/articles?categories=${encodeURIComponent(content.category)}`}
            className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            {content.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          {content.title}
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
          {content.description}
        </p>

        {/* PDF Action Buttons */}
        {content.pdfUrl && (
          <div className="mb-8 flex flex-wrap gap-4">
            <a
              href={content.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <EyeIcon className="w-5 h-5" />
              View PDF
            </a>
            <a
              href={content.pdfUrl}
              download={content.pdfFileName || 'document.pdf'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download PDF
            </a>
          </div>
        )}

        {/* Author & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 border-t border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Author Avatar Placeholder */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {getAuthorsText().charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <div className="font-medium text-gray-900">
                {getAuthorsText()}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(content.publishedAt)} · {content.readTime} min read
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Share"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 transition-colors ${
                isBookmarked
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Bookmark"
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-lg p-8 sm:p-12">
          <div 
            className="text-gray-900 text-lg leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      </div>

      {/* PDF Document Section */}
      {content.pdfUrl && (
        <div className="mb-12 bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">PDF Document</h3>
                <p className="text-sm text-blue-100">
                  {content.pdfFileName || 'View and download the full document'}
                </p>
              </div>
            </div>
            <a
              href={content.pdfUrl}
              download={content.pdfFileName || 'document.pdf'}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
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

      {/* Tags */}
      {content.tags && Array.isArray(content.tags) && content.tags.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Citation Information */}
      {(content.doi || content.citationCount !== undefined) && (
        <div className="mb-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.doi && (
              <div>
                <span className="text-sm font-medium text-gray-700">DOI:</span>
                <a
                  href={`https://doi.org/${content.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 font-mono text-sm break-all"
                >
                  {content.doi}
                </a>
              </div>
            )}
            {content.citationCount !== undefined && (
              <div>
                <span className="text-sm font-medium text-gray-700">Citations:</span>
                <span className="ml-2 text-gray-900">{content.citationCount}</span>
              </div>
            )}
          </div>
          {content.bibtex && (
            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  BibTeX Citation
                </summary>
                <pre className="mt-2 p-3 bg-white rounded text-xs font-mono text-gray-800 overflow-x-auto">
                  {content.bibtex}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Engagement Section */}
      <div className="border-t border-gray-200 pt-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClap}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{claps} claps</span>
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Published {formatDate(content.publishedAt)}
            {content.updatedAt && content.updatedAt > content.publishedAt && (
              <span> · Updated {formatDate(content.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Author Bio */}
      {content.authors && content.authors.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-medium">
                {content.authors[0].name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Written by {getAuthorsText()}
              </h3>
              <p className="text-gray-600 mb-4">
                {content.authors[0].title && `${content.authors[0].title} at `}
                {content.authors[0].institution || 'Academic Institution'}
              </p>

              {content.authors[0].bio && (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {content.authors[0].bio}
                </p>
              )}

              {/* Author Links */}
              <div className="flex space-x-4 mt-4">
                {content.authors[0].website && (
                  <a
                    href={content.authors[0].website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Website
                  </a>
                )}
                {content.authors[0].linkedin && (
                  <a
                    href={content.authors[0].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    LinkedIn
                  </a>
                )}
                {content.authors[0].twitter && (
                  <a
                    href={`https://twitter.com/${content.authors[0].twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Articles */}
      {relatedContent && relatedContent.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedContent.slice(0, 4).map((related: any) => (
              <Link
                key={related.id}
                href={`/articles/${related.slug}`}
                className="group"
              >
                <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {related.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {related.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{related.authors?.[0]?.name || 'Anonymous'}</span>
                    <span>{related.readTime} min read</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}