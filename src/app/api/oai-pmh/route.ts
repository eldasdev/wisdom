import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting) Endpoint
 * 
 * Implements OAI-PMH 2.0 protocol for exposing published content metadata
 * in Dublin Core format for indexing services (Scopus, DOAJ, etc.)
 * 
 * Uses existing schema WITHOUT modifications:
 * - Content model (status = PUBLISHED only)
 * - Author relation (via ContentAuthor)
 * - Tag relation (via ContentTag)
 * - Journal relation (optional)
 */

const REPOSITORY_NAME = 'Prime Scientific Publishing';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@primesp.com';
const GRANULARITY = 'YYYY-MM-DDThh:mm:ssZ'; // OAI-PMH date granularity

// OAI-PMH date format helper
function formatOAIDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// Parse OAI-PMH date
function parseOAIDate(dateStr: string): Date {
  // Handle both YYYY-MM-DD and YYYY-MM-DDThh:mm:ssZ formats
  if (dateStr.length === 10) {
    return new Date(dateStr + 'T00:00:00Z');
  }
  return new Date(dateStr);
}

// Generate resumptionToken (base64 encoded JSON)
function encodeResumptionToken(data: {
  cursor?: string;
  from?: string;
  until?: string;
  set?: string;
  metadataPrefix: string;
}): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

// Decode resumptionToken
function decodeResumptionToken(token: string): {
  cursor?: string;
  from?: string;
  until?: string;
  set?: string;
  metadataPrefix: string;
} {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    throw new Error('badResumptionToken');
  }
}

// Map Content.type to Dublin Core type
function mapContentTypeToDCType(contentType: string): string {
  const mapping: Record<string, string> = {
    'ARTICLE': 'Article',
    'CASE_STUDY': 'Case Study',
    'BOOK': 'Book',
    'BOOK_CHAPTER': 'Book Chapter',
    'TEACHING_NOTE': 'Teaching Material',
    'COLLECTION': 'Collection',
  };
  return mapping[contentType] || 'Text';
}

// Generate Dublin Core metadata XML
function generateDublinCoreXML(content: any): string {
  const authors = content.authors?.map((ca: any) => ca.author.name) || [];
  const tags = content.tags?.map((ct: any) => ct.tag.name) || [];
  const journal = content.journal;
  
  // Build identifier (prefer DOI, fallback to URL)
  const identifier = content.doi 
    ? `https://doi.org/${content.doi}`
    : `${BASE_URL}/articles/${content.slug}`;
  
  // Build publisher (journal publisher or default)
  const publisher = journal?.publisher || REPOSITORY_NAME;
  
  // Build language
  const language = journal?.language?.toLowerCase() || 'en';
  
  // Build date (publishedAt in YYYY-MM-DD format)
  const date = content.publishedAt 
    ? new Date(content.publishedAt).toISOString().split('T')[0]
    : '';
  
  // Build rights (based on journal openAccess or default)
  const rights = journal?.openAccess ? 'Open Access' : 'All Rights Reserved';
  
  let dcXML = '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\n';
  
  // dc:title
  dcXML += `  <dc:title>${escapeXML(content.title)}</dc:title>\n`;
  
  // dc:creator (authors)
  authors.forEach((author: string) => {
    dcXML += `  <dc:creator>${escapeXML(author)}</dc:creator>\n`;
  });
  
  // dc:subject (tags)
  tags.forEach((tag: string) => {
    dcXML += `  <dc:subject>${escapeXML(tag)}</dc:subject>\n`;
  });
  
  // dc:description
  if (content.description) {
    dcXML += `  <dc:description>${escapeXML(content.description)}</dc:description>\n`;
  }
  
  // dc:publisher
  dcXML += `  <dc:publisher>${escapeXML(publisher)}</dc:publisher>\n`;
  
  // dc:date
  if (date) {
    dcXML += `  <dc:date>${date}</dc:date>\n`;
  }
  
  // dc:type
  dcXML += `  <dc:type>${escapeXML(mapContentTypeToDCType(content.type))}</dc:type>\n`;
  
  // dc:identifier
  dcXML += `  <dc:identifier>${escapeXML(identifier)}</dc:identifier>\n`;
  
  // dc:language
  dcXML += `  <dc:language>${language}</dc:language>\n`;
  
  // dc:relation (journal title if exists)
  if (journal?.title) {
    dcXML += `  <dc:relation>${escapeXML(journal.title)}</dc:relation>\n`;
  }
  
  // dc:rights
  dcXML += `  <dc:rights>${escapeXML(rights)}</dc:rights>\n`;
  
  // dc:source (journal ISSN if exists)
  if (journal?.issn) {
    dcXML += `  <dc:source>ISSN: ${escapeXML(journal.issn)}</dc:source>\n`;
  }
  
  dcXML += '</oai_dc:dc>';
  
  return dcXML;
}

