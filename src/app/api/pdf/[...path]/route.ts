import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

/**
 * API Route to serve PDF files
 * Handles both Vercel Blob URLs and legacy local file paths
 * This ensures PDFs are accessible to all users (including guests)
 * and handles proper CORS headers for the react-pdf library
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathParts } = await params;
    
    // Check if this is a request for a blob URL (passed as query param)
    const blobUrl = request.nextUrl.searchParams.get('url');
    
    if (blobUrl && (blobUrl.startsWith('http://') || blobUrl.startsWith('https://'))) {
      // Fetch from Vercel Blob (public URLs can be fetched directly)
      try {
        const response = await fetch(blobUrl);
        
        if (!response.ok) {
          return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
          );
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${path.basename(blobUrl)}"`,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      } catch (error) {
        console.error('Error fetching from blob:', error);
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
    }
    
    // Legacy: Handle local file paths (for backward compatibility)
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...pathParts);
    
    // Security check: ensure the path is within the uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const resolvedPath = path.resolve(filePath);
    
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      );
    }
    
    // Check if file exists
    if (!existsSync(resolvedPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Read the file
    const fileBuffer = await readFile(resolvedPath);
    
    // Return the PDF with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${path.basename(resolvedPath)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'Failed to serve PDF' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
