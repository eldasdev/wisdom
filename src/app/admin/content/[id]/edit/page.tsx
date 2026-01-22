import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';

interface PageParams {
  params: { id: string };
}

export default async function AdminEditContentPage({ params }: PageParams) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const { id } = await params;

  const content = await prisma.content.findUnique({
    where: { id },
    include: {
      authors: {
        include: { author: true }
      },
      tags: {
        include: { tag: true }
      }
    }
  });

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Content not found.</p>
        <Link href="/admin/content" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
          ← Back to Content Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
          <p className="text-gray-600 mt-2">Modify content details and settings</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/content/${id}`}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Back to Content
          </Link>
          <Link
            href="/admin/content"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← All Content
          </Link>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Title</h3>
            <p className="text-gray-700">{content.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Type</h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              content.type === 'ARTICLE'
                ? 'bg-blue-100 text-blue-800'
                : content.type === 'CASE_STUDY'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {content.type.replace('_', ' ')}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Status</h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              content.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : content.status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {content.status}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Authors</h3>
            <p className="text-gray-700">
              {content.authors.map(ca => ca.author.name).join(', ')}
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{content.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {content.status === 'DRAFT' && (
            <form action={`/api/admin/content/${id}/status`} method="POST" className="inline">
              <input type="hidden" name="status" value="REVIEW" />
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Send to Review
              </button>
            </form>
          )}

          {content.status === 'REVIEW' && (
            <>
              <form action={`/api/admin/content/${id}/status`} method="POST" className="inline">
                <input type="hidden" name="status" value="PUBLISHED" />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Publish Now
                </button>
              </form>
              <form action={`/api/admin/content/${id}/status`} method="POST" className="inline">
                <input type="hidden" name="status" value="DRAFT" />
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Move to Draft
                </button>
              </form>
            </>
          )}

          {content.status === 'PUBLISHED' && (
            <form action={`/api/admin/content/${id}/status`} method="POST" className="inline">
              <input type="hidden" name="status" value="DRAFT" />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Unpublish
              </button>
            </form>
          )}

          <Link
            href={`/${content.type.toLowerCase().replace('_', 's')}/${content.slug}`}
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Live
          </Link>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Slug</h3>
            <p className="text-gray-700 font-mono text-sm">/{content.slug}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Created</h3>
            <p className="text-gray-700">{new Date(content.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Last Updated</h3>
            <p className="text-gray-700">{new Date(content.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Published</h3>
            <p className="text-gray-700">
              {content.publishedAt ? new Date(content.publishedAt).toLocaleString() : 'Not published'}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Tags ({content.tags.length})</h3>
            <div className="flex flex-wrap gap-1">
              {content.tags.map((ct) => (
                <span
                  key={ct.tag.id}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {ct.tag.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Featured</h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              content.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {content.featured ? 'Featured' : 'Not Featured'}
            </span>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Preview</h2>
        <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-900">Delete Content</h3>
            <p className="text-red-700 text-sm">
              Permanently delete this content. This action cannot be undone.
            </p>
          </div>
          <DeleteButton
            action={`/api/admin/content/${id}/delete`}
            itemName="content"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}