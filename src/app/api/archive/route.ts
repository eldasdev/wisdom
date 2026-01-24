import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause for archived content
    const where: any = {
      status: 'ARCHIVED',
    };

    // Filter by year
    if (year && year !== 'all') {
      const yearNum = parseInt(year);
      where.publishedAt = {
        gte: new Date(yearNum, 0, 1),
        lt: new Date(yearNum + 1, 0, 1),
      };
    }

    // Filter by content type
    if (type && type !== 'all') {
      where.type = type;
    }

    // Search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch archived content with pagination
    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          type: true,
          title: true,
          slug: true,
          description: true,
          featured: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          viewCount: true,
          metadata: true,
          tags: {
            include: {
              tag: true,
            },
          },
          authors: {
            include: {
              author: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    // Get year statistics for the sidebar
    const yearStats = await prisma.content.groupBy({
      by: ['publishedAt'],
      where: { status: 'ARCHIVED' },
      _count: true,
    });

    // Process year stats
    const yearCounts: Record<number, number> = {};
    yearStats.forEach((stat) => {
      if (stat.publishedAt) {
        const year = new Date(stat.publishedAt).getFullYear();
        yearCounts[year] = (yearCounts[year] || 0) + stat._count;
      }
    });

    // Get type statistics
    const typeStats = await prisma.content.groupBy({
      by: ['type'],
      where: { status: 'ARCHIVED' },
      _count: true,
    });

    // Transform content for response
    const transformedContent = content.map((item) => {
      const metadata = item.metadata as Record<string, unknown> || {};
      return {
        ...item,
        readTime: metadata.readTime || 5,
        tags: item.tags.map((t) => t.tag.name),
        authors: item.authors.map((a) => ({
          id: a.author.id,
          name: a.author.name,
          title: a.author.title,
          institution: a.author.institution,
        })),
      };
    });

    return NextResponse.json({
      content: transformedContent,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        years: yearCounts,
        types: typeStats.map((t) => ({ type: t.type, count: t._count })),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching archived content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archived content' },
      { status: 500 }
    );
  }
}
