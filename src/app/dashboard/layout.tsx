import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserIcon,
  Cog6ToothIcon,
  PlusIcon,
  ChartBarSquareIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

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
    authorProfile = await prisma.author.create({
      data: {
        name: session.user.name || 'Unknown Author',
        email: session.user.email!,
        bio: 'New author profile - please update your information.',
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global Header - hidden on mobile for dashboard */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Spacer for global header - only on desktop */}
      <div className="hidden lg:block h-16"></div>
      
      {/* Dashboard Header */}
      <header className="fixed top-0 lg:top-16 left-0 right-0 z-40 h-14 lg:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
        <div className="h-full px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-white">Wisdom</span>
                  <span className="text-[10px] sm:text-xs text-white/60 block -mt-1">Author Dashboard</span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="hidden md:flex items-center px-3 py-1.5 bg-white/10 rounded-lg">
                <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {session.user.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm text-white font-medium">{session.user.name}</span>
              </div>
              
              <Link
                href="/"
                className="flex items-center p-2 sm:px-3 sm:py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm"
                title="View Site"
              >
                <HomeIcon className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Site</span>
              </Link>

              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center p-2 sm:px-3 sm:py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm"
                  title="Admin Panel"
                >
                  <ShieldCheckIcon className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex items-center p-2 sm:px-3 sm:py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for dashboard header */}
      <div className="h-14 lg:h-16"></div>

      <div className="flex">
        {/* Fixed Sidebar - starts after both headers (16+16=32 on desktop) */}
        <aside className="hidden lg:block w-64 fixed top-32 left-0 bottom-0 z-30 bg-white border-r border-gray-200 shadow-sm overflow-y-auto" style={{ top: 'calc(4rem + 4rem)' }}>
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 py-6 space-y-1">
              <div className="mb-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Content
                </p>
              </div>
              
              <Link
                href="/dashboard"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              >
                <ChartBarIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                Overview
              </Link>
              
              <Link
                href="/dashboard/content"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              >
                <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                My Content
              </Link>
              
              <Link
                href="/dashboard/create"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                Create New
              </Link>
              
              <Link
                href="/dashboard/analytics"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              >
                <ChartBarSquareIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                Analytics
              </Link>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Account
                </p>
                
                <Link
                  href="/dashboard/profile"
                  className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                >
                  <UserIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  Profile
                </Link>
                
                <Link
                  href="/dashboard/settings"
                  className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  Settings
                </Link>
              </div>
            </nav>
            
            {/* Sidebar Footer - Create CTA */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/dashboard/create"
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">Create Content</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around py-2">
            <Link href="/dashboard" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-emerald-600">
              <ChartBarIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Overview</span>
            </Link>
            <Link href="/dashboard/content" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-emerald-600">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Content</span>
            </Link>
            <Link href="/dashboard/create" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-emerald-600">
              <PlusIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Create</span>
            </Link>
            <Link href="/dashboard/analytics" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-emerald-600">
              <ChartBarSquareIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Analytics</span>
            </Link>
            <Link href="/dashboard/profile" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-emerald-600">
              <UserIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content - with left margin for sidebar */}
        <main className="flex-1 lg:ml-64">
          <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
