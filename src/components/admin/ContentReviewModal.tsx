'use client';

import { useState } from 'react';
import { Content } from '@/lib/types';
import { ContentStatus } from '@prisma/client';

interface ContentReviewModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onPublish: (contentId: string) => void;
  onDeny: (contentId: string) => void;
}

export function ContentReviewModal({
  content,
  isOpen,
  onClose,
  onPublish,
  onDeny,
}: ContentReviewModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDenying, setIsDenying] = useState(false);

  if (!isOpen || !content) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish(content.id);
      onClose();
    } catch (error) {
      console.error('Failed to publish content:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeny = async () => {
    setIsDenying(true);
    try {
      await onDeny(content.id);
      onClose();
    } catch (error) {
      console.error('Failed to deny content:', error);
    } finally {
      setIsDenying(false);
    }
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div
          className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-10"
          style={{ zIndex: 9999 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Review Content - TEST</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-900">{content.title}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(content.status)}`}>
                {content.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <span className="ml-2 text-sm text-gray-900">{content.type.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Slug:</span>
                <span className="ml-2 text-sm text-gray-900">{content.slug}</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Description:</span>
              <p className="mt-1 text-sm text-gray-900">{content.description}</p>
            </div>
          </div>

          {/* Content Body */}
          <div className="mb-6">
            <h5 className="text-lg font-medium text-gray-900 mb-3">Content Preview</h5>
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content.substring(0, 500) + (content.content.length > 500 ? '...' : '') }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeny}
              disabled={isDenying || isPublishing}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDenying ? 'Denying...' : 'Deny (Send to Draft)'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || isDenying}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? 'Publishing...' : 'Publish Content'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}