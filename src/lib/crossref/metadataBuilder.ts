import type {
  ContentWithAuthors,
  CrossrefJournalArticleMetadata,
  CrossrefContributor,
  CrossrefDateParts,
  CrossrefConfig,
} from './types';

/**
 * Build Crossref-compliant metadata for journal articles
 */
export class CrossrefMetadataBuilder {
  private config: CrossrefConfig;

  constructor(config?: Partial<CrossrefConfig>) {
    this.config = {
      username: process.env.CROSSREF_USERNAME || '',
      password: process.env.CROSSREF_PASSWORD || '',
      prefix: process.env.CROSSREF_DOI_PREFIX || '10.XXXXX',
      apiUrl: process.env.CROSSREF_API_URL || 'https://api.crossref.org/v1/deposits',
      journalTitle: process.env.CROSSREF_JOURNAL_TITLE || 'Wisdom Publishing',
      issn: process.env.CROSSREF_ISSN,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000',
      ...config,
    };
  }

  /**
   * Build full Crossref metadata object for a content item
   */
  build(content: ContentWithAuthors, doi: string): CrossrefJournalArticleMetadata {
    const publishedDate = new Date(content.publishedAt || content.createdAt);
    const contentUrl = this.getContentUrl(content);

    const metadata: CrossrefJournalArticleMetadata = {
      type: 'journal-article',
      title: [content.title],
      author: this.buildContributors(content.authors),
      published: this.formatDate(publishedDate),
      URL: contentUrl,
      DOI: doi,
      resource: {
        primary: {
          URL: contentUrl,
        },
      },
    };

    // Add journal information if available
    if (this.config.journalTitle) {
      metadata['container-title'] = [this.config.journalTitle];
    }

    // Add ISSN if available
    if (this.config.issn) {
      metadata.ISSN = [this.config.issn];
    }

    // Add abstract if available
    if (content.description) {
      metadata.abstract = this.sanitizeAbstract(content.description);
    }

    // Add PDF link if available in metadata
    const contentMetadata = content.metadata as Record<string, unknown> | null;
    if (contentMetadata?.pdfUrl) {
      metadata.link = [
        {
          URL: contentMetadata.pdfUrl as string,
          'content-type': 'application/pdf',
          'content-version': 'vor',
          'intended-application': 'text-mining',
        },
      ];
    }

    // Add license if specified in metadata
    if (contentMetadata?.license) {
      metadata.license = [
        {
          URL: contentMetadata.license as string,
          start: this.formatDate(publishedDate),
          'delay-in-days': 0,
          'content-version': 'vor',
        },
      ];
    }

    return metadata;
  }

  /**
   * Build contributors (authors) array from content authors
   */
  private buildContributors(
    authors: ContentWithAuthors['authors']
  ): CrossrefContributor[] {
    if (!authors || authors.length === 0) {
      return [
        {
          family: 'Unknown',
          sequence: 'first',
        },
      ];
    }

    return authors.map((contentAuthor, index) => {
      const author = contentAuthor.author;
      const nameParts = this.parseAuthorName(author.name);

      const contributor: CrossrefContributor = {
        family: nameParts.family,
        sequence: index === 0 ? 'first' : 'additional',
      };

      // Add given name if available
      if (nameParts.given) {
        contributor.given = nameParts.given;
      }

      // Add affiliation if institution is available
      if (author.institution) {
        contributor.affiliation = [{ name: author.institution }];
      }

      // Add ORCID if available (must be in URL format)
      if (author.orcid) {
        contributor.ORCID = this.formatOrcid(author.orcid);
      }

      return contributor;
    });
  }

  /**
   * Parse author name into given and family parts
   */
  private parseAuthorName(fullName: string): { given?: string; family: string } {
    const parts = fullName.trim().split(/\s+/);
    
    if (parts.length === 1) {
      return { family: parts[0] };
    }

    // Assume last part is family name, rest is given name
    const family = parts[parts.length - 1];
    const given = parts.slice(0, -1).join(' ');

    return { given, family };
  }

  /**
   * Format date for Crossref API
   */
  private formatDate(date: Date): CrossrefDateParts {
    return {
      'date-parts': [[
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ]],
    };
  }

  /**
   * Format ORCID to URL format required by Crossref
   */
  private formatOrcid(orcid: string): string {
    // Remove any existing URL prefix
    const cleanOrcid = orcid.replace(/^https?:\/\/orcid\.org\//, '');
    return `https://orcid.org/${cleanOrcid}`;
  }

  /**
   * Sanitize abstract for Crossref (remove HTML, limit length)
   */
  private sanitizeAbstract(abstract: string): string {
    // Remove HTML tags
    const plainText = abstract.replace(/<[^>]*>/g, '');
    // Limit to 4000 characters (Crossref limit)
    return plainText.slice(0, 4000);
  }

  /**
   * Get the public URL for a content item
   */
  private getContentUrl(content: ContentWithAuthors): string {
    const typePathMap: Record<string, string> = {
      ARTICLE: 'articles',
      CASE_STUDY: 'case-studies',
      BOOK: 'books',
      BOOK_CHAPTER: 'books',
      TEACHING_NOTE: 'teaching-notes',
      COLLECTION: 'collections',
    };

    const typePath = typePathMap[content.type] || 'articles';
    return `${this.config.baseUrl}/${typePath}/${content.slug}`;
  }

  /**
   * Validate that content has required fields for Crossref registration
   */
  validateContent(content: ContentWithAuthors): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!content.title || content.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!content.authors || content.authors.length === 0) {
      errors.push('At least one author is required');
    }

    if (!content.publishedAt) {
      errors.push('Publication date is required');
    }

    if (!content.slug) {
      errors.push('Slug is required for URL generation');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const metadataBuilder = new CrossrefMetadataBuilder();
