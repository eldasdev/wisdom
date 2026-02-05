'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type UserRole = 'USER' | 'AUTHOR' | 'ADMIN' | 'REVIEWER' | 'EDITOR';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  emailVerified: boolean | null;
  createdAt: string;
  author?: {
    id: string;
    title: string | null;
    institution: string | null;
    bio: string | null;
  } | null;
}

export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as UserRole,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const { data, isLoading, error } = useQuery<{ user: User }>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        password: '',
        confirmPassword: '',
        role: (data.user.role as UserRole) || 'USER',
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const updatePayload: any = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
      };

      // Only include password if it's provided
      if (data.password) {
        if (data.password !== data.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (data.password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        updatePayload.password = data.password;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSuccessMessage('User updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/admin/users');
      }, 2000);
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/admin/users');
    },
    onError: (error: Error) => {
      setErrors({ delete: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    if (formData.password && formData.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'USER', label: 'User', description: 'Basic access to view content' },
    { value: 'AUTHOR', label: 'Author', description: 'Can create and manage their own content' },
    { value: 'EDITOR', label: 'Editor', description: 'Can edit, review, and moderate content' },
    { value: 'REVIEWER', label: 'Reviewer', description: 'Can review and moderate content' },
    { value: 'ADMIN', label: 'Admin', description: 'Full access to manage all content and users' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">User not found</p>
        <Link href="/admin/users" className="text-blue-600 hover:text-blue-500">
          ← Back to Users
        </Link>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-600 mt-1">Update user information and permissions</p>
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
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-400" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
            Role & Permissions
          </h2>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              User Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {roles.find(r => r.value === formData.role)?.description}
            </p>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-gray-400" />
            Change Password (Optional)
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Leave blank to keep the current password
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {/* Author Profile Info (if exists) */}
        {user.author && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Author Profile</h2>
            <p className="text-sm text-gray-600 mb-2">
              This user has an associated author profile. To edit author details, go to the Authors section.
            </p>
            <Link
              href={`/admin/authors/${user.author.id}/edit`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit Author Profile →
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
          </button>
          <div className="flex gap-3">
            <Link
              href="/admin/users"
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
