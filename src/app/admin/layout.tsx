import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import {
  ChartBarIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global Header - hidden on mobile for admin */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Spacer for global header - only on desktop */}
      <div className="hidden lg:block h-16"></div>
      
      {/* Admin Panel Header */}
      <header className="fixed top-0 lg:top-16 left-0 right-0 z-40 h-14 lg:h-16 bg-gradient-to-r from-[#0C2C55] to-slate-800 shadow-lg">
        <div className="h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">Wisdom</span>
                  <span className="text-xs text-white/60 block -mt-1">Admin Panel</span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/10 rounded-lg">
                <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {session.user.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm text-white font-medium">{session.user.name}</span>
              </div>
              
              <Link
                href="/"
                className="flex items-center px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm"
              >
                <HomeIcon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex items-center px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for admin header */}
      <div className="h-14 lg:h-16"></div>

      <div className="flex">
        {/* Fixed Sidebar - starts after both headers (desktop only) */}
        <aside className="hidden lg:block w-64 fixed top-32 left-0 bottom-0 z-30 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 py-6 space-y-1">
              <div className="mb-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Management
                </p>
              </div>
              
              <Link
                href="/admin"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
              >
                <ChartBarIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                Dashboard
              </Link>
              
              <Link
                href="/admin/users"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
              >
                <UsersIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                Users
              </Link>
              
              <Link
                href="/admin/authors"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
              >
                <PencilSquareIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                Authors
              </Link>
              
              <Link
                href="/admin/content"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
              >
                <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                Content
              </Link>
              
              <Link
                href="/admin/tags"
                className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
              >
                <TagIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                Tags
              </Link>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Account
                </p>
                
                <Link
                  href="/admin/profile"
                  className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
                >
                  <UserIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                  Profile
                </Link>
                
                <Link
                  href="/admin/settings"
                  className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0C2C55] hover:bg-[#0C2C55]/5 rounded-xl transition-all duration-200"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#0C2C55] transition-colors" />
                  Settings
                </Link>
              </div>
            </nav>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center p-3 bg-gradient-to-r from-[#0C2C55]/5 to-transparent rounded-xl">
                <BookOpenIcon className="w-8 h-8 text-[#0C2C55]" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900">Wisdom Platform</p>
                  <p className="text-xs text-gray-500">v1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around py-2">
            <Link href="/admin" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-[#0C2C55]">
              <ChartBarIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link href="/admin/users" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-[#0C2C55]">
              <UsersIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Users</span>
            </Link>
            <Link href="/admin/authors" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-[#0C2C55]">
              <PencilSquareIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Authors</span>
            </Link>
            <Link href="/admin/content" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-[#0C2C55]">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Content</span>
            </Link>
            <Link href="/admin/tags" className="flex flex-col items-center px-3 py-2 text-gray-600 hover:text-[#0C2C55]">
              <TagIcon className="w-5 h-5" />
              <span className="text-xs mt-1">Tags</span>
            </Link>
          </div>
        </div>

        {/* Main Content - with left margin for sidebar on desktop */}
        <main className="flex-1 lg:ml-64">
          <div className="py-4 px-3 sm:px-4 lg:px-8 pb-24 lg:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
