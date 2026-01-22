import { NextRequest, NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try to find content by slug
    const content = await ContentDataLayer.getBySlug(slug);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Get related content
    const related = await ContentDataLayer.getRelated(content.id, 4);

    return NextResponse.json({
      content,
      related,
    });
  } catch (error) {
    console.error('Error fetching content by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}