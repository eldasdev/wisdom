export interface Author {
  id: string;
  name: string;
  title?: string;
  institution?: string;
  bio?: string;
  email?: string;
  orcid?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
}

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

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
  status?: ContentStatus;
  // View/Impression tracking
  viewCount?: number;
  // PDF document (optional)
  pdfUrl?: string;
  pdfFileName?: string;
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

// Serializable version with string dates for API responses
export interface SerializableContent extends Omit<ContentBase, 'publishedAt' | 'updatedAt'> {
  type: ContentType;
  publishedAt: string; // ISO string
  updatedAt?: string; // ISO string
  // Type-specific properties (from metadata)
  // Article
  category?: string;
  readTime?: number;
  wordCount?: number;
  // Case Study
  industry?: string;
  company?: string;
  teachingNotes?: string;
  learningObjectives?: string[];
  // Book
  isbn?: string;
  publisher?: string;
  pages?: number;
  edition?: number;
  chapters?: SerializableContent[];
  // Book Chapter
  bookId?: string;
  chapterNumber?: number;
  pageRange?: string;
  // Teaching Note
  relatedContentId?: string;
  relatedContentType?: string;
  objectives?: string[];
  materials?: string[];
  duration?: number;
  // Collection
  curator?: Author;
  items?: CollectionItem[];
  theme?: string;
}

export type ContentType = Content['type'];

export interface SearchFilters {
  type?: ContentType[];
  tags?: string[];
  authors?: string[];
  industry?: string[];
  company?: string[];
  sector?: string[];
  region?: string[];
  country?: string[];
  category?: string[];
  topic?: string[];
  subject?: string[];
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

// NextAuth type extensions
declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}