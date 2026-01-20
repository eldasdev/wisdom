'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { ContentReviewModal } from '@/components/admin/ContentReviewModal';
import { SuccessNotification } from '@/components/admin/SuccessNotification';
import { Content, ContentStatus } from '@/lib/types';

interface RawContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  type: string;
  status: ContentStatus;
  featured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  metadata: any;
  authors?: { author: { id: string; name: string; title?: string; institution?: string; bio?: string } }[];
  tags?: { tag: { id: string; name: string } }[];
}

interface AdminContentClientProps {
  initialContent: RawContent[];
  statusCounts: {
    ALL: number;
    DRAFT: number;
    REVIEW: number;
    PUBLISHED: number;
    ARCHIVED: number;
  };
  currentStatus?: ContentStatus;
}

export function AdminContentClient({ initialContent, statusCounts, currentStatus }: AdminContentClientProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const handleReviewClick = (rawItem: RawContent) => {
    try {
      // Create a basic content object that satisfies the Content type
      // We'll cast it to avoid TypeScript issues with union types
      const baseContent = {
        id: rawItem.id,
        title: rawItem.title,
        slug: rawItem.slug,
        description: rawItem.description,
        content: rawItem.content,
        type: rawItem.type as Content['type'],
        status: rawItem.status,
        featured: rawItem.featured,
        publishedAt: rawItem.publishedAt ? new Date(rawItem.publishedAt) : new Date(),
        updatedAt: new Date(rawItem.updatedAt),
        createdAt: new Date(rawItem.createdAt),
        authors: (rawItem.authors || []).map(a => a.author).filter(author => author),
        tags: (rawItem.tags || []).map(t => t.tag?.name).filter(tag => tag),
        metadata: rawItem.metadata || {},
      };

      // Add type-specific properties with defaults
      let transformedContent: Content;

      switch (rawItem.type) {
        case 'article':
          transformedContent = {
            ...baseContent,
            type: 'article',
            category: rawItem.metadata?.category || '',
            readTime: 5,
            wordCount: rawItem.content.split(' ').length,
          };
          break;
        case 'case-study':
          transformedContent = {
            ...baseContent,
            type: 'case-study',
            industry: rawItem.metadata?.industry || '',
            company: rawItem.metadata?.company,
            learningObjectives: rawItem.metadata?.learningObjectives || [],
          };
          break;
        case 'book':
          transformedContent = {
            ...baseContent,
            type: 'book',
            isbn: rawItem.metadata?.isbn,
            publisher: rawItem.metadata?.publisher,
            pages: rawItem.metadata?.pages || 0,
            edition: rawItem.metadata?.edition,
            chapters: [],
          };
          break;
        case 'book-chapter':
          transformedContent = {
            ...baseContent,
            type: 'book-chapter',
            bookId: rawItem.metadata?.bookId || '',
            chapterNumber: rawItem.metadata?.chapterNumber || 1,
            pageRange: rawItem.metadata?.pageRange,
          };
          break;
        case 'teaching-note':
          transformedContent = {
            ...baseContent,
            type: 'teaching-note',
            relatedContentId: rawItem.metadata?.relatedContentId || '',
            relatedContentType: (rawItem.metadata?.relatedContentType as 'article' | 'case-study' | 'book') || 'article',
            objectives: rawItem.metadata?.objectives || [],
            materials: rawItem.metadata?.materials || [],
            duration: rawItem.metadata?.duration,
          };
          break;
        case 'collection':
          transformedContent = {
            ...baseContent,
            type: 'collection',
            curator: baseContent.authors[0] || { id: '', name: 'Unknown', title: '' },
            items: rawItem.metadata?.items || [],
            theme: rawItem.metadata?.theme || '',
          };
          break;
        default:
          // Default to article type
          transformedContent = {
            ...baseContent,
            type: 'article',
            category: '',
            readTime: 5,
            wordCount: rawItem.content.split(' ').length,
          };
      }

    setSelectedContent(transformedContent);
    setIsModalOpen(true);
    } catch (error) {
      console.error('Error transforming content for modal:', error);
      alert('Error opening review modal. Please try again.');
    }
  };

  const handlePublish = async (contentId: string) => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}/status`, {
        method: 'POST',
        body: new URLSearchParams({ status: 'PUBLISHED' }),
      });

      if (response.ok) {
        // Update local state
        setContent(prev => prev.map(item =>
          item.id === contentId ? { ...item, status: 'PUBLISHED' } : item
        ));

        setNotification({
          message: 'Content published successfully!',
          visible: true,
        });
      } else {
        throw new Error('Failed to publish content');
      }
    } catch (error) {
      console.error('Failed to publish content:', error);
      alert('Failed to publish content. Please try again.');
    }
  };

  const handleDeny = async (contentId: string) => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}/status`, {
        method: 'POST',
        body: new URLSearchParams({ status: 'DRAFT' }),
      });

      if (response.ok) {
        // Update local state
        setContent(prev => prev.map(item =>
          item.id === contentId ? { ...item, status: 'DRAFT' } : item
        ));

        setNotification({
          message: 'Content sent back to draft.',
          visible: true,
        });
      } else {
        throw new Error('Failed to deny content');
      }
    } catch (error) {
      console.error('Failed to deny content:', error);
      alert('Failed to deny content. Please try again.');
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      <SuccessNotification
        message={notification.message}
        isVisible={notification.visible}
        onClose={closeNotification}
      />

      <ContentReviewModal
        content={selectedContent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublish={handlePublish}
        onDeny={handleDeny}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Management</h2>

        {/* Status Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: undefined, label: 'All', count: statusCounts.ALL },
            { key: 'DRAFT', label: 'Drafts', count: statusCounts.DRAFT },
            { key: 'REVIEW', label: 'In Review', count: statusCounts.REVIEW },
            { key: 'PUBLISHED', label: 'Published', count: statusCounts.PUBLISHED },
          ].map(({ key, label, count }) => (
            <Link
              key={key || 'all'}
              href={key ? `/admin/content?status=${key}` : '/admin/content'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentStatus === key || (!currentStatus && !key)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label} ({count})
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Link
            href="/admin/content/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Content
          </Link>
        </div>

        {/* Content Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {content.map((item) => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/admin/content/${item.id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Type: {item.type.replace('_', ' ')}</span>
                          <span>Status: {item.status}</span>
                          <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                          <span>By: {item.authors?.[0]?.author?.name || 'Unknown'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Status Actions */}
                        {item.status === 'DRAFT' && (
                          <button
                            onClick={() => handleReviewClick(item)}
                            className="text-orange-600 hover:text-orange-900 text-xs px-2 py-1 bg-orange-50 rounded"
                          >
                            Send to Review
                          </button>
                        )}
                        {item.status === 'REVIEW' && (
                          <button
                            onClick={() => handleReviewClick(item)}
                            className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-50 rounded"
                          >
                            Review Content
                          </button>
                        )}
                        {item.status === 'PUBLISHED' && (
                          <>
                            <Link
                              href={`/articles/${item.slug}`}
                              target="_blank"
                              className="text-green-600 hover:text-green-900 text-xs px-2 py-1 bg-green-50 rounded"
                            >
                              View Live
                            </Link>
                            <button
                              onClick={() => handleReviewClick(item)}
                              className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 bg-gray-50 rounded"
                            >
                              Unpublish
                            </button>
                          </>
                        )}

                        {/* Edit Button */}
                        <Link
                          href={`/admin/content/${item.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-50 rounded"
                        >
                          Edit
                        </Link>

                        {/* Delete Button */}
                        <DeleteButton
                          action={`/api/admin/content/${item.id}/delete`}
                          itemName="content"
                          className="text-red-600 hover:text-red-900 text-xs px-2 py-1 bg-red-50 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}