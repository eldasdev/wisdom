'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Author {
  id: string;
  name: string;
  title?: string;
  institution?: string;
  bio?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  authoredContent: Array<{
    content: {
      id: string;
      title: string;
      slug: string;
      type: string;
      publishedAt: string;
      status: string;
    };
  }>;
  _count: {
    authoredContent: number;
  };
}

export default function AdminAuthorViewPage() {
  const params = useParams();
  const router = useRouter();
  const authorId = params.id as string;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: author, isLoading, error } = useQuery<Author>({
    queryKey: ['author', authorId],
    queryFn: async () => {
      const response = await fetch(`/api/authors/${authorId}`);
      if (!response.ok) {
        throw new Error('Author not found');
      }
      return response.json();
    },
  });

  const handleDelete = async () => {
    if (!author) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete author');
      }

      router.push('/admin/authors');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete author');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'ARTICLE': 'Article',
      'CASE_STUDY': 'Case Study',
      'BOOK': 'Book',
      'BOOK_CHAPTER': 'Book Chapter',
      'TEACHING_NOTE': 'Teaching Note',
      'COLLECTION': 'Collection',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Author not found</h3>
          <p className="mt-1 text-sm text-gray-500">The author you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              href="/admin/authors"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/authors"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
            {author.title && (
              <p className="text-gray-600 mt-1">{author.title}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/authors/${authorId}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Author Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{author.name}</h2>
              {author.title && (
                <p className="text-sm text-gray-500">{author.title}</p>
              )}
            </div>

            <div className="space-y-4">
              {author.institution && (
                <div className="flex items-center text-sm">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{author.institution}</span>
                </div>
              )}
              {author.email && (
                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <a href={`mailto:${author.email}`} className="text-blue-600 hover:underline">
                    {author.email}
                  </a>
                </div>
              )}
              {author.website && (
                <div className="flex items-center text-sm">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {author.website}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(author.linkedin || author.twitter) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Social Profiles</h3>
                <div className="flex space-x-4">
                  {author.linkedin && (
                    <a
                      href={author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {author.twitter && (
                    <a
                      href={author.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{author._count.authoredContent}</div>
                <div className="text-xs text-gray-500">Total Content</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {author.authoredContent.filter(ac => ac.content.status === 'PUBLISHED').length}
                </div>
                <div className="text-xs text-gray-500">Published</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {author.bio && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{author.bio}</p>
            </div>
          )}

          {/* Authored Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Authored Content ({author._count.authoredContent})
              </h3>
            </div>

            {author.authoredContent.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {author.authoredContent.map((ac) => (
                  <div key={ac.content.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {getContentTypeLabel(ac.content.type)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ac.content.status)}`}>
                            {ac.content.status}
                          </span>
                        </div>
                        <Link
                          href={`/admin/content/${ac.content.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                        >
                          {ac.content.title}
                        </Link>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(ac.content.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Link
                        href={`/admin/content/${ac.content.id}/edit`}
                        className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No content yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This author hasn't been assigned to any content.
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Record Info</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900 mt-1">
                  {new Date(author.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900 mt-1">
                  {new Date(author.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">Author ID</dt>
                <dd className="text-gray-900 mt-1 font-mono text-xs">{author.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete Author
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <strong>{author.name}</strong>? This action cannot be undone.
              {author._count.authoredContent > 0 && (
                <span className="block mt-2 text-red-600">
                  Note: This author has {author._count.authoredContent} associated content item(s) that must be reassigned first.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
