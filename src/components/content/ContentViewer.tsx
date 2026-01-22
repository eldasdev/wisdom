import { SerializableContent } from '@/lib/types';
import { ArticleView } from './views/ArticleView';
import { CaseStudyView } from './views/CaseStudyView';
import { BookView } from './views/BookView';
import { TeachingNotesView } from './views/TeachingNotesView';
import { CollectionView } from './views/CollectionView';

interface ContentViewerProps {
  content: SerializableContent;
  showMetadata?: boolean;
  relatedContent?: any[];
}

export function ContentViewer({ content, showMetadata = true, relatedContent = [] }: ContentViewerProps) {
  const getTypeLabel = (type: Content['type']) => {
    switch (type) {
      case 'article':
        return 'Article';
      case 'case-study':
        return 'Case Study';
      case 'book':
        return 'Book';
      case 'book-chapter':
        return 'Book Chapter';
      case 'teaching-note':
        return 'Teaching Note';
      case 'collection':
        return 'Collection';
      default:
        return type;
    }
  };

  const getTypeColor = (type: Content['type']) => {
    switch (type) {
      case 'article':
        return 'accent-article-bg';
      case 'case-study':
        return 'accent-case-study-bg';
      case 'book':
        return 'accent-book-bg';
      case 'book-chapter':
        return 'accent-chapter-bg';
      case 'teaching-note':
        return 'accent-teaching-bg';
      case 'collection':
        return 'accent-collection-bg';
      default:
        return 'accent-article-bg';
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Date not available';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getAuthorsText = () => {
    if (!content.authors || !Array.isArray(content.authors) || content.authors.length === 0) return 'Anonymous';
    if (content.authors.length === 1) return content.authors[0].name || 'Anonymous';
    return content.authors.map(author => author.name || 'Anonymous').join(', ');
  };

  const renderMetadata = () => {
    if (!showMetadata) return null;

    // Optional fields
    const viewCount = (content as any).viewCount as number | undefined;
    const citationCount = (content as any).citationCount as number | undefined;
    const doi = (content as any).doi as string | undefined;

    return (
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className={`inline-block px-3 py-1 text-sm font-medium text-gray-700 ${getTypeColor(content.type)} rounded-full`}>
            {getTypeLabel(content.type)}
          </span>
          {content.featured && (
            <span className="inline-block px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
              Featured
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {content.description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="text-sm text-gray-500">
              By {getAuthorsText()}
            </div>
            {content.publishedAt && (
              <div className="text-sm text-gray-500">
                {formatDate(content.publishedAt)}
              </div>
            )}
            {content.updatedAt && content.publishedAt && content.updatedAt > content.publishedAt && (
              <div className="text-sm text-gray-500">
                Updated {formatDate(content.updatedAt)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {viewCount !== undefined && viewCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{viewCount.toLocaleString()} views</span>
              </div>
            )}
            {content.type === 'article' && 'readTime' in content && (
              <div className="text-sm text-gray-500">
                {content.readTime} min read
              </div>
            )}
          </div>
        </div>

        {(citationCount !== undefined || doi) && (
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
            {citationCount !== undefined && (
              <div>
                Citation index:{' '}
                <span className="font-medium text-gray-700">
                  {citationCount}
                </span>
              </div>
            )}
            {doi && (
              <div>
                DOI:{' '}
                <a
                  href={`https://doi.org/${doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline hover:text-gray-700 break-all"
                >
                  {doi}
                </a>
              </div>
            )}
          </div>
        )}

        {content.tags && Array.isArray(content.tags) && content.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSpecificMetadata = () => {
    switch (content.type) {
      case 'case-study':
        return (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Case Study Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Industry:</span> {content.industry}
              </div>
              {content.company && (
                <div>
                  <span className="font-medium text-gray-700">Company:</span> {content.company}
                </div>
              )}
              {content.learningObjectives && Array.isArray(content.learningObjectives) && content.learningObjectives.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Learning Objectives:</span>
                  <ul className="mt-1 ml-4 list-disc text-gray-600">
                    {content.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 'book':
        return (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Book Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {content.isbn && (
                <div>
                  <span className="font-medium text-gray-700">ISBN:</span> {content.isbn}
                </div>
              )}
              {content.publisher && (
                <div>
                  <span className="font-medium text-gray-700">Publisher:</span> {content.publisher}
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Pages:</span> {content.pages}
              </div>
              {content.edition && (
                <div>
                  <span className="font-medium text-gray-700">Edition:</span> {content.edition}
                </div>
              )}
            </div>
          </div>
        );

      case 'teaching-note':
        return (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Teaching Note</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Duration:</span> {content.duration} minutes
              </div>
              <div>
                <span className="font-medium text-blue-800">Related Content:</span> {content.relatedContentType.replace('-', ' ')}
              </div>
              {content.objectives && Array.isArray(content.objectives) && content.objectives.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-medium text-blue-800">Objectives:</span>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    {content.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render rich views based on content type
  switch (content.type) {
    case 'article':
      return <ArticleView content={content} relatedContent={relatedContent} />;

    case 'case-study':
      return <CaseStudyView content={content} relatedContent={relatedContent} />;

    case 'book':
      return <BookView content={content} relatedContent={relatedContent} />;

    case 'teaching-note':
      return <TeachingNotesView content={content} relatedContent={relatedContent} />;

    case 'collection':
      return <CollectionView content={content} relatedContent={relatedContent} />;

    default:
      // Fallback to basic view for unsupported types
      return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderMetadata()}
          {renderSpecificMetadata()}

          <div
            className="prose-custom prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </article>
      );
  }
}