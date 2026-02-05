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
    redirect('/auth/signin');
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
      title: 'In Review',
      value: contentItems.filter(c => c.status === 'REVIEW').length,
      icon: EyeIcon,
      color: 'from-orange-500 to-amber-600',
    },
    {
      title: 'Drafts',
      value: contentItems.filter(c => c.status === 'DRAFT').length,
      icon: ClockIcon,
      color: 'from-gray-500 to-slate-600',
    },
  ];

  const recentContent = contentItems
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Author Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your content.</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 text-sm font-medium"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          Create Content
        </Link>
      </div>

      {/* Stats Grid - 2 columns on mobile */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/create"
          className="group bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PlusCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Create Content
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Write a new article</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/content"
          className="group bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FolderOpenIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Manage Content
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Edit your work</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Update Profile
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Manage your info</p>
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
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No content yet</p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center mt-4 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Create your first piece
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContent.map((content) => (
                <Link
                  key={content.id}
                  href={`/dashboard/content/${content.id}`}
                  className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {content.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate group-hover:text-emerald-600 transition-colors">
                        {content.title}
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
                        {content.featured && (
                          <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {(content.viewCount ?? 0) > 0 && (
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
  );
}
