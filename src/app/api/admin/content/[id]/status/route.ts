import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';
import { registerDoiForContent, isCrossrefConfigured } from '@/lib/crossref';

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
    const formData = await request.formData();
    const status = formData.get('status') as string;

    if (!['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Fetch current content to check existing status
    const existingContent = await prisma.content.findUnique({
      where: { id },
      select: { status: true, doi: true },
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Update content status
    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        status: status as ContentStatus,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
      include: {
        authors: {
          include: { author: true },
        },
      },
    });

    // If publishing and no DOI exists, attempt DOI registration
    let doiResult = null;
    if (
      status === 'PUBLISHED' &&
      !existingContent.doi &&
      isCrossrefConfigured()
    ) {
      console.log(`[Publish] Attempting DOI registration for content: ${id}`);
      
      // Register DOI asynchronously (don't block the response)
      // For synchronous registration, remove the Promise wrapper
      doiResult = await registerDoiForContent(id);
      
      if (doiResult.success) {
        console.log(`[Publish] DOI registered: ${doiResult.doi}`);
      } else {
        console.warn(`[Publish] DOI registration failed: ${doiResult.error}`);
        // Don't fail the publish - DOI can be retried later
      }
    }

    // Fetch updated content to include DOI if it was registered
    const finalContent = await prisma.content.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        doi: true,
        crossrefStatus: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      content: finalContent,
      doi: doiResult?.success ? doiResult.doi : null,
      doiRegistration: doiResult ? {
        success: doiResult.success,
        message: doiResult.message || doiResult.error,
      } : null,
      message: `Content ${
        status === 'PUBLISHED' ? 'published' : 
        status === 'DRAFT' ? 'moved to draft' : 
        status === 'ARCHIVED' ? 'archived' :
        'sent to review'
      } successfully${doiResult?.success ? ' with DOI' : ''}`,
    });

  } catch (error) {
    console.error('Error updating content status:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
