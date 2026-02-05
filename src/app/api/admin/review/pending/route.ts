import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch pending items in parallel
    const [pendingContent, pendingJournals, pendingUsers] = await Promise.all([
      // Content with REVIEW status
      prisma.content.findMany({
        where: {
          status: 'REVIEW'
        },
        include: {
          authors: {
            include: {
              author: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      }),

      // Journals with DRAFT status
      prisma.journal.findMany({
        where: {
          status: 'DRAFT'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      }),

      // New users (created in last 7 days, not admins)
      prisma.user.findMany({
        where: {
          role: { not: 'ADMIN' },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      })
    ]);

    // Serialize dates
    const serializedContent = pendingContent.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      authors: item.authors.map(a => ({
        author: {
          name: a.author.name,
          email: a.author.email
        }
      }))
    }));

    const serializedJournals = pendingJournals.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      status: item.status,
      createdAt: item.createdAt.toISOString()
    }));

    const serializedUsers = pendingUsers.map(item => ({
      id: item.id,
      name: item.name || 'Unknown',
      email: item.email,
      role: item.role,
      createdAt: item.createdAt.toISOString()
    }));

    return NextResponse.json({
      content: serializedContent,
      journals: serializedJournals,
      users: serializedUsers
    });
  } catch (error) {
    console.error('Error fetching pending items:', error);
    return NextResponse.json({ error: 'Failed to fetch pending items' }, { status: 500 });
  }
}
