import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Calculate date ranges
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all statistics in parallel
    const [
      totalPublications,
      publishedContent,
      totalAuthors,
      authorsWithContent,
      totalTags,
      thisMonthPublications,
      authorsWithInstitutions,
      editorialBoardCount
    ] = await Promise.all([
      // Total published content
      prisma.content.count({
        where: { status: 'PUBLISHED' }
      }),

      // Get all published content for view count calculation
      prisma.content.findMany({
        where: { status: 'PUBLISHED' },
        select: { viewCount: true }
      }),

      // Total authors
      prisma.author.count(),

      // Authors who have published content
      prisma.author.count({
        where: {
          authoredContent: {
            some: {
              content: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }),

      // Total tags
      prisma.tag.count(),

      // Content published this month
      prisma.content.count({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: thisMonthStart
          }
        }
      }),

      // Authors with institutions who have published content
      prisma.author.findMany({
        where: {
          institution: { not: null },
          authoredContent: {
            some: {
              content: {
                status: 'PUBLISHED'
              }
            }
          }
        },
        select: { institution: true }
      }),

      // Editorial board members
      prisma.editorialBoardMember.count()
    ]);

    // Calculate total views
    const calculatedTotalViews = publishedContent.reduce(
      (sum, content) => sum + (content.viewCount || 0),
      0
    );

    // Get unique institutions
    const uniqueInstitutions = new Set(
      authorsWithInstitutions
        .map(a => a.institution)
        .filter((inst): inst is string => inst !== null)
    );

    // Get content counts by type
    const contentByType = await prisma.content.groupBy({
      by: ['type'],
      where: { status: 'PUBLISHED' },
      _count: true
    });

    const byType = contentByType.reduce((acc, item) => {
      const typeKey = item.type.toLowerCase().replace('_', '-');
      acc[typeKey] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      total: totalPublications, // Alias for backward compatibility
      totalPublications,
      activeAuthors: authorsWithContent,
      authors: authorsWithContent, // Alias for backward compatibility
      totalAuthors,
      totalViews: calculatedTotalViews,
      researchTopics: totalTags,
      institutions: uniqueInstitutions.size,
      thisMonth: thisMonthPublications,
      editorialBoard: editorialBoardCount,
      byType
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}