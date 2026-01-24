'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { PdfUploader } from '@/components/PdfUploader';
import { TagsInput } from '@/components/TagsInput';

type ContentType = 'ARTICLE' | 'CASE_STUDY' | 'BOOK' | 'BOOK_CHAPTER' | 'TEACHING_NOTE';

interface ContentFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  type: ContentType;
  tags: string[];
  // PDF file
  pdfUrl?: string;
  pdfFileName?: string;
  // Common metadata fields
  industry?: string;
  company?: string;
  sector?: string;
  region?: string;
  country?: string;
  category?: string;
  topic?: string;
  subject?: string;
  // Type-specific fields
  isbn?: string; // For books
  publisher?: string; // For books
  pages?: number; // For books
  learningObjectives?: string[]; // For case studies
  relatedContentId?: string; // For teaching notes
  chapterNumber?: number; // For book chapters
  pageRange?: string; // For book chapters
}

export default function CreateContentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    type: 'ARTICLE',
    tags: [],
  });

  const [tagsInput, setTagsInput] = useState('');

  const contentTypes = [
    { value: 'ARTICLE', label: 'Article', description: 'Research articles and insights' },
    { value: 'CASE_STUDY', label: 'Case Study', description: 'Real-world business cases' },
    { value: 'BOOK', label: 'Book', description: 'Complete book publications' },
    { value: 'BOOK_CHAPTER', label: 'Book Chapter', description: 'Individual book chapters' },
    { value: 'TEACHING_NOTE', label: 'Teaching Note', description: 'Educational materials' },
  ];

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({
      ...prev,
      title,
      slug: slug || prev.slug
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    setTagsInput(tagsString);
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Sync tags input with form data
  useEffect(() => {
    setTagsInput(formData.tags.join(', '));
  }, [formData.tags]);

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

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.content) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare metadata
      const metadata: any = {};

      // Common metadata fields
      if (formData.industry) metadata.industry = formData.industry;
      if (formData.company) metadata.company = formData.company;
      if (formData.sector) metadata.sector = formData.sector;
      if (formData.region) metadata.region = formData.region;
      if (formData.country) metadata.country = formData.country;
      if (formData.category) metadata.category = formData.category;
      if (formData.topic) metadata.topic = formData.topic;
      if (formData.subject) metadata.subject = formData.subject;

      // Type-specific fields
      if (formData.type === 'CASE_STUDY') {
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
        metadata.relatedContentType = 'article'; // Default, could be made dynamic
      }

      const response = await fetch('/api/dashboard/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create content');
      }

      const result = await response.json();
      router.push(`/dashboard/content/${result.content.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'ARTICLE':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Strategy & Execution, Leadership, Innovation"
                required
              />
            </div>
          </div>
        );

      case 'CASE_STUDY':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry *
              </label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Technology, Healthcare, Finance"
                required
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
                placeholder="Company name (optional)"
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
                placeholder="Enter each learning objective on a new line"
              />
            </div>
          </div>
        );

      case 'BOOK':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ISBN-13 (optional)"
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
                placeholder="Publisher name"
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
                placeholder="Number of pages"
                min="1"
              />
            </div>
          </div>
        );

      case 'BOOK_CHAPTER':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book ID *
              </label>
              <input
                type="text"
                value={formData.relatedContentId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedContentId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID of the parent book"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chapter Number *
              </label>
              <input
                type="number"
                value={formData.chapterNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, chapterNumber: parseInt(e.target.value) || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chapter number"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Range
              </label>
              <input
                type="text"
                value={formData.pageRange || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pageRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 45-67"
              />
            </div>
          </div>
        );

      case 'TEACHING_NOTE':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Content ID *
              </label>
              <input
                type="text"
                value={formData.relatedContentId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedContentId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID of the related article or case study"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="text-gray-600 mt-2">Share your knowledge with the Wisdom community</p>
        </div>
        <Link
          href="/dashboard/content"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          ← Back to Content
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {contentTypes.find(t => t.value === formData.type)?.description}
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
                placeholder="Enter a compelling title"
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
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in the URL: /content-type/your-slug-here
            </p>
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
              placeholder="Brief description of your content"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <TagsInput
              tags={formData.tags}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              placeholder="Type a tag and press Enter"
            />
          </div>
        </div>

        {/* Type-Specific Fields */}
        {renderTypeSpecificFields() && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {contentTypes.find(t => t.value === formData.type)?.label} Details
            </h2>
            {renderTypeSpecificFields()}
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
          <p className="text-xs text-gray-500 mt-2">
            Use the toolbar above to format your content. Supports headings, lists, bold, italic, and more.
          </p>
        </div>

        {/* PDF Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">PDF Document (Optional)</h2>
          <PdfUploader
            currentPdfUrl={formData.pdfUrl}
            currentPdfFileName={formData.pdfFileName}
            onUploadComplete={(url, fileName) => {
              setFormData(prev => ({ ...prev, pdfUrl: url || undefined, pdfFileName: fileName || undefined }));
            }}
            onUploadError={(errorMsg) => {
              setError(errorMsg);
            }}
          />
          <p className="text-xs text-gray-500 mt-3">
            Upload a PDF version of your content. This will be available for viewing and download on the content page.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
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
            {isLoading ? 'Creating...' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  );
}