'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SerializableContent } from '@/lib/types';

interface ContentCardProps {
  content: SerializableContent;
  showExcerpt?: boolean;
  compact?: boolean;
}

export function ContentCard({ content, showExcerpt = true, compact = false }: ContentCardProps) {
  const router = useRouter();

  const getTypeColor = (type: SerializableContent['type']) => {
    switch (type) {
      case 'article':
        return 'accent-article';
      case 'case-study':
        return 'accent-case-study';
      case 'book':
        return 'accent-book';
      case 'book-chapter':
        return 'accent-chapter';
      case 'teaching-note':
        return 'accent-teaching';
      case 'collection':
        return 'accent-collection';
      default:
        return 'accent-article';
    }
  };

  const getTypeBgColor = (type: SerializableContent['type']) => {
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

  const getTypeLabel = (type: SerializableContent['type']) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getAuthorsText = () => {
    if (content.authors.length === 0) return '';
    if (content.authors.length === 1) return content.authors[0].name;
    if (content.authors.length === 2) return `${content.authors[0].name} and ${content.authors[1].name}`;
    return `${content.authors[0].name} et al.`;
  };

  const getContentUrl = (type: string, slug: string) => {
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
  };

  const contentUrl = getContentUrl(content.type, content.slug);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a tag link
    const target = e.target as HTMLElement;
    if (target.closest('a[href^="/tags/"]')) {
      return;
    }
    router.push(contentUrl);
  };

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="card-hover bg-white border border-gray-200 rounded-lg p-4 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium ${getTypeColor(content.type)} ${getTypeBgColor(content.type)} rounded`}>
              {getTypeLabel(content.type)}
            </span>
            {content.status === 'ARCHIVED' && (
              <span className="inline-block px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded">
                Archived
              </span>
            )}
          </div>
          {content.featured && (
            <span className="inline-block px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded">
              Featured
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
          {content.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {getAuthorsText()}
        </p>
        <p className="text-sm text-gray-500">
          {formatDate(content.publishedAt)}
        </p>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="card-hover bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block px-3 py-1 text-sm font-medium ${getTypeColor(content.type)} ${getTypeBgColor(content.type)} rounded-full`}>
              {getTypeLabel(content.type)}
            </span>
            {content.status === 'ARCHIVED' && (
              <span className="inline-block px-3 py-1 text-sm font-medium text-slate-600 bg-slate-200 rounded-full">
                📦 Archived
              </span>
            )}
          </div>
          {content.featured && (
            <span className="inline-block px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
              Featured
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-gray-700 transition-colors">
          {content.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{getAuthorsText()}</span>
          <span>{formatDate(content.publishedAt)}</span>
        </div>

        {content.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {content.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
              >
                {tag}
              </Link>
            ))}
            {content.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                +{content.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
