import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Update view count atomically
    const content = await prisma.content.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      },
      select: {
        id: true,
        viewCount: true
      }
    });

    return NextResponse.json({
      success: true,
      viewCount: content.viewCount
    });

  } catch (error) {
    console.error('Error tracking impression:', error);
    
    // Return success even if content not found to avoid client-side errors
    return NextResponse.json({
      success: false,
      viewCount: 0
    });
  }
}

// GET endpoint to retrieve current view count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const content = await prisma.content.findUnique({
      where: { slug },
      select: {
        viewCount: true
      }
    });

    return NextResponse.json({
      viewCount: content?.viewCount || 0
    });

  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json({ viewCount: 0 });
  }
}
