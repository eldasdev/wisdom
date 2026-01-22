'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { FeaturedButton } from '@/components/admin/FeaturedButton';
import { ContentReviewModal } from '@/components/admin/ContentReviewModal';
import { SuccessNotification } from '@/components/admin/SuccessNotification';
import { Content } from '@/lib/types';
import { ContentStatus } from '@prisma/client';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Consistent date formatting
const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return 'Date not available';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

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
  viewCount?: number;
  authors?: { author: { id: string; name: string; title?: string; institution?: string; bio?: string } }[];
  tags?: { tag: { id: string; name: string } }[];
}

interface AdminContentClientProps {
  initialContent: RawContent[];
  statusCounts: {
    ALL: number;
    DRAFT: number;
    REVIEW: number;
    FEATURED?: number;
    PUBLISHED: number;
    ARCHIVED: number;
  };
  currentStatus?: ContentStatus | 'FEATURED';
}

const statusTabs = [
  { key: undefined, label: 'All', icon: DocumentTextIcon, color: 'gray' },
  { key: 'DRAFT', label: 'Drafts', icon: ClockIcon, color: 'gray' },
  { key: 'REVIEW', label: 'In Review', icon: EyeIcon, color: 'amber' },
  { key: 'PUBLISHED', label: 'Published', icon: CheckCircleIcon, color: 'green' },
  { key: 'FEATURED', label: 'Featured', icon: StarIcon, color: 'purple' },
];

export function AdminContentClient({ initialContent, statusCounts, currentStatus }: AdminContentClientProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleReviewClick = (rawItem: RawContent) => {
    try {
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
        setContent(prev => prev.map(item =>
          item.id === contentId ? { ...item, status: 'PUBLISHED' } : item
        ));
        setNotification({ message: 'Content published successfully!', visible: true });
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
        setContent(prev => prev.map(item =>
          item.id === contentId ? { ...item, status: 'DRAFT' } : item
        ));
        setNotification({ message: 'Content sent back to draft.', visible: true });
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

  const getStatusCount = (key: string | undefined) => {
    if (!key) return statusCounts.ALL;
    if (key === 'FEATURED') return statusCounts.FEATURED || 0;
    return statusCounts[key as keyof typeof statusCounts] || 0;
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-500 mt-1">Manage all platform content</p>
          </div>
          <Link
            href="/admin/content/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#0C2C55] to-slate-700 text-white rounded-xl hover:from-[#0C2C55]/90 hover:to-slate-600 transition-all duration-200 shadow-lg shadow-[#0C2C55]/25 text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Content
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {statusTabs.map(({ key, label, icon: Icon }) => {
            const count = getStatusCount(key);
            const isActive = currentStatus === key || (!currentStatus && !key);
            
            return (
              <Link
                key={key || 'all'}
                href={key ? `/admin/content?status=${key}` : '/admin/content'}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0C2C55] text-white shadow-lg shadow-[#0C2C55]/25'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-md ${
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Content List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {content.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentStatus ? `No ${currentStatus.toLowerCase()} content` : 'No content found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {currentStatus ? (
                  <Link href="/admin/content" className="text-[#0C2C55] hover:underline">
                    View all content →
                  </Link>
                ) : (
                  'Create your first piece of content to get started.'
                )}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {content.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <FeaturedButton 
                          contentId={item.id} 
                          isFeatured={item.featured || false} 
                          size="sm"
                          showLabel={false}
                        />
                        <Link
                          href={`/admin/content/${item.id}`}
                          className="text-base font-semibold text-gray-900 hover:text-[#0C2C55] transition-colors line-clamp-2 flex-1"
                        >
                          {item.title}
                        </Link>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                      
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                          item.type === 'ARTICLE' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'CASE_STUDY' ? 'bg-emerald-100 text-emerald-700' :
                          item.type === 'BOOK' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                          item.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                          item.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                          item.status === 'REVIEW' ? 'bg-amber-100 text-amber-700' :
                          item.status === 'ARCHIVED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.authors?.[0]?.author?.name || 'Unknown author'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(item.updatedAt)}
                        </span>
                        {(item.viewCount ?? 0) > 0 && (
                          <span className="flex items-center text-xs text-gray-400">
                            <EyeIcon className="w-3 h-3 mr-0.5" />
                            {item.viewCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:flex-shrink-0">
                      {item.status === 'DRAFT' && (
                        <button
                          onClick={() => handleReviewClick(item)}
                          className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          Send to Review
                        </button>
                      )}
                      {item.status === 'REVIEW' && (
                        <button
                          onClick={() => handleReviewClick(item)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Review
                        </button>
                      )}
                      {item.status === 'PUBLISHED' && (
                        <Link
                          href={`/articles/${item.slug}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Live"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/content/${item.id}/edit`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <DeleteButton
                        action={`/api/admin/content/${item.id}/delete`}
                        itemName="content"
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
