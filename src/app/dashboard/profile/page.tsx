import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  Cog6ToothIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default async function AuthorProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const authorProfile = await prisma.author.findUnique({
    where: { email: session.user.email! },
    include: {
      _count: {
        select: {
          authoredContent: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/');
  }

  const contentStats = await prisma.content.groupBy({
    by: ['status'],
    where: {
      authors: {
        some: {
          authorId: authorProfile?.id,
        },
      },
    },
    _count: {
      status: true,
    },
  });

  const stats = {
    total: contentStats.reduce((sum, stat) => sum + stat._count.status, 0),
    published: contentStats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
    draft: contentStats.find(s => s.status === 'DRAFT')?._count.status || 0,
    review: contentStats.find(s => s.status === 'REVIEW')?._count.status || 0,
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold">
            {user.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
            <p className="text-emerald-100 mt-1">{authorProfile?.title || 'Author'}</p>
            <p className="text-emerald-100/80 text-sm mt-1">{authorProfile?.institution || ''}</p>
          </div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium"
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500 mt-1">Total Content</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.published}</p>
              <p className="text-sm text-gray-500 mt-1">Published</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.review}</p>
              <p className="text-sm text-gray-500 mt-1">In Review</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.draft}</p>
              <p className="text-sm text-gray-500 mt-1">Drafts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
            </div>
            {authorProfile?.institution && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Institution</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{authorProfile.institution}</p>
                </div>
              </div>
            )}
            {authorProfile?.website && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Website</p>
                  <a href={authorProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 truncate block">
                    {authorProfile.website}
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            
            {authorProfile?.bio && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Bio</p>
                <p className="text-sm text-gray-700 leading-relaxed">{authorProfile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/dashboard/content"
              className="flex items-center w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">View My Content</p>
                <p className="text-xs text-gray-500">Manage your works</p>
              </div>
            </Link>
            <Link
              href="/dashboard/create"
              className="flex items-center w-full p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Create Content</p>
                <p className="text-xs text-gray-500">Write something new</p>
              </div>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cog6ToothIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Account Settings</p>
                <p className="text-xs text-gray-500">Update your info</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
