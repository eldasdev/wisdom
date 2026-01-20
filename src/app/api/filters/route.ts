import { NextRequest, NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const filterOptions = await ContentDataLayer.getFilterOptions();

    return NextResponse.json(filterOptions);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}