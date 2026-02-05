import { prisma } from '@/lib/prisma';
import { PublicLayout } from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { NewspaperIcon, BookOpenIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default async function JournalsPage() {
  const journals = await prisma.journal.findMany({
    where: {
      status: 'PUBLISHED'
    },
    include: {
      _count: {
        select: {
          content: true
        }
      }
    },
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <NewspaperIcon className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-medium text-white">Academic Journals</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                Our Journals
              </h1>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                Explore our collection of peer-reviewed academic journals covering diverse research areas
              </p>
            </div>
          </div>
        </div>

        {/* Journals Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {journals.length === 0 ? (
            <div className="text-center py-16">
              <NewspaperIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Journals Available</h2>
              <p className="text-gray-600">Check back soon for new journal publications.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journals.map((journal) => (
                <Link
                  key={journal.id}
                  href={`/journals/${journal.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
                >
                  {journal.coverImage && (
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                      <img
                        src={journal.coverImage}
                        alt={journal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {journal.title}
                      </h3>
                      {journal.featured && (
                        <span className="flex-shrink-0 ml-2 px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    {journal.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {journal.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {journal.issn && (
                        <div className="flex items-center text-xs text-gray-500">
                          <BookOpenIcon className="w-4 h-4 mr-2" />
                          <span>ISSN: {journal.issn}</span>
                        </div>
                      )}
                      {journal.frequency && (
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          <span>{journal.frequency}</span>
                        </div>
                      )}
                      {journal.openAccess && (
                        <div className="flex items-center text-xs text-emerald-600 font-medium">
                          <GlobeAltIcon className="w-4 h-4 mr-2" />
                          <span>Open Access</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {journal._count.content} {journal._count.content === 1 ? 'article' : 'articles'}
                      </span>
                      <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                        View Journal →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
