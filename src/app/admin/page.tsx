import { prisma } from '@/lib/prisma';
import { DateFormatter } from '@/components/admin/DateFormatter';
import Link from 'next/link';
import {
  UserGroupIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalAuthors,
    totalContent,
    publishedContent,
    draftContent,
    reviewContent,
    recentUsers,
    recentContent
  ] = await Promise.all([
    prisma.user.count(),
    prisma.author.count(),
    prisma.content.count(),
    prisma.content.count({ where: { status: 'PUBLISHED' } }),
    prisma.content.count({ where: { status: 'DRAFT' } }),
    prisma.content.count({ where: { status: 'REVIEW' } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    }),
    prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true,
        viewCount: true,
        authors: {
          include: {
            author: {
              select: { name: true }
            }
          }
        }
      }
    })
  ]);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: UsersIcon,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Authors',
      value: totalAuthors,
      icon: PencilSquareIcon,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Total Content',
      value: totalContent,
      icon: DocumentTextIcon,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Published',
      value: publishedContent,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'In Review',
      value: reviewContent,
      icon: EyeIcon,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Drafts',
      value: draftContent,
      icon: ClockIcon,
      color: 'from-gray-500 to-slate-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your platform.</p>
        </div>
        <Link
          href="/admin/content/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#0C2C55] to-slate-700 text-white rounded-xl hover:from-[#0C2C55]/90 hover:to-slate-600 transition-all duration-200 shadow-lg shadow-[#0C2C55]/25 text-sm font-medium"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          Create Content
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
          >
            <div className="flex flex-col">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <UsersIcon className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            </div>
            <Link href="/admin/users" className="text-sm text-[#0C2C55] hover:text-[#0C2C55]/80 font-medium flex items-center">
              View all
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="p-4 sm:p-6">
            {recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <UserCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No users yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${
                        user.role === 'ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : user.role === 'AUTHOR'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        <DateFormatter date={user.createdAt} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <DocumentTextIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
            </div>
            <Link href="/admin/content" className="text-sm text-[#0C2C55] hover:text-[#0C2C55]/80 font-medium flex items-center">
              View all
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="p-4 sm:p-6">
            {recentContent.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No content yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentContent.map((content) => (
                  <Link
                    key={content.id}
                    href={`/admin/content/${content.id}`}
                    className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-[#0C2C55] transition-colors" title={content.title}>
                          {content.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {content.authors.map(ca => ca.author.name).join(', ') || 'No author'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                            content.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700'
                              : content.status === 'DRAFT'
                              ? 'bg-gray-100 text-gray-700'
                              : content.status === 'REVIEW'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {content.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {content.type.replace('_', ' ')}
                          </span>
                          {content.viewCount > 0 && (
                            <span className="flex items-center text-xs text-gray-400">
                              <EyeIcon className="w-3 h-3 mr-0.5" />
                              {content.viewCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/content/create"
          className="group p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <DocumentTextIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">New Article</p>
          <p className="text-xs text-white/70 mt-0.5">Create content</p>
        </Link>
        <Link
          href="/admin/users"
          className="group p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
        >
          <UsersIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Manage Users</p>
          <p className="text-xs text-white/70 mt-0.5">View all users</p>
        </Link>
        <Link
          href="/admin/authors"
          className="group p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <PencilSquareIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Authors</p>
          <p className="text-xs text-white/70 mt-0.5">Manage authors</p>
        </Link>
        <Link
          href="/analytics"
          className="group p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
        >
          <ArrowTrendingUpIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Analytics</p>
          <p className="text-xs text-white/70 mt-0.5">View insights</p>
        </Link>
      </div>
    </div>
  );
}
