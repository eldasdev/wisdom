import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { StatusButton } from '@/components/admin/StatusButton';
import { FeaturedButton } from '@/components/admin/FeaturedButton';
import { StarIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

interface PageParams {
  params: { id: string };
}

function getContentUrl(type: string, slug: string) {
  const typeMap: Record<string, string> = {
    'ARTICLE': 'articles',
    'CASE_STUDY': 'case-studies',
    'BOOK': 'books',
    'BOOK_CHAPTER': 'books',
    'TEACHING_NOTE': 'teaching-notes',
    'COLLECTION': 'collections'
  };
  const urlPath = typeMap[type] || 'articles';
  return `/${urlPath}/${slug}`;
}

export default async function AdminContentDetailPage({ params }: PageParams) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 break-words">{content.title}</h1>
          <p className="text-gray-600 mt-2">Content Details & Management</p>
        </div>
        <div className="flex-shrink-0 flex space-x-3">
          <Link
            href={`/admin/content/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Edit Content
          </Link>
          <Link
            href="/admin/content"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap"
          >
            ← All Content
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 ${
        content.status === 'PUBLISHED'
          ? 'bg-green-50 border border-green-200'
          : content.status === 'REVIEW'
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
              content.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : content.status === 'REVIEW'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {content.status}
            </span>
            <FeaturedButton 
              contentId={id} 
              isFeatured={content.featured} 
              size="md"
            />
            <span className="ml-4 text-sm text-gray-700">
              {content.status === 'PUBLISHED'
                ? 'This content is live and visible to all users.'
                : content.status === 'REVIEW'
                ? 'This content is under review.'
                : 'This is a draft. It needs to be sent to review before publishing.'
              }
            </span>
          </div>

          {/* Quick Status Actions */}
          <div className="flex space-x-2">
            {content.status === 'DRAFT' && (
              <StatusButton
                contentId={id}
                targetStatus="REVIEW"
                label="Send to Review"
                className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
              />
            )}

            {content.status === 'REVIEW' && (
              <>
                <StatusButton
                  contentId={id}
                  targetStatus="PUBLISHED"
                  label="Publish Now"
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                />
                <StatusButton
                  contentId={id}
                  targetStatus="DRAFT"
                  label="Back to Draft"
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                />
              </>
            )}

            {content.status === 'PUBLISHED' && (
              <StatusButton
                contentId={id}
                targetStatus="ARCHIVED"
                label="Archive"
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{content.description}</p>
          </div>

          {/* Full Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>

          {/* PDF Document */}
          {content.pdfUrl && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">PDF Document</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-10 h-10 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{content.pdfFileName || 'Document.pdf'}</p>
                    <p className="text-sm text-gray-500">PDF Document attached</p>
                  </div>
                </div>
                <a
                  href={content.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View PDF
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ml-2 ${
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
                <span className="text-sm font-medium text-gray-500">Slug:</span>
                <span className="text-sm text-gray-700 ml-2 font-mono break-all">/{content.slug}</span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <span className="text-sm text-gray-700 ml-2">
                  {new Date(content.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Updated:</span>
                <span className="text-sm text-gray-700 ml-2">
                  {new Date(content.updatedAt).toLocaleString()}
                </span>
              </div>

              {content.publishedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Published:</span>
                  <span className="text-sm text-gray-700 ml-2">
                    {new Date(content.publishedAt).toLocaleString()}
                  </span>
                </div>
              )}

              {content.viewCount > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Views:</span>
                  <span className="text-sm text-gray-700 ml-2">{content.viewCount}</span>
                </div>
              )}

              {content.doi && (
                <div>
                  <span className="text-sm font-medium text-gray-500">DOI:</span>
                  <a 
                    href={`https://doi.org/${content.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 ml-2 hover:underline"
                  >
                    {content.doi}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Authors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authors</h3>
            <div className="space-y-3">
              {content.authors.map((ca) => (
                <div key={ca.author.id} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{ca.author.name}</p>
                    {ca.author.email && (
                      <p className="text-sm text-gray-600">{ca.author.email}</p>
                    )}
                    {ca.author.title && (
                      <p className="text-sm text-gray-500">{ca.author.title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {content.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
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
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/content/${id}/edit`}
                className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Content
              </Link>

              <Link
                href={getContentUrl(content.type, content.slug)}
                target="_blank"
                className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Live
              </Link>

              <DeleteButton
                action={`/api/admin/content/${id}/delete`}
                itemName="content"
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}