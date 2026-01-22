import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Get current featured status
    const content = await prisma.content.findUnique({
      where: { id },
      select: { featured: true, title: true },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Toggle featured status
    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        featured: !content.featured,
      },
      select: {
        id: true,
        title: true,
        featured: true,
      },
    });

    return NextResponse.json({
      success: true,
      content: updatedContent,
      message: updatedContent.featured 
        ? `"${updatedContent.title}" is now featured!` 
        : `"${updatedContent.title}" removed from featured.`,
    });

  } catch (error) {
    console.error('Error toggling featured status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
