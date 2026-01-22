import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  DocumentTextIcon,
  StarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export default async function AuthorContentPage() {
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
            include: {
              tags: {
                include: { tag: true }
              },
              _count: {
                select: { tags: true }
              }
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
          <DocumentTextIcon className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500">Your author profile needs to be created.</p>
      </div>
    );
  }

  const contentItems = authorProfile.authoredContent.map(ac => ac.content);

  const statusCounts = {
    all: contentItems.length,
    published: contentItems.filter(c => c.status === 'PUBLISHED').length,
    draft: contentItems.filter(c => c.status === 'DRAFT').length,
    review: contentItems.filter(c => c.status === 'REVIEW').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Content</h1>
          <p className="text-gray-500 mt-1">Manage your published works and drafts</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">{statusCounts.published}</p>
          <p className="text-xs text-gray-500">Published</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{statusCounts.review}</p>
          <p className="text-xs text-gray-500">In Review</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-600">{statusCounts.draft}</p>
          <p className="text-xs text-gray-500">Drafts</p>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Content ({contentItems.length})</h2>
        </div>

        {contentItems.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start creating your first piece of content to share your knowledge with the world.</p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 font-medium"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Your First Content
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contentItems.map((content) => (
              <div key={content.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/dashboard/content/${content.id}`}
                      className="text-base sm:text-lg font-semibold text-gray-900 hover:text-emerald-700 transition-colors line-clamp-2"
                    >
                      {content.title}
                    </Link>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-lg ${
                        content.type === 'ARTICLE'
                          ? 'bg-blue-100 text-blue-700'
                          : content.type === 'CASE_STUDY'
                          ? 'bg-emerald-100 text-emerald-700'
                          : content.type === 'BOOK'
                          ? 'bg-purple-100 text-purple-700'
                          : content.type === 'BOOK_CHAPTER'
                          ? 'bg-orange-100 text-orange-700'
                          : content.type === 'TEACHING_NOTE'
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {content.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-lg ${
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
                      {content.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg">
                          <StarIcon className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {content.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                      <span>Created: {new Date(content.createdAt).toLocaleDateString()}</span>
                      {content.publishedAt && (
                        <span>Published: {new Date(content.publishedAt).toLocaleDateString()}</span>
                      )}
                      {content.tags.length > 0 && (
                        <span>{content.tags.length} tags</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {content.status === 'PUBLISHED' && (
                      <Link
                        href={`/articles/${content.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="View Live"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/content/${content.id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/dashboard/content/${content.id}/edit`}
                      className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button 
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
