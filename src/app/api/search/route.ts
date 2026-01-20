import { NextRequest, NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';
import { ContentType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Extract filter parameters
    const type = searchParams.get('type')?.split(',').filter(Boolean) as ContentType[] | undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const authors = searchParams.get('authors')?.split(',').filter(Boolean);
    const industry = searchParams.get('industry')?.split(',').filter(Boolean);
    const category = searchParams.get('category')?.split(',').filter(Boolean);
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

    const filters = {
      type,
      tags,
      authors,
      industry,
      category,
      featured,
      dateFrom,
      dateTo,
    };

    const results = await ContentDataLayer.search(query, filters, page, pageSize);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}