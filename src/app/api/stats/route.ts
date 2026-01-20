import { NextRequest, NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const stats = await ContentDataLayer.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}