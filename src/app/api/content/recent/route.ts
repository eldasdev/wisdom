import { NextRequest, NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const recent = await ContentDataLayer.getRecent(limit);

    return NextResponse.json({
      items: recent,
      total: recent.length,
    });
  } catch (error) {
    console.error('Error fetching recent content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}