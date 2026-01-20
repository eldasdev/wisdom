'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

type ContentType = 'ARTICLE' | 'CASE_STUDY' | 'BOOK' | 'BOOK_CHAPTER' | 'TEACHING_NOTE';

interface ContentFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  type: ContentType;
  tags: string[];
  status: string;
  // Type-specific fields
  category?: string;
  industry?: string;
  company?: string;
  isbn?: string;
  publisher?: string;
  pages?: number;
  learningObjectives?: string[];
  relatedContentId?: string;
  chapterNumber?: number;
  pageRange?: string;
}

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    type: 'ARTICLE',
    tags: [],
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/dashboard/content/${contentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();

      const content = data.content;
      const metadata = content.metadata || {};

      setFormData({
        title: content.title,
        slug: content.slug,
        description: content.description,
        content: content.content,
        type: content.type,
        tags: content.tags.map((ct: any) => ct.tag.name),
        status: content.status,
        // Extract metadata fields
        category: metadata.category,
        industry: metadata.industry,
        company: metadata.company,
        isbn: metadata.isbn,
        publisher: metadata.publisher,
        pages: metadata.pages,
        learningObjectives: metadata.learningObjectives,
        relatedContentId: metadata.relatedContentId || metadata.bookId,
        chapterNumber: metadata.chapterNumber,
        pageRange: metadata.pageRange,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setIsFetching(false);
    }
  };

  const handleTitleChange = (title: string) => {
    // Auto-generate slug from title if not manually changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({
      ...prev,
      title,
      // Only update slug if it hasn't been manually changed
      ...(prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() && { slug })
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleLearningObjectivesChange = (objectivesString: string) => {
    const learningObjectives = objectivesString
      .split('\n')
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0);
    setFormData(prev => ({ ...prev, learningObjectives }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare metadata based on content type
      const metadata: any = {};
      if (formData.type === 'ARTICLE' && formData.category) {
        metadata.category = formData.category;
      }
      if (formData.type === 'CASE_STUDY') {
        if (formData.industry) metadata.industry = formData.industry;
        if (formData.company) metadata.company = formData.company;
        if (formData.learningObjectives) metadata.learningObjectives = formData.learningObjectives;
      }
      if (formData.type === 'BOOK') {
        if (formData.isbn) metadata.isbn = formData.isbn;
        if (formData.publisher) metadata.publisher = formData.publisher;
        if (formData.pages) metadata.pages = formData.pages;
      }
      if (formData.type === 'BOOK_CHAPTER') {
        if (formData.chapterNumber) metadata.chapterNumber = formData.chapterNumber;
        if (formData.pageRange) metadata.pageRange = formData.pageRange;
        if (formData.relatedContentId) metadata.bookId = formData.relatedContentId;
      }
      if (formData.type === 'TEACHING_NOTE' && formData.relatedContentId) {
        metadata.relatedContentId = formData.relatedContentId;
        metadata.relatedContentType = 'article';
      }

      const response = await fetch(`/api/dashboard/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          content: formData.content,
          tags: formData.tags,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update content');
      }

      setSuccess('Content updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/content');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

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
      setError(err instanceof Error ? err.message : 'Failed to delete content');
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
          <p className="text-gray-600 mt-2">Make changes to your content</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/content/${contentId}`}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Back to Content
          </Link>
          <Link
            href="/dashboard/content"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← All Content
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 ${
        formData.status === 'PUBLISHED'
          ? 'bg-green-50 border border-green-200'
          : formData.status === 'REVIEW'
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            formData.status === 'PUBLISHED'
              ? 'bg-green-100 text-green-800'
              : formData.status === 'REVIEW'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {formData.status}
          </span>
          <span className="ml-3 text-sm">
            {formData.status === 'PUBLISHED'
              ? 'This content is live and visible to all users.'
              : formData.status === 'REVIEW'
              ? 'This content is under review by administrators.'
              : 'This is a draft. Save your changes and submit for review when ready.'
            }
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                value={formData.type}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              >
                <option value={formData.type}>{formData.type.replace('_', ' ')}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Content type cannot be changed after creation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Type-Specific Fields */}
        {formData.type === 'ARTICLE' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Article Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {formData.type === 'CASE_STUDY' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Study Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Objectives
                </label>
                <textarea
                  value={formData.learningObjectives?.join('\n') || ''}
                  onChange={(e) => handleLearningObjectivesChange(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === 'BOOK' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pages
                </label>
                <input
                  type="number"
                  value={formData.pages || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Content *</h2>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Write your content here..."
            className="min-h-[400px]"
          />
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={formData.status !== 'DRAFT'}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Content
          </button>

          <div className="flex space-x-3">
            <Link
              href="/dashboard/content"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}