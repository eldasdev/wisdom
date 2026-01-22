import { NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';

export async function GET() {
  try {
    const content = await ContentDataLayer.getFeatured();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured content' },
      { status: 500 }
    );
  }
}
