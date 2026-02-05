'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  NewspaperIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface Journal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
  featured: boolean;
  issn?: string;
  eissn?: string;
  publisher?: string;
  frequency?: string;
  openAccess: boolean;
  _count?: {
    content: number;
  };
  createdAt: string;
}

export default function AdminJournalsPage() {
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; journal: Journal | null }>({
    show: false,
    journal: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchJournals();
  }, [statusFilter]);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter) params.set('status', statusFilter);
      
      const response = await fetch(`/api/admin/journals?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch journals');
      const data = await response.json();
      setJournals(data.journals || []);
    } catch (err) {
      setError('Failed to load journals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.journal) return;

    try {
      const response = await fetch(`/api/admin/journals/${deleteModal.journal.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete journal');
      }

      setSuccess('Journal deleted successfully');
      setDeleteModal({ show: false, journal: null });
      fetchJournals();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJournals = journals.filter(journal => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      journal.title.toLowerCase().includes(query) ||
      journal.description?.toLowerCase().includes(query) ||
      journal.issn?.toLowerCase().includes(query) ||
      journal.slug.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Journal Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage academic journals and publications</p>
        </div>
        <Link
          href="/admin/journals/create"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Journal
        </Link>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journals by title, description, or ISSN..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Journals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading journals...</p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="p-8 text-center">
            <NewspaperIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery || statusFilter ? 'No journals found matching your filters' : 'No journals yet. Create your first journal above.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredJournals.map((journal) => (
                <div key={journal.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {journal.title}
                      </h3>
                      {journal.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {journal.description}
                        </p>
                      )}
                    </div>
                    <span className={`flex-shrink-0 ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(journal.status)}`}>
                      {journal.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{journal._count?.content || 0} articles</span>
                    <span>{formatDate(journal.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/journals/${journal.slug}`}
                      target="_blank"
                      className="text-xs text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                    >
                      <EyeIcon className="w-3 h-3" />
                      View
                    </Link>
                    <Link
                      href={`/admin/journals/${journal.id}/edit`}
                      className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ show: true, journal })}
                      className="text-xs text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Journal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJournals.map((journal) => (
                    <tr key={journal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {journal.title}
                            {journal.featured && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          {journal.description && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {journal.description}
                            </div>
                          )}
                          {journal.issn && (
                            <div className="text-xs text-gray-400 mt-1">
                              ISSN: {journal.issn}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(journal.status)}`}>
                          {journal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {journal._count?.content || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(journal.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/journals/${journal.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <EyeIcon className="w-4 h-4" />
                            View
                          </Link>
                          <Link
                            href={`/admin/journals/${journal.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, journal })}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.journal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete Journal
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <strong>{deleteModal.journal.title}</strong>? 
              {deleteModal.journal._count && deleteModal.journal._count.content > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This journal has {deleteModal.journal._count.content} articles. 
                  You must remove or reassign them first.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, journal: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteModal.journal._count && deleteModal.journal._count.content > 0}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
