'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { DateFormatter } from '@/components/admin/DateFormatter';
import { TrashIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: boolean | null;
  createdAt: string;
  _count: {
    accounts: number;
  };
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; user: User | null }>({
    show: false,
    user: null,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users?limit=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteModal({ show: false, user: null });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const handleDelete = () => {
    if (deleteModal.user) {
      deleteMutation.mutate(deleteModal.user.id);
    }
  };

  const users: User[] = data?.users || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user accounts and permissions</p>
        </div>
        <Link
          href="/admin/users/create"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">All Users ({users.length})</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Failed to load users</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'No name'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className={`flex-shrink-0 ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${
                  user.role === 'ADMIN'
                    ? 'bg-red-100 text-red-800'
                    : user.role === 'AUTHOR'
                    ? 'bg-blue-100 text-blue-800'
                    : user.role === 'EDITOR'
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === 'REVIEWER'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                    user.emailVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                  <span className="text-xs text-gray-400">
                    <DateFormatter date={user.createdAt} />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ show: true, user })}
                    className="text-xs text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
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
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'No name'}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'AUTHOR'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'EDITOR'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'REVIEWER'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.emailVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <DateFormatter date={user.createdAt} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ show: true, user })}
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
      {deleteModal.show && deleteModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete User
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <strong>{deleteModal.user.name || deleteModal.user.email}</strong>? This action cannot be undone.
              {deleteModal.user.role === 'ADMIN' && (
                <span className="block mt-2 text-red-600">
                  Warning: This is an admin account. Make sure there are other admins before deleting.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, user: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}