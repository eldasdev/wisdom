import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AuthorContentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  // Get author's content
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
      <div className="text-center py-12">
        <p className="text-gray-500">Author profile not found.</p>
      </div>
    );
  }

  const contentItems = authorProfile.authoredContent.map(ac => ac.content);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Content</h1>
          <p className="text-gray-600 mt-2">Manage your published works and drafts</p>
        </div>
        <Link
          href="/dashboard/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Content ({contentItems.length})</h2>
        </div>

        {contentItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg">No content yet</p>
              <p className="text-sm">Start creating your first piece of content</p>
            </div>
            <Link
              href="/dashboard/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Content
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contentItems.map((content) => (
              <div key={content.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {content.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        content.type === 'ARTICLE'
                          ? 'bg-blue-100 text-blue-800'
                          : content.type === 'CASE_STUDY'
                          ? 'bg-green-100 text-green-800'
                          : content.type === 'BOOK'
                          ? 'bg-purple-100 text-purple-800'
                          : content.type === 'BOOK_CHAPTER'
                          ? 'bg-orange-100 text-orange-800'
                          : content.type === 'TEACHING_NOTE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.type.replace('_', ' ')}
                      </span>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        content.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : content.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : content.status === 'REVIEW'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.status}
                      </span>
                      {content.featured && (
                        <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {content.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Created: {new Date(content.createdAt).toLocaleDateString()}
                      </span>
                      {content.publishedAt && (
                        <span>
                          Published: {new Date(content.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Tags: {content.tags.length}
                      </span>
                    </div>
                  </div>

                  <div className="ml-6 flex items-center space-x-3">
                    <Link
                      href={`/${content.type.toLowerCase().replace('_', 's')}/${content.slug}`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                      target="_blank"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/content/${content.id}/edit`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Delete
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