'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  NewspaperIcon,
  BookOpenIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Journal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  issn?: string;
  eissn?: string;
  publisher?: string;
  frequency?: string;
  language?: string;
  openAccess: boolean;
  impactFactor?: string;
  coverImage?: string;
  website?: string;
  submissionGuidelines?: string;
  scope?: string;
  indexedIn?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  order: number;
  _count?: {
    content: number;
  };
}

export default function EditJournalPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const journalId = params.id as string;

  const [formData, setFormData] = useState<Partial<Journal>>({
    title: '',
    slug: '',
    description: '',
    issn: '',
    eissn: '',
    publisher: '',
    frequency: '',
    language: '',
    openAccess: false,
    impactFactor: '',
    coverImage: '',
    website: '',
    submissionGuidelines: '',
    scope: '',
    indexedIn: '',
    status: 'DRAFT',
    featured: false,
    order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const { data, isLoading, error } = useQuery<{ journal: Journal }>({
    queryKey: ['journal', journalId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/journals/${journalId}`);
      if (!response.ok) {
        throw new Error('Journal not found');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (data?.journal) {
      setFormData({
        title: data.journal.title || '',
        slug: data.journal.slug || '',
        description: data.journal.description || '',
        issn: data.journal.issn || '',
        eissn: data.journal.eissn || '',
        publisher: data.journal.publisher || '',
        frequency: data.journal.frequency || '',
        language: data.journal.language || '',
        openAccess: data.journal.openAccess || false,
        impactFactor: data.journal.impactFactor || '',
        coverImage: data.journal.coverImage || '',
        website: data.journal.website || '',
        submissionGuidelines: data.journal.submissionGuidelines || '',
        scope: data.journal.scope || '',
        indexedIn: data.journal.indexedIn || '',
        status: data.journal.status || 'DRAFT',
        featured: data.journal.featured || false,
        order: data.journal.order || 0,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Journal>) => {
      const response = await fetch(`/api/admin/journals/${journalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update journal');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', journalId] });
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setSuccessMessage('Journal updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/admin/journals');
      }, 2000);
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/journals/${journalId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete journal');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      router.push('/admin/journals');
    },
    onError: (error: Error) => {
      setErrors({ delete: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    if (!formData.title?.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }
    if (!formData.slug?.trim()) {
      setErrors({ slug: 'Slug is required' });
      return;
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setErrors({ slug: 'Slug can only contain lowercase letters, numbers, and hyphens' });
      return;
    }

    // Clean up empty strings to null
    const payload: any = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description?.trim() || null,
      issn: formData.issn?.trim() || null,
      eissn: formData.eissn?.trim() || null,
      publisher: formData.publisher?.trim() || null,
      frequency: formData.frequency?.trim() || null,
      language: formData.language?.trim() || null,
      openAccess: formData.openAccess || false,
      impactFactor: formData.impactFactor?.trim() || null,
      coverImage: formData.coverImage?.trim() || null,
      website: formData.website?.trim() || null,
      submissionGuidelines: formData.submissionGuidelines?.trim() || null,
      scope: formData.scope?.trim() || null,
      indexedIn: formData.indexedIn?.trim() || null,
      status: formData.status || 'DRAFT',
      featured: formData.featured || false,
      order: formData.order || 0,
    };

    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading journal...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.journal) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Journal not found</p>
        <Link href="/admin/journals" className="text-blue-600 hover:text-blue-500">
          ← Back to Journals
        </Link>
      </div>
    );
  }

  const journal = data.journal;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/journals"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Journals
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Journal</h1>
        <p className="text-gray-600 mt-1">Update journal information and settings</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckIcon className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Error Messages */}
      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <XMarkIcon className="w-5 h-5" />
          {errors.submit}
        </div>
      )}

      {errors.delete && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <XMarkIcon className="w-5 h-5" />
          {errors.delete}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <NewspaperIcon className="w-5 h-5 text-gray-400" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Journal Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                pattern="[a-z0-9-]+"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
              <p className="mt-1 text-xs text-gray-500">Lowercase letters, numbers, and hyphens only</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the journal..."
              />
            </div>
          </div>
        </div>

        {/* Publication Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-gray-400" />
            Publication Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issn" className="block text-sm font-medium text-gray-700 mb-1">
                ISSN
              </label>
              <input
                type="text"
                id="issn"
                name="issn"
                value={formData.issn || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1234-5678"
              />
            </div>

            <div>
              <label htmlFor="eissn" className="block text-sm font-medium text-gray-700 mb-1">
                e-ISSN
              </label>
              <input
                type="text"
                id="eissn"
                name="eissn"
                value={formData.eissn || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1234-5679"
              />
            </div>

            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select frequency</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Bi-annual">Bi-annual</option>
                <option value="Annual">Annual</option>
                <option value="Continuous">Continuous</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                id="language"
                name="language"
                value={formData.language || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., English, Multi-lingual"
              />
            </div>

            <div>
              <label htmlFor="impactFactor" className="block text-sm font-medium text-gray-700 mb-1">
                Impact Factor
              </label>
              <input
                type="text"
                id="impactFactor"
                name="impactFactor"
                value={formData.impactFactor || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2.5"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
            Additional Information
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/journal-cover.jpg"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Journal Website URL
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/journal"
              />
            </div>

            <div>
              <label htmlFor="indexedIn" className="block text-sm font-medium text-gray-700 mb-1">
                Indexed In
              </label>
              <input
                type="text"
                id="indexedIn"
                name="indexedIn"
                value={formData.indexedIn || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Scopus, Web of Science, DOAJ"
              />
            </div>

            <div>
              <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                Scope & Aims
              </label>
              <textarea
                id="scope"
                name="scope"
                value={formData.scope || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the journal's scope and aims..."
              />
            </div>

            <div>
              <label htmlFor="submissionGuidelines" className="block text-sm font-medium text-gray-700 mb-1">
                Submission Guidelines (HTML supported)
              </label>
              <textarea
                id="submissionGuidelines"
                name="submissionGuidelines"
                value={formData.submissionGuidelines || ''}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Enter HTML or plain text for submission guidelines..."
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
            Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || 'DRAFT'}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="openAccess"
                  checked={formData.openAccess || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Open Access</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Journal</span>
              </label>
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first (0 = default)</p>
            </div>
          </div>
        </div>

        {/* Content Count Warning */}
        {journal._count && journal._count.content > 0 && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Journal Content</h3>
            <p className="text-sm text-blue-700">
              This journal has {journal._count.content} {journal._count.content === 1 ? 'article' : 'articles'}.
              Changing the status or deleting this journal will affect all associated content.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || (journal._count && journal._count.content > 0)}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Journal'}
          </button>
          <div className="flex gap-3">
            <Link
              href="/admin/journals"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
