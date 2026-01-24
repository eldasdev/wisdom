import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    let startDate: Date | undefined;
    const now = new Date();
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = undefined;
    }

    // Build date filter
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    // Get user's author profile by email (Author uses email, not userId)
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json({
        totalContent: 0,
        totalViews: 0,
        publishedContent: 0,
        draftContent: 0,
        contentByType: [],
        contentByStatus: [],
        topContent: [],
        recentActivity: [],
        monthlyStats: []
      });
    }

    const author = await prisma.author.findUnique({
      where: { email: userEmail }
    });

    if (!author) {
      // Return empty analytics for users without author profile
      return NextResponse.json({
        totalContent: 0,
        totalViews: 0,
        publishedContent: 0,
        draftContent: 0,
        contentByType: [],
        contentByStatus: [],
        topContent: [],
        recentActivity: [],
        monthlyStats: []
      });
    }

    // Get all content authored by this user
    const userContent = await prisma.content.findMany({
      where: {
        authors: {
          some: {
            authorId: author.id
          }
        },
        ...dateFilter
      },
      include: {
        authors: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate total views
    const totalViews = userContent.reduce((sum, content) => sum + (content.viewCount || 0), 0);

    // Count by status
    const publishedContent = userContent.filter(c => c.status === 'PUBLISHED').length;
    const draftContent = userContent.filter(c => c.status === 'DRAFT').length;

    // Group by type
    const contentByTypeMap = new Map<string, number>();
    userContent.forEach(content => {
      const current = contentByTypeMap.get(content.type) || 0;
      contentByTypeMap.set(content.type, current + 1);
    });
    const contentByType = Array.from(contentByTypeMap.entries()).map(([type, count]) => ({
      type,
      count
    })).sort((a, b) => b.count - a.count);

    // Group by status
    const contentByStatusMap = new Map<string, number>();
    userContent.forEach(content => {
      const current = contentByStatusMap.get(content.status) || 0;
      contentByStatusMap.set(content.status, current + 1);
    });
    const contentByStatus = Array.from(contentByStatusMap.entries()).map(([status, count]) => ({
      status,
      count
    })).sort((a, b) => b.count - a.count);

    // Top performing content (by views)
    const topContent = userContent
      .filter(c => c.status === 'PUBLISHED')
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(content => ({
        id: content.id,
        title: content.title,
        slug: content.slug,
        type: content.type,
        viewCount: content.viewCount || 0
      }));

    // Recent activity
    const recentActivity = userContent.slice(0, 10).map(content => ({
      id: content.id,
      title: content.title,
      type: content.type,
      action: content.status === 'PUBLISHED' ? 'published' : 
              content.updatedAt > content.createdAt ? 'updated' : 'created',
      date: content.updatedAt.toISOString()
    }));

    // Monthly stats (last 6 months)
    const monthlyStats: { month: string; published: number; views: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthContent = userContent.filter(c => {
        const createdAt = new Date(c.createdAt);
        return createdAt >= monthStart && createdAt <= monthEnd;
      });

      const publishedInMonth = monthContent.filter(c => c.status === 'PUBLISHED').length;
      const viewsInMonth = monthContent.reduce((sum, c) => sum + (c.viewCount || 0), 0);

      monthlyStats.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        published: publishedInMonth,
        views: viewsInMonth
      });
    }

    return NextResponse.json({
      totalContent: userContent.length,
      totalViews,
      publishedContent,
      draftContent,
      contentByType,
      contentByStatus,
      topContent,
      recentActivity,
      monthlyStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
