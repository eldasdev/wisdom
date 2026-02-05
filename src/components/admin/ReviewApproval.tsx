'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  NewspaperIcon,
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface PendingContent {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  authors: Array<{ author: { name: string; email?: string } }>;
}

interface PendingJournal {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
}

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ReviewData {
  content: PendingContent[];
  journals: PendingJournal[];
  users: PendingUser[];
}

export function ReviewApproval() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReviewData>({ content: [], journals: [], users: [] });
  const [selectedItem, setSelectedItem] = useState<{ type: string; item: any } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'journals' | 'users'>('content');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/review/pending');
      if (!response.ok) throw new Error('Failed to fetch pending items');
      const data = await response.json();
      setData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type: string, id: string) => {
    try {
      const response = await fetch(`/api/admin/review/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve');
      }

      setSuccess(`${type} approved successfully`);
      setSelectedItem(null);
      fetchPendingItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleReject = async (type: string, id: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/review/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, reason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject');
      }

      setSuccess(`${type} rejected`);
      setSelectedItem(null);
      fetchPendingItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const getPendingCount = () => {
    return data.content.length + data.journals.length + data.users.length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading pending items...</span>
        </div>
      </div>
    );
  }

  const totalPending = getPendingCount();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Review & Approval</h2>
              <p className="text-sm text-gray-600">
                {totalPending} {totalPending === 1 ? 'item' : 'items'} pending review
              </p>
            </div>
          </div>
          {totalPending > 0 && (
            <span className="px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">
              {totalPending}
            </span>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {totalPending === 0 ? (
        <div className="p-12 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">No items pending review at this time.</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  Content ({data.content.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('journals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'journals'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <NewspaperIcon className="w-5 h-5" />
                  Journals ({data.journals.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Users ({data.users.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                {data.content.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No content pending review
                  </div>
                ) : (
                  data.content.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedItem({ type: 'content', item })}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Type: {item.type.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{item.authors.map(a => a.author.name).join(', ')}</span>
                            <span>•</span>
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove('content', item.id);
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject('content', item.id);
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Journals Tab */}
            {activeTab === 'journals' && (
              <div className="space-y-3">
                {data.journals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No journals pending review
                  </div>
                ) : (
                  data.journals.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedItem({ type: 'journal', item })}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            Created: {formatDate(item.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove('journal', item.id);
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject('journal', item.id);
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-3">
                {data.users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No new users pending review
                  </div>
                ) : (
                  data.users.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedItem({ type: 'user', item })}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.email}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Role: {item.role}</span>
                            <span>•</span>
                            <span>Created: {formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove('user', item.id);
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject('user', item.id);
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Quick View</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {selectedItem.type === 'content' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedItem.item.title}</h4>
                    <p className="text-gray-600">{selectedItem.item.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">{selectedItem.item.type.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium">{selectedItem.item.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Authors:</span>
                      <span className="ml-2 font-medium">
                        {selectedItem.item.authors.map((a: any) => a.author.name).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedItem.item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove('content', selectedItem.item.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => {
                        handleReject('content', selectedItem.item.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                    <Link
                      href={`/admin/content/${selectedItem.item.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              )}
              {selectedItem.type === 'journal' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedItem.item.title}</h4>
                    {selectedItem.item.description && (
                      <p className="text-gray-600">{selectedItem.item.description}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(selectedItem.item.createdAt)}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove('journal', selectedItem.item.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => {
                        handleReject('journal', selectedItem.item.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                    <Link
                      href={`/admin/journals/${selectedItem.item.id}/edit`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              )}
              {selectedItem.type === 'user' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedItem.item.name}</h4>
                    <p className="text-gray-600">{selectedItem.item.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <span className="ml-2 font-medium">{selectedItem.item.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedItem.item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove('user', selectedItem.item.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject('user', selectedItem.item.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                    <Link
                      href={`/admin/users/${selectedItem.item.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
