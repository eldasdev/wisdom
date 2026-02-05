import { prisma } from '@/lib/prisma';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  NewspaperIcon,
  BookOpenIcon,
  CalendarIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalPage({ params }: PageProps) {
  const { slug } = await params;

  const journal = await prisma.journal.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          content: true
        }
      }
    }
  });

  if (!journal || journal.status !== 'PUBLISHED') {
    notFound();
  }

  // Get recent content from this journal
  const recentContent = await prisma.content.findMany({
    where: {
      journalId: journal.id,
      status: 'PUBLISHED'
    },
    include: {
      authors: {
        include: {
          author: {
            select: {
              name: true,
              institution: true
            }
          }
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: 10
  });

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
              href="/journals"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Journals
            </Link>
            
            <div className="flex flex-col md:flex-row gap-6">
              {journal.coverImage && (
                <div className="flex-shrink-0">
                  <img
                    src={journal.coverImage}
                    alt={journal.title}
                    className="w-32 h-40 md:w-40 md:h-52 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
              
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <NewspaperIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Academic Journal</span>
                  {journal.openAccess && (
                    <span className="px-2 py-1 text-xs font-semibold bg-emerald-500 text-white rounded-full">
                      Open Access
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{journal.title}</h1>
                
                {journal.description && (
                  <p className="text-indigo-100 text-lg mb-6">{journal.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {journal.issn && (
                    <div>
                      <div className="text-indigo-200 mb-1">ISSN</div>
                      <div className="font-semibold">{journal.issn}</div>
                    </div>
                  )}
                  {journal.eissn && (
                    <div>
                      <div className="text-indigo-200 mb-1">e-ISSN</div>
                      <div className="font-semibold">{journal.eissn}</div>
                    </div>
                  )}
                  {journal.frequency && (
                    <div>
                      <div className="text-indigo-200 mb-1">Frequency</div>
                      <div className="font-semibold">{journal.frequency}</div>
                    </div>
                  )}
                  {journal.language && (
                    <div>
                      <div className="text-indigo-200 mb-1">Language</div>
                      <div className="font-semibold">{journal.language}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              {journal.scope && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                    Scope & Aims
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>{journal.scope}</p>
                  </div>
                </div>
              )}

              {/* Recent Articles */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                  Recent Articles ({journal._count.content})
                </h2>
                
                {recentContent.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No articles published yet in this journal.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentContent.map((content) => (
                      <Link
                        key={content.id}
                        href={`/articles/${content.slug}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                          {content.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {content.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {content.authors.map(ca => ca.author.name).join(', ')}
                          </span>
                          <span>
                            {new Date(content.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Journal Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Journal Information</h3>
                <div className="space-y-3 text-sm">
                  {journal.publisher && (
                    <div>
                      <div className="text-gray-500 mb-1">Publisher</div>
                      <div className="font-medium text-gray-900">{journal.publisher}</div>
                    </div>
                  )}
                  {journal.impactFactor && (
                    <div>
                      <div className="text-gray-500 mb-1">Impact Factor</div>
                      <div className="font-medium text-gray-900">{journal.impactFactor}</div>
                    </div>
                  )}
                  {journal.indexedIn && (
                    <div>
                      <div className="text-gray-500 mb-1">Indexed In</div>
                      <div className="font-medium text-gray-900">{journal.indexedIn}</div>
                    </div>
                  )}
                  {journal.website && (
                    <div>
                      <div className="text-gray-500 mb-1">Website</div>
                      <a
                        href={journal.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Visit Website →
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Guidelines */}
              {journal.submissionGuidelines && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Guidelines</h3>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <div dangerouslySetInnerHTML={{ __html: journal.submissionGuidelines }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
