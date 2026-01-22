import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import type { ContentWithAuthors } from './types';

/**
 * Service for DOI generation and management
 */
export class DoiService {
  private prefix: string;

  constructor(prefix?: string) {
    this.prefix = prefix || process.env.CROSSREF_DOI_PREFIX || '10.XXXXX';
  }

  /**
   * Generate a unique DOI suffix based on content properties
   * Format: YYYY.{shortHash} (e.g., 2026.a1b2c3d4)
   */
  generateDoiSuffix(content: ContentWithAuthors): string {
    const year = new Date(content.publishedAt || content.createdAt).getFullYear();
    // Create a short hash from content ID + random bytes for uniqueness
    const idHash = Buffer.from(content.id).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4);
    const randomPart = randomBytes(2).toString('hex');
    return `${year}.${idHash}${randomPart}`;
  }

  /**
   * Generate full DOI from suffix
   */
  generateFullDoi(suffix: string): string {
    return `${this.prefix}/${suffix}`;
  }

  /**
   * Check if a DOI suffix is unique in the database
   */
  async isDoiUnique(doi: string): Promise<boolean> {
    const existing = await prisma.content.findFirst({
      where: { doi },
    });
    return !existing;
  }

  /**
   * Generate a unique DOI, retrying if collision detected
   */
  async generateUniqueDoi(content: ContentWithAuthors, maxAttempts = 5): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const suffix = this.generateDoiSuffix(content);
      const fullDoi = this.generateFullDoi(suffix);
      
      if (await this.isDoiUnique(fullDoi)) {
        return fullDoi;
      }
      
      console.warn(`DOI collision detected for ${fullDoi}, retrying (attempt ${attempt + 1})`);
    }
    
    throw new Error(`Failed to generate unique DOI after ${maxAttempts} attempts`);
  }

  /**
   * Format DOI as URL for display/linking
   */
  static formatDoiUrl(doi: string): string {
    return `https://doi.org/${doi}`;
  }

  /**
   * Validate DOI format
   */
  static isValidDoi(doi: string): boolean {
    // Basic DOI format: 10.prefix/suffix
    const doiRegex = /^10\.\d{4,}\/[^\s]+$/;
    return doiRegex.test(doi);
  }
}

// Export singleton instance
export const doiService = new DoiService();
