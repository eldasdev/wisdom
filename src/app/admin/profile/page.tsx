import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DateFormatter } from '@/components/admin/DateFormatter';
import {
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  CalendarIcon,
  ClockIcon,
  Cog6ToothIcon,
  PlusIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    redirect('/');
  }

  // Get platform stats
  const [totalUsers, totalContent, totalAuthors] = await Promise.all([
    prisma.user.count(),
    prisma.content.count(),
    prisma.author.count(),
  ]);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0C2C55] to-slate-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <ShieldCheckIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
              <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                {user.role}
              </span>
            </div>
            <p className="text-slate-300">{user.email}</p>
            <div className="flex items-center mt-2 text-sm text-slate-400">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium"
          >
            <Cog6ToothIcon className="w-4 h-4 mr-2" />
            Edit Settings
          </Link>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-sm text-gray-500 mt-1">Total Users</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalContent}</p>
              <p className="text-sm text-gray-500 mt-1">Total Content</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalAuthors}</p>
              <p className="text-sm text-gray-500 mt-1">Authors</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Role</p>
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckBadgeIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-lg ${
                  user.emailVerified 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {user.emailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Account Created</p>
                <p className="text-sm font-medium text-gray-900">
                  <DateFormatter date={user.createdAt} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  <DateFormatter date={user.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/admin/content/create"
              className="flex items-center w-full p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Create Content</p>
                <p className="text-xs text-gray-500">Add new article or case study</p>
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">View and edit users</p>
              </div>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-xs text-gray-500">Platform insights</p>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cog6ToothIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-xs text-gray-500">Update account settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
