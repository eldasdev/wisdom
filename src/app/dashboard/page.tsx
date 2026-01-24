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
  const inReviewCount = contentItems.filter(c => c.status === 'REVIEW').length;

  const stats = [
    {
      title: 'Total Content',
      value: contentItems.length,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Published',
      value: contentItems.filter(c => c.status === 'PUBLISHED').length,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
    },
    {
      title: 'In Review',
      value: inReviewCount,
      icon: EyeIcon,
      color: 'bg-orange-500',
    },
    {
      title: 'Drafts',
      value: contentItems.filter(c => c.status === 'DRAFT').length,
      icon: ClockIcon,
      color: 'bg-gray-400',
    },
  ];

  const recentContent = contentItems
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Author Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your content.</p>
      </div>

      {/* Create Content Button - Full width on mobile */}
      <Link
        href="/dashboard/create"
        className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 mb-6"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        Create Content
      </Link>

      {/* Stats Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions - Stack on mobile */}
      <div className="space-y-3 mb-6">
        <Link
          href="/dashboard/create"
          className="flex items-center bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-emerald-200 transition-all"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <PlusCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-900">Create Content</h3>
            <p className="text-sm text-gray-500">Write a new article or case study</p>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/dashboard/content"
          className="flex items-center bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-emerald-200 transition-all"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <FolderOpenIcon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-900">Manage Content</h3>
            <p className="text-sm text-gray-500">Edit and organize your work</p>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex items-center bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-emerald-200 transition-all"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-900">Update Profile</h3>
            <p className="text-sm text-gray-500">Manage your author info</p>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <ClockIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Recent Content</h2>
          </div>
          <Link href="/dashboard/content" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
            View all
            <ArrowRightIcon className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentContent.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No content yet</h3>
              <p className="text-sm text-gray-500 mb-4">Start creating your first piece of content!</p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Create your first piece
              </Link>
            </div>
          ) : (
            recentContent.map((content) => (
              <Link
                key={content.id}
                href={`/dashboard/content/${content.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">
                      {content.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        content.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : content.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {content.status}
                      </span>
                      {content.featured && (
                        <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
