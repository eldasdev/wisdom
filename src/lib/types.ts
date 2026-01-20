export interface Author {
  id: string;
  name: string;
  title?: string;
  institution?: string;
  bio?: string;
}

export interface ContentBase {
  id: string;
  title: string;
  slug: string;
  description: string;
  authors: Author[];
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  featured: boolean;
  content: string;
  // Citation metadata (optional, used for academic materials)
  doi?: string;
  citationCount?: number;
  citationStyle?: string;
  bibtex?: string;
}

export interface Article extends ContentBase {
  type: 'article';
  category: string;
  readTime: number; // in minutes
  wordCount: number;
}

export interface CaseStudy extends ContentBase {
  type: 'case-study';
  industry: string;
  company?: string;
  teachingNotes?: string;
  learningObjectives: string[];
}

export interface Book extends ContentBase {
  type: 'book';
  isbn?: string;
  publisher?: string;
  pages: number;
  edition?: number;
  chapters: BookChapter[];
}

export interface BookChapter extends ContentBase {
  type: 'book-chapter';
  bookId: string;
  chapterNumber: number;
  pageRange?: string;
}

export interface TeachingNote extends ContentBase {
  type: 'teaching-note';
  relatedContentId: string;
  relatedContentType: 'article' | 'case-study' | 'book';
  objectives: string[];
  materials: string[];
  duration?: number; // in minutes
}

export interface Collection extends ContentBase {
  type: 'collection';
  curator: Author;
  items: CollectionItem[];
  theme: string;
}

export interface CollectionItem {
  id: string;
  contentId: string;
  contentType: Article['type'] | CaseStudy['type'] | Book['type'] | BookChapter['type'];
  order: number;
  notes?: string;
}

export type Content =
  | Article
  | CaseStudy
  | Book
  | BookChapter
  | TeachingNote
  | Collection;

export type ContentType = Content['type'];

export interface SearchFilters {
  type?: ContentType[];
  tags?: string[];
  authors?: string[];
  industry?: string[];
  category?: string[];
  featured?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResult extends PaginatedResponse<Content> {
  query: string;
  filters: SearchFilters;
}