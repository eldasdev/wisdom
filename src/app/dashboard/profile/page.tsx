import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AuthorProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Get user and author profile
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

  // Get content statistics
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
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Author Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="inline-block px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Author Profile */}
            {authorProfile && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Author Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {authorProfile.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {authorProfile.title || 'Not specified'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {authorProfile.institution || 'Not specified'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md min-h-[80px]">
                      {authorProfile.bio || 'No bio provided'}
                    </div>
                  </div>

                  {authorProfile.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <a
                        href={authorProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {authorProfile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Statistics and Actions */}
          <div className="space-y-6">
            {/* Content Statistics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-800">Total Content</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                  <div className="text-sm text-green-800">Published</div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
                  <div className="text-sm text-yellow-800">Drafts</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.review}</div>
                  <div className="text-sm text-purple-800">In Review</div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/dashboard/content"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View My Content
                </a>
                <a
                  href="/dashboard/create"
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create New Content
                </a>
                <a
                  href="/dashboard/settings"
                  className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Account Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}