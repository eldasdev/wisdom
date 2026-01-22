'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function DashboardContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-content', contentId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/content/${contentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      return response.json();
    },
  });

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/dashboard/content/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete content');
      }

      router.push('/dashboard/content');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete content');
      setIsDeleting(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Not Found</h2>
        <p className="text-gray-500 mb-6">The content you're looking for doesn't exist or you don't have access to it.</p>
        <Link
          href="/dashboard/content"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to My Content
        </Link>
      </div>
    );
  }

  const content = data.content;
  const metadata = content.metadata || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link
              href="/dashboard/content"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              content.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : content.status === 'REVIEW'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {content.status}
            </span>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              content.type === 'ARTICLE'
                ? 'bg-indigo-100 text-indigo-800'
                : content.type === 'CASE_STUDY'
                ? 'bg-purple-100 text-purple-800'
                : content.type === 'BOOK'
                ? 'bg-pink-100 text-pink-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {content.type.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{content.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.status === 'PUBLISHED' && (
            <Link
              href={getContentUrl(content.type, content.slug)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Live
            </Link>
          )}
          <Link
            href={`/dashboard/content/${contentId}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </Link>
          {content.status === 'DRAFT' && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700">{content.description}</p>
          </div>

          {/* Content Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Content Preview</h2>
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: content.content.substring(0, 1000) + (content.content.length > 1000 ? '...' : '') }}
            />
          </div>

          {/* PDF Document */}
          {content.pdfUrl && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">PDF Document</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{content.pdfFileName || 'Document.pdf'}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <a
                  href={content.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View PDF
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{content.slug}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(content.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(content.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              {content.viewCount > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Views
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{content.viewCount}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((ct: any) => (
                  <span
                    key={ct.tag.id}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {ct.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Type-specific metadata */}
          {Object.keys(metadata).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Info</h2>
              <dl className="space-y-3">
                {metadata.category && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{metadata.category}</dd>
                  </div>
                )}
                {metadata.industry && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900">{metadata.industry}</dd>
                  </div>
                )}
                {metadata.company && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="mt-1 text-sm text-gray-900">{metadata.company}</dd>
                  </div>
                )}
                {metadata.isbn && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                    <dd className="mt-1 text-sm text-gray-900">{metadata.isbn}</dd>
                  </div>
                )}
                {metadata.publisher && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                    <dd className="mt-1 text-sm text-gray-900">{metadata.publisher}</dd>
                  </div>
                )}
                {metadata.pages && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pages</dt>
                    <dd className="mt-1 text-sm text-gray-900">{metadata.pages}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Status Info */}
          <div className={`rounded-lg p-4 ${
            content.status === 'PUBLISHED'
              ? 'bg-green-50 border border-green-200'
              : content.status === 'REVIEW'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h3 className={`font-medium ${
              content.status === 'PUBLISHED'
                ? 'text-green-800'
                : content.status === 'REVIEW'
                ? 'text-blue-800'
                : 'text-yellow-800'
            }`}>
              {content.status === 'PUBLISHED'
                ? '✓ Published'
                : content.status === 'REVIEW'
                ? '⏳ Under Review'
                : '📝 Draft'
              }
            </h3>
            <p className={`text-sm mt-1 ${
              content.status === 'PUBLISHED'
                ? 'text-green-700'
                : content.status === 'REVIEW'
                ? 'text-blue-700'
                : 'text-yellow-700'
            }`}>
              {content.status === 'PUBLISHED'
                ? 'This content is live and visible to all users.'
                : content.status === 'REVIEW'
                ? 'Waiting for admin approval.'
                : 'Edit and submit for review when ready.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
