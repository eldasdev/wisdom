import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  // Fetch dashboard statistics
  const [
    totalUsers,
    totalAuthors,
    totalContent,
    publishedContent,
    draftContent,
    recentUsers,
    recentContent
  ] = await Promise.all([
    prisma.user.count(),
    prisma.author.count(),
    prisma.content.count(),
    prisma.content.count({ where: { status: 'PUBLISHED' } }),
    prisma.content.count({ where: { status: 'DRAFT' } }),
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
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Authors',
      value: totalAuthors,
      icon: '✍️',
      color: 'bg-green-500'
    },
    {
      title: 'Total Content',
      value: totalContent,
      icon: '📄',
      color: 'bg-purple-500'
    },
    {
      title: 'Published',
      value: publishedContent,
      icon: '✅',
      color: 'bg-emerald-500'
    },
    {
      title: 'Drafts',
      value: draftContent,
      icon: '📝',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, content, and system settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'AUTHOR'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4">
            <a
              href="/admin/users"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all users →
            </a>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Content</h2>
          <div className="space-y-3">
            {recentContent.length === 0 ? (
              <p className="text-gray-500 text-sm">No content yet</p>
            ) : (
              recentContent.map((content) => (
                <div key={content.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">{content.title}</p>
                    <p className="text-sm text-gray-600">
                      {content.authors.map(ca => ca.author.name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      content.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : content.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {content.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {content.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4">
            <a
              href="/admin/content"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all content →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}