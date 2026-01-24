'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

type UserRole = 'USER' | 'AUTHOR' | 'ADMIN';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  createAuthorProfile: boolean;
  // Author profile fields
  authorTitle?: string;
  authorInstitution?: string;
  authorBio?: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    createAuthorProfile: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.password) {
      return 'Password is required';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
          createAuthorProfile: formData.createAuthorProfile,
          authorTitle: formData.authorTitle?.trim(),
          authorInstitution: formData.authorInstitution?.trim(),
          authorBio: formData.authorBio?.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'USER', label: 'User', description: 'Basic access to view content' },
    { value: 'AUTHOR', label: 'Author', description: 'Can create and manage their own content' },
    { value: 'ADMIN', label: 'Admin', description: 'Full access to manage all content and users' },
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
        <p className="text-gray-600 mt-1">Add a new user to the system</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-gray-400" />
            Password
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Minimum 8 characters"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
            Role & Permissions
          </h2>

          <div className="space-y-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.role === role.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={formData.role === role.value}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">{role.label}</span>
                  <span className="block text-sm text-gray-500">{role.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Author Profile Option */}
        {(formData.role === 'AUTHOR' || formData.role === 'ADMIN') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="createAuthorProfile"
                name="createAuthorProfile"
                checked={formData.createAuthorProfile}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="createAuthorProfile" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Create Author Profile</span>
                <span className="block text-sm text-gray-500">
                  Set up an author profile so this user can publish content
                </span>
              </label>
            </div>

            {formData.createAuthorProfile && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                <div>
                  <label htmlFor="authorTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    id="authorTitle"
                    name="authorTitle"
                    value={formData.authorTitle || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Professor, Research Fellow"
                  />
                </div>

                <div>
                  <label htmlFor="authorInstitution" className="block text-sm font-medium text-gray-700 mb-1">
                    Institution / Organization
                  </label>
                  <input
                    type="text"
                    id="authorInstitution"
                    name="authorInstitution"
                    value={formData.authorInstitution || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Harvard Business School"
                  />
                </div>

                <div>
                  <label htmlFor="authorBio" className="block text-sm font-medium text-gray-700 mb-1">
                    Biography
                  </label>
                  <textarea
                    id="authorBio"
                    name="authorBio"
                    value={formData.authorBio || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Brief biography about the author..."
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/users"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <UserPlusIcon className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}
