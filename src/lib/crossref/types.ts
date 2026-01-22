import { Content, Author, ContentAuthor } from '@prisma/client';

// Content with authors relation
export type ContentWithAuthors = Content & {
  authors: (ContentAuthor & { author: Author })[];
};

// Crossref contributor (author) format
export interface CrossrefContributor {
  given?: string;
  family: string;
  sequence: 'first' | 'additional';
  affiliation?: Array<{ name: string }>;
  ORCID?: string;
}

// Crossref date format
export interface CrossrefDateParts {
  'date-parts': [[number, number?, number?]];
}

// Crossref resource (URL) format
export interface CrossrefResource {
  primary: {
    URL: string;
  };
}

// Crossref license format
export interface CrossrefLicense {
  URL: string;
  start: CrossrefDateParts;
  'delay-in-days': number;
  'content-version': 'vor' | 'am' | 'tdm';
}

// Full Crossref metadata for journal-article
export interface CrossrefJournalArticleMetadata {
  type: 'journal-article';
  title: string[];
  author: CrossrefContributor[];
  'container-title'?: string[];
  ISSN?: string[];
  published: CrossrefDateParts;
  abstract?: string;
  URL: string;
  DOI: string;
  resource: CrossrefResource;
  license?: CrossrefLicense[];
  link?: Array<{
    URL: string;
    'content-type': string;
    'content-version': string;
    'intended-application': string;
  }>;
}

// Crossref deposit request body
export interface CrossrefDepositRequest {
  'owner-prefix': string;
  items: CrossrefJournalArticleMetadata[];
}

// Crossref API response
export interface CrossrefDepositResponse {
  status: string;
  'message-type'?: string;
  message?: {
    'batch-id'?: string;
    'submission-id'?: string;
    status?: string;
  };
}

// DOI registration result
export interface DoiRegistrationResult {
  success: boolean;
  doi?: string;
  depositId?: string;
  message?: string;
  error?: string;
}

// Crossref configuration
export interface CrossrefConfig {
  username: string;
  password: string;
  prefix: string;
  apiUrl: string;
  journalTitle?: string;
  issn?: string;
  baseUrl: string;
}
