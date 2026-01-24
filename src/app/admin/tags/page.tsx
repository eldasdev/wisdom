'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TagIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface Tag {
  id: string;
  name: string;
  _count?: {
    content: number;
  };
  createdAt: string;
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      setError('Failed to load tags');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create tag');
      }

      setNewTagName('');
      setSuccess('Tag created successfully');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTag = async (tagId: string) => {
    if (!editTagName.trim()) return;

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editTagName.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update tag');
      }

      setEditingTag(null);
      setEditTagName('');
      setSuccess('Tag updated successfully');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all content.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete tag');
      }

      setSuccess('Tag deleted successfully');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTag(tag.id);
    setEditTagName(tag.name);
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setEditTagName('');
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags Management</h1>
          <p className="text-gray-600 mt-1">Manage tags for organizing content</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TagIcon className="w-5 h-5" />
          <span>{tags.length} tags</span>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Create New Tag */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Tag</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              placeholder="Enter tag name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleCreateTag}
            disabled={!newTagName.trim() || isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            {isCreating ? 'Creating...' : 'Create Tag'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading tags...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="p-8 text-center">
            <TagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery ? 'No tags found matching your search' : 'No tags yet. Create your first tag above.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <div key={tag.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    {editingTag === tag.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editTagName}
                          onChange={(e) => setEditTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTag(tag.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateTag(tag.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            <TagIcon className="w-3.5 h-3.5 mr-1" />
                            {tag.name}
                          </span>
                          <Link 
                            href={`/tags/${encodeURIComponent(tag.name)}`}
                            className="text-xs text-blue-600"
                          >
                            {tag._count?.content || 0} items
                          </Link>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditing(tag)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingTag === tag.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateTag(tag.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateTag(tag.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Save"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            title="Cancel"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            <TagIcon className="w-3.5 h-3.5 mr-1" />
                            {tag.name}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link 
                      href={`/tags/${encodeURIComponent(tag.name)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {tag._count?.content || 0} items
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(tag.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEditing(tag)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit tag"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id, tag.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete tag"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </div>
  );
}
