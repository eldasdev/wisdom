import { prisma } from '@/lib/prisma';

/**
 * Pure function to generate Crossref-compliant XML metadata
 * 
 * Uses ONLY existing schema fields:
 * - Content: title, description, publishedAt, type, slug, doi, pdfUrl, metadata (JSON)
 * - Author: name, orcid, institution (via ContentAuthor relation)
 * - Journal: title, issn, eissn, publisher, openAccess (via journalId relation)
 * 
 * NO schema changes required - all fields already exist
 */

interface CrossrefXMLOptions {
  baseUrl?: string;
  doiPrefix?: string;
}

/**
 * Generate Crossref deposit XML for a content item
 * 
 * @param contentId - Content ID to generate metadata for
 * @param options - Optional configuration (baseUrl, doiPrefix)
 * @returns Crossref-compliant XML string
 */
export async function generateCrossrefXML(
  contentId: string,
  options: CrossrefXMLOptions = {}
): Promise<string> {
  // Fetch content with all relations using existing schema
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      authors: {
        include: { author: true },
        orderBy: { id: 'asc' } // Consistent ordering
      },
      journal: true,
      tags: {
        include: { tag: true }
      }
    }
  });

  if (!content) {
    throw new Error(`Content with ID ${contentId} not found`);
  }

  // Only generate for published content
  if (content.status !== 'PUBLISHED') {
    throw new Error(`Content must be PUBLISHED to generate Crossref metadata. Current status: ${content.status}`);
  }

  const baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://primesp.com';
  const doiPrefix = options.doiPrefix || process.env.CROSSREF_DOI_PREFIX || '10.XXXXX';

  // Extract existing fields
  const doi = content.doi || `${doiPrefix}/${content.id}`;
  const publishedDate = new Date(content.publishedAt);
  const contentUrl = getContentUrl(content, baseUrl);
  const journal = content.journal;
  const authors = content.authors.map(ca => ca.author);

  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<doi_batch xmlns="http://www.crossref.org/schema/4.4.2" ';
  xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  xml += 'xsi:schemaLocation="http://www.crossref.org/schema/4.4.2 ';
  xml += 'http://www.crossref.org/schema/4.4.2/crossref4.4.2.xsd" ';
  xml += `version="4.4.2">\n`;
  
  // Head section
  xml += '  <head>\n';
  xml += `    <doi_batch_id>${escapeXML(content.id)}</doi_batch_id>\n`;
  xml += `    <timestamp>${formatTimestamp(new Date())}</timestamp>\n`;
  xml += `    <depositor>\n`;
  xml += `      <depositor_name>Prime Scientific Publishing</depositor_name>\n`;
  xml += `      <email_address>${escapeXML(process.env.ADMIN_EMAIL || 'admin@primesp.com')}</email_address>\n`;
  xml += `    </depositor>\n`;
  xml += `    <registrant>Prime Scientific Publishing</registrant>\n`;
  xml += '  </head>\n';

  // Body section
  xml += '  <body>\n';
  xml += '    <journal>\n';

  // Journal metadata (from existing Journal model if available)
  if (journal) {
    xml += `      <journal_metadata language="en">\n`;
    xml += `        <full_title>${escapeXML(journal.title)}</full_title>\n`;
    if (journal.issn) {
      xml += `        <issn media_type="print">${escapeXML(journal.issn)}</issn>\n`;
    }
    if (journal.eissn) {
      xml += `        <issn media_type="electronic">${escapeXML(journal.eissn)}</issn>\n`;
    }
    xml += '      </journal_metadata>\n';
    xml += '      <journal_issue>\n';
    xml += `        <publication_date media_type="online">\n`;
    xml += formatDateParts(publishedDate);
    xml += '        </publication_date>\n';
    xml += '      </journal_issue>\n';
  } else {
    // Fallback if no journal (standalone content)
    xml += `      <journal_metadata language="en">\n`;
    xml += `        <full_title>Prime Scientific Publishing</full_title>\n`;
    xml += '      </journal_metadata>\n';
    xml += '      <journal_issue>\n';
    xml += `        <publication_date media_type="online">\n`;
    xml += formatDateParts(publishedDate);
    xml += '        </publication_date>\n';
    xml += '      </journal_issue>\n';
  }

  // Article metadata
  xml += '      <journal_article publication_type="full_text">\n';
  
  // Titles
  xml += '        <titles>\n';
  xml += `          <title>${escapeXML(content.title)}</title>\n`;
  xml += '        </titles>\n';

  // Contributors (authors from existing ContentAuthor relation)
  xml += '        <contributors>\n';
  authors.forEach((author, index) => {
    const nameParts = parseAuthorName(author.name);
    xml += '          <person_name sequence="';
    xml += index === 0 ? 'first' : 'additional';
    xml += '" contributor_role="author">\n';
    
    if (nameParts.given) {
      xml += `            <given_name>${escapeXML(nameParts.given)}</given_name>\n`;
    }
    xml += `            <surname>${escapeXML(nameParts.family)}</surname>\n`;
    
    // ORCID from existing Author.orcid field
    if (author.orcid) {
      const orcidUrl = formatOrcid(author.orcid);
      xml += `            <ORCID>${escapeXML(orcidUrl)}</ORCID>\n`;
    }
    
    // Affiliation from existing Author.institution field
    if (author.institution) {
      xml += '            <affiliations>\n';
      xml += '              <institution>\n';
      xml += `                <institution_name>${escapeXML(author.institution)}</institution_name>\n`;
      xml += '              </institution>\n';
      xml += '            </affiliations>\n';
    }
    
    xml += '          </person_name>\n';
  });
  xml += '        </contributors>\n';

  // Publication date
  xml += '        <publication_date media_type="online">\n';
  xml += formatDateParts(publishedDate);
  xml += '        </publication_date>\n';

  // Pages (if available in metadata)
  const metadata = content.metadata as Record<string, unknown> | null;
  if (metadata?.pages) {
    xml += '        <pages>\n';
    xml += `          <first_page>1</first_page>\n`;
    xml += `          <last_page>${metadata.pages}</last_page>\n`;
    xml += '        </pages>\n';
  }

  // DOI (from existing Content.doi field)
  xml += `        <doi_data>\n`;
  xml += `          <doi>${escapeXML(doi)}</doi>\n`;
  xml += `          <resource>${escapeXML(contentUrl)}</resource>\n`;
  
  // PDF link (from existing Content.pdfUrl field)
  if (content.pdfUrl) {
    xml += `          <collection property="text-mining">\n`;
    xml += `            <item>\n`;
    xml += `              <resource mime_type="application/pdf">${escapeXML(content.pdfUrl)}</resource>\n`;
    xml += `            </item>\n`;
    xml += `          </collection>\n`;
  }
  
  xml += `        </doi_data>\n`;

  // Abstract (from existing Content.description field)
  if (content.description) {
    const abstract = sanitizeAbstract(content.description);
    xml += `        <abstract>\n`;
    xml += `          <p>${escapeXML(abstract)}</p>\n`;
    xml += `        </abstract>\n`;
  }

  // License (if journal has openAccess from existing Journal.openAccess field)
  if (journal?.openAccess) {
    xml += '        <license_ref>\n';
    xml += `          <start_date>\n`;
    xml += formatDateParts(publishedDate);
    xml += `          </start_date>\n`;
    xml += `          <license_text>Open Access</license_text>\n`;
    xml += '        </license_ref>\n';
  }

  xml += '      </journal_article>\n';
  xml += '    </journal>\n';
  xml += '  </body>\n';
  xml += '</doi_batch>';

  return xml;
}

