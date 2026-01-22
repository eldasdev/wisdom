import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Overview statistics
    const [
      totalContent,
      totalUsers,
      totalTags,
      contentByType,
      contentByStatus,
      userRoles,
      publishedContent
    ] = await Promise.all([
      // Total content
      prisma.content.count(),

      // Total users
      prisma.user.count(),

      // Total tags
      prisma.tag.count(),

      // Content by type
      prisma.content.groupBy({
        by: ['type'],
        _count: { type: true }
      }),

      // Content by status
      prisma.content.groupBy({
        by: ['status'],
        _count: { status: true }
      }),

      // User roles
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),

      // Published content for detailed stats
      prisma.content.findMany({
        where: {
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          title: true,
          type: true,
          publishedAt: true,
          viewCount: true,
          citationCount: true
        },
        orderBy: { publishedAt: 'desc' }
      })
    ]);

    // Process content by type
    const contentTypeMap = {
      ARTICLE: 0,
      CASE_STUDY: 0,
      BOOK: 0,
      TEACHING_NOTE: 0,
      COLLECTION: 0
    };

    contentByType.forEach(item => {
      if (item.type in contentTypeMap) {
        contentTypeMap[item.type as keyof typeof contentTypeMap] = item._count.type;
      }
    });

    // Process content by status
    const statusMap = {
      DRAFT: 0,
      REVIEW: 0,
      PUBLISHED: 0,
      ARCHIVED: 0
    };

    contentByStatus.forEach(item => {
      if (item.status in statusMap) {
        statusMap[item.status as keyof typeof statusMap] = item._count.status;
      }
    });

    // Process user roles
    const roleMap = {
      ADMIN: 0,
      AUTHOR: 0,
      REVIEWER: 0
    };

    userRoles.forEach(item => {
      if (item.role in roleMap) {
        roleMap[item.role as keyof typeof roleMap] = item._count.role;
      }
    });

    // Top content by actual view count
    const topContent = publishedContent
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(content => ({
        id: content.id,
        title: content.title,
        type: content.type,
        views: content.viewCount || 0,
        publishedAt: content.publishedAt?.toISOString().split('T')[0] || ''
      }));

    // Top tags - get tags with their content relations and filter published content
    const topTagsResult = await prisma.tag.findMany({
      include: {
        content: {
          include: {
            content: {
              select: {
                status: true
              }
            }
          }
        }
      }
    });

    // Filter to only count published content and sort by count
    const topTags = topTagsResult
      .map(tag => ({
        name: tag.name,
        count: tag.content.filter(ct => ct.content.status === 'PUBLISHED').length
      }))
      .filter(tag => tag.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i, 1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthContent = await prisma.content.findMany({
        where: {
          publishedAt: {
            gte: monthStart,
            lte: monthEnd
          },
          status: 'PUBLISHED'
        },
        select: {
          type: true
        }
      });

      const monthStats = {
        articles: monthContent.filter(c => c.type === 'ARTICLE').length,
        caseStudies: monthContent.filter(c => c.type === 'CASE_STUDY').length,
        books: monthContent.filter(c => c.type === 'BOOK').length,
        total: monthContent.length
      };

      monthlyTrends.push({
        month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        ...monthStats
      });
    }

    // Calculate total views from actual view counts
    const totalViews = publishedContent.reduce((sum, content) => sum + (content.viewCount || 0), 0);

    // Recent activity (mock data - would need activity logging in real app)
    const recentActivity = [
      {
        id: '1',
        type: 'content_published' as const,
        description: 'New article published: "Digital Transformation in Healthcare"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'user_registered' as const,
        description: 'New author registered: Dr. Sarah Johnson',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'content_created' as const,
        description: 'Case study draft created: "Startup Scaling Strategies"',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const analyticsData = {
      overview: {
        totalContent,
        totalUsers,
        totalTags,
        totalViews
      },
      contentByType: contentTypeMap,
      contentByStatus: statusMap,
      userRoles: roleMap,
      topContent,
      topTags,
      monthlyTrends,
      recentActivity
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}