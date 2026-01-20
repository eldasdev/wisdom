import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Get author's profile or create one if it doesn't exist
  let authorProfile = await prisma.author.findUnique({
    where: { email: session.user.email! }
  });

  if (!authorProfile && session.user.role === 'AUTHOR') {
    // Create author profile for new authors
    authorProfile = await prisma.author.create({
      data: {
        name: session.user.name || 'Unknown Author',
        email: session.user.email!,
        bio: 'New author profile - please update your information.',
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                Wisdom Dashboard
              </Link>
              <span className="ml-4 text-sm text-gray-500">
                Welcome, {session.user.name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                View Site
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 mr-8">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                📊 Overview
              </Link>
              <Link
                href="/dashboard/content"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                📄 My Content
              </Link>
              <Link
                href="/dashboard/create"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                ➕ Create Content
              </Link>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                👤 Profile
              </Link>
              <Link
                href="/dashboard/analytics"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                📈 Analytics
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                ⚙️ Settings
              </Link>
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}