/**
 * Helper: Parse author name into given and family
 * Uses existing Author.name field
 */
function parseAuthorName(fullName: string): { given?: string; family: string } {
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
 * Helper: Format date parts for Crossref XML
 * Uses existing Content.publishedAt field
 */
function formatDateParts(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `          <year>${year}</year>\n          <month>${month}</month>\n          <day>${day}</day>\n`;
}

/**
 * Helper: Format timestamp for batch ID
 */
function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0];
}

/**
 * Helper: Format ORCID to URL format
 * Uses existing Author.orcid field
 */
function formatOrcid(orcid: string): string {
  // Remove any existing URL prefix
  const cleanOrcid = orcid.replace(/^https?:\/\/orcid\.org\//, '').replace(/^orcid\.org\//, '');
  return `https://orcid.org/${cleanOrcid}`;
}

/**
 * Helper: Get content URL
 * Uses existing Content.type and Content.slug fields
 */
function getContentUrl(content: { type: string; slug: string }, baseUrl: string): string {
  const typePathMap: Record<string, string> = {
    'ARTICLE': 'articles',
    'CASE_STUDY': 'case-studies',
    'BOOK': 'books',
    'BOOK_CHAPTER': 'books',
    'TEACHING_NOTE': 'teaching-notes',
    'COLLECTION': 'collections',
  };

  const typePath = typePathMap[content.type] || 'articles';
  return `${baseUrl}/${typePath}/${content.slug}`;
}

/**
 * Helper: Sanitize abstract/description
 * Uses existing Content.description field
 */
function sanitizeAbstract(text: string): string {
  // Remove HTML tags
  let plainText = text.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  plainText = plainText
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
  // Limit to 4000 characters (Crossref recommendation)
  return plainText.slice(0, 4000);
}

/**
 * Helper: Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
