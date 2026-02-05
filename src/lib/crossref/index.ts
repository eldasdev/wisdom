/**
 * Crossref DOI Registration Service
 * 
 * This module provides functionality for:
 * - Generating unique DOI suffixes
 * - Building Crossref-compliant metadata
 * - Registering DOIs via Crossref API
 * 
 * Environment variables required:
 * - CROSSREF_USERNAME: Crossref account username
 * - CROSSREF_PASSWORD: Crossref account password
 * - CROSSREF_DOI_PREFIX: Your DOI prefix (e.g., 10.12345)
 * - CROSSREF_API_URL: API endpoint (default: https://api.crossref.org/v1/deposits)
 * - CROSSREF_JOURNAL_TITLE: Journal/publication name
 * - CROSSREF_ISSN: Journal ISSN (optional but recommended)
 * - NEXT_PUBLIC_BASE_URL: Base URL for content links
 */

import { prisma } from '@/lib/prisma';
import { DoiService, doiService } from './doiService';
import { CrossrefMetadataBuilder, metadataBuilder } from './metadataBuilder';
import { CrossrefClient, crossrefClient } from './crossrefClient';
import type { ContentWithAuthors, DoiRegistrationResult } from './types';

// Re-export for external use
export { DoiService, doiService } from './doiService';
export { CrossrefMetadataBuilder, metadataBuilder } from './metadataBuilder';
export { CrossrefClient, crossrefClient } from './crossrefClient';
export { generateCrossrefXML } from './xmlGenerator';
export * from './types';

/**
 * Main function to register a DOI for published content
 * This should be called after content is successfully published
 */
export async function registerDoiForContent(
  contentId: string
): Promise<DoiRegistrationResult> {
  console.log(`[DOI] Starting registration for content: ${contentId}`);

  try {
    // Fetch content with authors
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        authors: {
          include: { author: true },
        },
      },
    });

    if (!content) {
      return {
        success: false,
        error: 'Content not found',
      };
    }

    // Check if already has DOI
    if (content.doi) {
      console.log(`[DOI] Content already has DOI: ${content.doi}`);
      return {
        success: true,
        doi: content.doi,
        message: 'DOI already registered',
      };
    }

    // Validate content
    const validation = metadataBuilder.validateContent(content as ContentWithAuthors);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
      };
    }

    // Generate unique DOI
    const doi = await doiService.generateUniqueDoi(content as ContentWithAuthors);
    console.log(`[DOI] Generated DOI: ${doi}`);

    // Build Crossref metadata
    const metadata = metadataBuilder.build(content as ContentWithAuthors, doi);
    console.log(`[DOI] Built metadata for: ${content.title}`);

    // Set status to pending before API call
    await prisma.content.update({
      where: { id: contentId },
      data: {
        crossrefStatus: 'PENDING',
      },
    });

    // Register with Crossref
    const result = await crossrefClient.registerDoi(doi, metadata);

    // Update content with result
    if (result.success) {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          doi: result.doi,
          crossrefStatus: 'REGISTERED',
          crossrefDepositId: result.depositId,
        },
      });
      console.log(`[DOI] Successfully registered: ${doi}`);
    } else {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          crossrefStatus: 'FAILED',
        },
      });
      console.error(`[DOI] Registration failed: ${result.error}`);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[DOI] Registration error for ${contentId}:`, errorMessage);

    // Try to update status to failed
    try {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          crossrefStatus: 'FAILED',
        },
      });
    } catch (updateError) {
      console.error('[DOI] Failed to update status:', updateError);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Retry DOI registration for failed content
 */
export async function retryDoiRegistration(
  contentId: string
): Promise<DoiRegistrationResult> {
  // Clear existing DOI and status, then retry
  await prisma.content.update({
    where: { id: contentId },
    data: {
      doi: null,
      crossrefStatus: null,
      crossrefDepositId: null,
    },
  });

  return registerDoiForContent(contentId);
}

/**
 * Check if Crossref integration is configured
 */
export function isCrossrefConfigured(): boolean {
  return Boolean(
    process.env.CROSSREF_USERNAME &&
    process.env.CROSSREF_PASSWORD &&
    process.env.CROSSREF_DOI_PREFIX &&
    process.env.CROSSREF_DOI_PREFIX !== '10.XXXXX'
  );
}

/**
 * Get configuration status for admin display
 */
export function getCrossrefConfigStatus(): {
  configured: boolean;
  details: Record<string, boolean>;
} {
  return {
    configured: isCrossrefConfigured(),
    details: {
      username: Boolean(process.env.CROSSREF_USERNAME),
      password: Boolean(process.env.CROSSREF_PASSWORD),
      prefix: Boolean(process.env.CROSSREF_DOI_PREFIX && process.env.CROSSREF_DOI_PREFIX !== '10.XXXXX'),
      journalTitle: Boolean(process.env.CROSSREF_JOURNAL_TITLE),
      issn: Boolean(process.env.CROSSREF_ISSN),
      baseUrl: Boolean(process.env.NEXT_PUBLIC_BASE_URL),
    },
  };
}
