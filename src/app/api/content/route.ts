import { NextRequest, NextResponse } from 'next/server';
import { ContentDataLayer } from '@/lib/data';
import { ContentType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Extract array parameters (comma-separated)
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const authors = searchParams.get('authors')?.split(',').filter(Boolean) || [];
    const industries = searchParams.get('industries')?.split(',').filter(Boolean) || [];
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];

    let content;

    // Handle different query types
    if (featured === 'true') {
      content = await ContentDataLayer.getFeatured();
    } else if (type) {
      content = await ContentDataLayer.getByType(type);
    } else {
      content = await ContentDataLayer.getAll();
    }

    // Defensive: ensure we always have an array
    if (!Array.isArray(content)) {
      return NextResponse.json(
        { error: 'Unexpected content response' },
        { status: 500 }
      );
    }

    // Apply filters
    if (tags.length > 0) {
      content = content.filter(item =>
        tags.some(tag => item.tags.includes(tag))
      );
    }

    if (authors.length > 0) {
      content = content.filter(item =>
        authors.some(authorName =>
          item.authors.some(author => author.name === authorName)
        )
      );
    }

    if (industries.length > 0) {
      content = content.filter(item => {
        if (item.type === 'case-study') {
          return industries.includes((item as any).industry);
        }
        return false;
      });
    }

    if (categories.length > 0) {
      content = content.filter(item => {
        if (item.type === 'article') {
          return categories.includes((item as any).category);
        }
        return false;
      });
    }

    // Sort by published date (newest first)
    content.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = content.slice(startIndex, endIndex);

    return NextResponse.json({
      items: paginatedContent,
      total: content.length,
      page,
      pageSize: limit,
      totalPages: Math.ceil(content.length / limit),
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}