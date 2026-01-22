import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  StarIcon,
  UserIcon,
  PlusCircleIcon,
  FolderOpenIcon,
  EyeIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default async function AuthorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const authorProfile = await prisma.author.findUnique({
    where: { email: session.user.email! },
    include: {
      authoredContent: {
        include: {
          content: {
            select: {
              id: true,
              title: true,
              type: true,
              status: true,
              publishedAt: true,
              featured: true,
              viewCount: true
            }
          }
        }
      }
    }
  });

  if (!authorProfile) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 mb-6">Your author profile needs to be set up.</p>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Set Up Profile
        </Link>
      </div>
    );
  }

  const contentItems = authorProfile.authoredContent.map(ac => ac.content);
  const totalViews = contentItems.reduce((sum, c) => sum + (c.viewCount || 0), 0);

  const stats = [
    {
      title: 'Total Content',
      value: contentItems.length,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Published',
      value: contentItems.filter(c => c.status === 'PUBLISHED').length,
      icon: CheckCircleIcon,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Drafts',
      value: contentItems.filter(c => c.status === 'DRAFT').length,
      icon: PencilSquareIcon,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: EyeIcon,
      color: 'from-purple-500 to-violet-600',
    }
  ];

  const recentContent = contentItems
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {session.user.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-emerald-100">
                Ready to create something amazing today?
              </p>
            </div>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center justify-center px-5 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Create Content
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/create"
          className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PlusCircleIcon className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Create Content
              </h3>
              <p className="text-sm text-gray-500">Write a new article or case study</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/content"
          className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FolderOpenIcon className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Manage Content
              </h3>
              <p className="text-sm text-gray-500">Edit and organize your work</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserIcon className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Update Profile
              </h3>
              <p className="text-sm text-gray-500">Manage your author info</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <ClockIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
          </div>
          <Link href="/dashboard/content" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
            View all
            <ArrowRightIcon className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="p-4 sm:p-6">
          {recentContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first piece of content!</p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Create your first piece
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContent.map((content) => (
                <Link
                  key={content.id}
                  href={`/dashboard/content/${content.id}`}
                  className="block p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                        {content.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                          content.type === 'ARTICLE'
                            ? 'bg-blue-100 text-blue-700'
                            : content.type === 'CASE_STUDY'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {content.type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                          content.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : content.status === 'DRAFT'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {content.status}
                        </span>
                        {content.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-md">
                            <StarIcon className="w-3 h-3 mr-0.5" />
                            Featured
                          </span>
                        )}
                        {(content.viewCount ?? 0) > 0 && (
                          <span className="flex items-center text-xs text-gray-400">
                            <EyeIcon className="w-3 h-3 mr-0.5" />
                            {content.viewCount} views
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
