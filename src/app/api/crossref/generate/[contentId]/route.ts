import { NextRequest, NextResponse } from 'next/server';
import { generateCrossrefXML } from '@/lib/crossref/xmlGenerator';

/**
 * API endpoint to generate Crossref XML metadata for a content item
 * 
 * GET /api/crossref/generate/[contentId]
 * 
 * Returns Crossref-compliant XML metadata using ONLY existing schema fields
 * - No schema changes required
 * - Uses existing Content, Author, Journal relations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const { contentId } = params;
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // Get optional query parameters
    const { searchParams } = new URL(request.url);
    const baseUrl = searchParams.get('baseUrl') || undefined;
    const doiPrefix = searchParams.get('doiPrefix') || undefined;

    // Generate Crossref XML using pure function
    const xml = await generateCrossrefXML(contentId, {
      baseUrl,
      doiPrefix,
    });

    // Return XML with proper content type
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Content-Disposition': `attachment; filename="crossref-${contentId}.xml"`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating Crossref XML:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Crossref XML',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}
