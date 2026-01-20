import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AuthorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // This should be handled by layout
  }

  // Get author's content statistics
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
              featured: true
            }
          }
        }
      }
    }
  });

  if (!authorProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Author profile not found. Please contact support.</p>
      </div>
    );
  }

  const contentItems = authorProfile.authoredContent.map(ac => ac.content);

  const stats = [
    {
      title: 'Total Content',
      value: contentItems.length,
      icon: '📄',
      color: 'bg-blue-500'
    },
    {
      title: 'Published',
      value: contentItems.filter(c => c.status === 'PUBLISHED').length,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Drafts',
      value: contentItems.filter(c => c.status === 'DRAFT').length,
      icon: '📝',
      color: 'bg-orange-500'
    },
    {
      title: 'Featured',
      value: contentItems.filter(c => c.featured).length,
      icon: '⭐',
      color: 'bg-purple-500'
    }
  ];

  const recentContent = contentItems
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your content and track your impact</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/create"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Content</h3>
            <p className="text-gray-600 text-sm">Write a new article, case study, or book</p>
          </div>
        </Link>

        <Link
          href="/dashboard/content"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Content</h3>
            <p className="text-gray-600 text-sm">Edit and organize your existing work</p>
          </div>
        </Link>

        <Link
          href="/dashboard/profile"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Profile</h3>
            <p className="text-gray-600 text-sm">Manage your author information</p>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Content</h2>
          <Link
            href="/dashboard/content"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {recentContent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No content yet</p>
            <Link
              href="/dashboard/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first piece
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{content.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      content.type === 'ARTICLE'
                        ? 'bg-blue-100 text-blue-800'
                        : content.type === 'CASE_STUDY'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {content.type.replace('_', ' ')}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      content.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : content.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {content.status}
                    </span>
                    {content.featured && (
                      <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <Link
                    href={`/dashboard/content/${content.id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}