// Escape XML special characters
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate OAI-PMH XML response
function generateOAIResponse(verb: string, content: string): string {
  const responseDate = formatOAIDate(new Date());
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/
         http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${responseDate}</responseDate>
  <request verb="${verb}">${BASE_URL}/api/oai-pmh</request>
  ${content}
</OAI-PMH>`;
}

// Generate error response
function generateError(code: string, message: string): string {
  return generateOAIResponse('', `<error code="${code}">${escapeXML(message)}</error>`);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verb = searchParams.get('verb');
    
    if (!verb) {
      return new NextResponse(
        generateError('badVerb', 'Missing verb parameter'),
        { 
          status: 400,
          headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
        }
      );
    }
    
    // Handle Identify verb
    if (verb === 'Identify') {
      const identifyXML = `
  <Identify>
    <repositoryName>${escapeXML(REPOSITORY_NAME)}</repositoryName>
    <baseURL>${BASE_URL}/api/oai-pmh</baseURL>
    <protocolVersion>2.0</protocolVersion>
    <adminEmail>${escapeXML(ADMIN_EMAIL)}</adminEmail>
    <earliestDatestamp>${formatOAIDate(new Date('2020-01-01'))}</earliestDatestamp>
    <deletedRecord>no</deletedRecord>
    <granularity>${GRANULARITY}</granularity>
    <description>
      <oai-identifier xmlns="http://www.openarchives.org/OAI/2.0/oai-identifier"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                       xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai-identifier
                       http://www.openarchives.org/OAI/2.0/oai-identifier.xsd">
        <scheme>oai</scheme>
        <repositoryIdentifier>${BASE_URL.replace(/^https?:\/\//, '')}</repositoryIdentifier>
        <delimiter>:</delimiter>
        <sampleIdentifier>oai:${BASE_URL.replace(/^https?:\/\//, '')}:content:abc123</sampleIdentifier>
      </oai-identifier>
    </description>
  </Identify>`;
      
      return new NextResponse(
        generateOAIResponse('Identify', identifyXML),
        { headers: { 'Content-Type': 'text/xml; charset=UTF-8' } }
      );
    }
    
    // Handle ListMetadataFormats verb
    if (verb === 'ListMetadataFormats') {
      const identifier = searchParams.get('identifier');
      
      if (identifier) {
        // Check if identifier exists
        const identifierParts = identifier.split(':');
        const contentId = identifierParts[identifierParts.length - 1];
        const content = await prisma.content.findFirst({
          where: { 
            id: contentId,
            status: 'PUBLISHED'
          }
        });
        
        if (!content) {
          return new NextResponse(
            generateError('idDoesNotExist', 'The value of the identifier argument is unknown or illegal in this repository.'),
            { 
              status: 404,
              headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
            }
          );
        }
      }
      
      const formatsXML = `
  <ListMetadataFormats>
    <metadataFormat>
      <metadataPrefix>oai_dc</metadataPrefix>
      <schema>http://www.openarchives.org/OAI/2.0/oai_dc.xsd</schema>
      <metadataNamespace>http://www.openarchives.org/OAI/2.0/oai_dc/</metadataNamespace>
    </metadataFormat>
  </ListMetadataFormats>`;
      
      return new NextResponse(
        generateOAIResponse('ListMetadataFormats', formatsXML),
        { headers: { 'Content-Type': 'text/xml; charset=UTF-8' } }
      );
    }
    
    // Handle ListSets verb (optional - using journals as sets)
    if (verb === 'ListSets') {
      const journals = await prisma.journal.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
      });
      
      let setsXML = '<ListSets>\n';
      journals.forEach(journal => {
        setsXML += `  <set>
    <setSpec>journal:${journal.id}</setSpec>
    <setName>${escapeXML(journal.title)}</setName>
  </set>\n`;
      });
      setsXML += '</ListSets>';
      
      return new NextResponse(
        generateOAIResponse('ListSets', setsXML),
        { headers: { 'Content-Type': 'text/xml; charset=UTF-8' } }
      );
    }
    
    // Handle ListIdentifiers and ListRecords verbs
    if (verb === 'ListIdentifiers' || verb === 'ListRecords') {
      const metadataPrefix = searchParams.get('metadataPrefix');
      const from = searchParams.get('from');
      const until = searchParams.get('until');
      const set = searchParams.get('set');
      const resumptionToken = searchParams.get('resumptionToken');
      
      // Validate metadataPrefix
      if (!metadataPrefix && !resumptionToken) {
        return new NextResponse(
          generateError('badArgument', 'Missing required metadataPrefix parameter'),
          { 
            status: 400,
            headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
          }
        );
      }
      
      if (metadataPrefix && metadataPrefix !== 'oai_dc') {
        return new NextResponse(
          generateError('cannotDisseminateFormat', `Metadata format '${metadataPrefix}' is not supported`),
          { 
            status: 400,
            headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
          }
        );
      }
      
      // Parse resumptionToken if provided
      let cursor: string | undefined;
      let fromDate: Date | undefined;
      let untilDate: Date | undefined;
      let journalId: string | undefined;
      let effectiveMetadataPrefix = metadataPrefix || 'oai_dc';
      
      if (resumptionToken) {
        try {
          const tokenData = decodeResumptionToken(resumptionToken);
          cursor = tokenData.cursor;
          effectiveMetadataPrefix = tokenData.metadataPrefix;
          if (tokenData.from) fromDate = parseOAIDate(tokenData.from);
          if (tokenData.until) untilDate = parseOAIDate(tokenData.until);
          if (tokenData.set) {
            // Parse set spec (format: journal:journalId)
            const setParts = tokenData.set.split(':');
            if (setParts[0] === 'journal' && setParts[1]) {
              journalId = setParts[1];
            }
          }
        } catch (error) {
          return new NextResponse(
            generateError('badResumptionToken', 'The resumptionToken argument is invalid or expired'),
            { 
              status: 400,
              headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
            }
          );
        }
      } else {
        // Parse from/until dates
        if (from) fromDate = parseOAIDate(from);
        if (until) untilDate = parseOAIDate(until);
        
        // Parse set (journal filter)
        if (set) {
          const setParts = set.split(':');
          if (setParts[0] === 'journal' && setParts[1]) {
            journalId = setParts[1];
          }
        }
      }
      
      // Build query
      const where: any = {
        status: 'PUBLISHED'
      };
      
      // Date range filter
      if (fromDate || untilDate) {
        where.publishedAt = {};
        if (fromDate) where.publishedAt.gte = fromDate;
        if (untilDate) where.publishedAt.lte = untilDate;
      }
      
      // Journal filter (set)
      if (journalId) {
        where.journalId = journalId;
      }
      
      // Pagination (OAI-PMH recommends 100-500 records per response)
      const pageSize = 100;
      const skip = cursor ? parseInt(cursor) : 0;
      
      // Fetch content with relations
      const [content, total] = await Promise.all([
        prisma.content.findMany({
          where,
          include: {
            authors: {
              include: { author: true }
            },
            tags: {
              include: { tag: true }
            },
            journal: true
          },
          orderBy: { publishedAt: 'desc' },
          skip,
          take: pageSize + 1 // Fetch one extra to check if there are more
        }),
        prisma.content.count({ where })
      ]);
      
      const hasMore = content.length > pageSize;
      const items = hasMore ? content.slice(0, pageSize) : content;
      const nextCursor = hasMore ? (skip + pageSize).toString() : undefined;
      
      // Generate response
      const verbName = verb === 'ListIdentifiers' ? 'ListIdentifiers' : 'ListRecords';
      let responseXML = `<${verbName}>\n`;
      
      items.forEach(item => {
        const identifier = `oai:${BASE_URL.replace(/^https?:\/\//, '')}:content:${item.id}`;
        const datestamp = formatOAIDate(item.publishedAt);
        
        if (verb === 'ListIdentifiers') {
          responseXML += `  <record>
    <header>
      <identifier>${identifier}</identifier>
      <datestamp>${datestamp}</datestamp>
      ${item.journalId ? `<setSpec>journal:${item.journalId}</setSpec>` : ''}
    </header>
  </record>\n`;
        } else {
          // ListRecords - include metadata
          const metadata = generateDublinCoreXML(item);
          responseXML += `  <record>
    <header>
      <identifier>${identifier}</identifier>
      <datestamp>${datestamp}</datestamp>
      ${item.journalId ? `<setSpec>journal:${item.journalId}</setSpec>` : ''}
    </header>
    <metadata>
${metadata.split('\n').map(line => '      ' + line).join('\n')}
    </metadata>
  </record>\n`;
        }
      });
      
      // Add resumptionToken if there are more records
      if (hasMore && nextCursor) {
        const tokenData = {
          cursor: nextCursor,
          from: fromDate ? formatOAIDate(fromDate) : undefined,
          until: untilDate ? formatOAIDate(untilDate) : undefined,
          set: journalId ? `journal:${journalId}` : undefined,
          metadataPrefix: effectiveMetadataPrefix
        };
        const resumptionToken = encodeResumptionToken(tokenData);
        responseXML += `  <resumptionToken>${resumptionToken}</resumptionToken>\n`;
      }
      
      responseXML += `</${verbName}>`;
      
      return new NextResponse(
        generateOAIResponse(verb, responseXML),
        { headers: { 'Content-Type': 'text/xml; charset=UTF-8' } }
      );
    }
    
    // Handle GetRecord verb
    if (verb === 'GetRecord') {
      const identifier = searchParams.get('identifier');
      const metadataPrefix = searchParams.get('metadataPrefix');
      
      if (!identifier) {
        return new NextResponse(
          generateError('badArgument', 'Missing required identifier parameter'),
          { 
            status: 400,
            headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
          }
        );
      }
      
      if (!metadataPrefix) {
        return new NextResponse(
          generateError('badArgument', 'Missing required metadataPrefix parameter'),
          { 
            status: 400,
            headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
          }
        );
      }
      
      if (metadataPrefix !== 'oai_dc') {
        return new NextResponse(
          generateError('cannotDisseminateFormat', `Metadata format '${metadataPrefix}' is not supported`),
          { 
            status: 400,
            headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
          }
        );
      }
      
      // Parse identifier (format: oai:domain:content:contentId)
      const identifierParts = identifier.split(':');
      const contentId = identifierParts[identifierParts.length - 1];
      
      const content = await prisma.content.findFirst({
        where: { 
          id: contentId,
          status: 'PUBLISHED' // Only return published content
        },
        include: {
          authors: {
            include: { author: true }
          },
          tags: {
            include: { tag: true }
          },
          journal: true
        }
      });
      
      if (!content) {
        return new NextResponse(
          generateError('idDoesNotExist', 'The value of the identifier argument is unknown or illegal in this repository.'),
          { 
            status: 404,
            headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
          }
        );
      }
      
      const oaiIdentifier = `oai:${BASE_URL.replace(/^https?:\/\//, '')}:content:${content.id}`;
      const datestamp = formatOAIDate(content.publishedAt);
      const metadata = generateDublinCoreXML(content);
      
      const recordXML = `
  <GetRecord>
    <record>
      <header>
        <identifier>${oaiIdentifier}</identifier>
        <datestamp>${datestamp}</datestamp>
        ${content.journalId ? `<setSpec>journal:${content.journalId}</setSpec>` : ''}
      </header>
      <metadata>
${metadata.split('\n').map(line => '        ' + line).join('\n')}
      </metadata>
    </record>
  </GetRecord>`;
      
      return new NextResponse(
        generateOAIResponse('GetRecord', recordXML),
        { headers: { 'Content-Type': 'text/xml; charset=UTF-8' } }
      );
    }
    
    // Unknown verb
    return new NextResponse(
      generateError('badVerb', `Illegal OAI-PMH verb: ${verb}`),
      { 
        status: 400,
        headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
      }
    );
    
  } catch (error) {
    console.error('OAI-PMH error:', error);
    return new NextResponse(
      generateError('badArgument', 'An error occurred while processing the request'),
      { 
        status: 500,
        headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
      }
    );
  }
}
