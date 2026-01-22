import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Simple validation function for content updates
function validateUpdateContentData(data: any) {
  const errors: string[] = [];

  // Validate optional fields if provided
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
    errors.push('Title must be a non-empty string');
  }
  if (data.slug !== undefined && (typeof data.slug !== 'string' || data.slug.trim().length === 0)) {
    errors.push('Slug must be a non-empty string');
  }
  if (data.description !== undefined && (typeof data.description !== 'string' || data.description.trim().length === 0)) {
    errors.push('Description must be a non-empty string');
  }
  if (data.content !== undefined && (typeof data.content !== 'string' || data.content.trim().length === 0)) {
    errors.push('Content must be a non-empty string');
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }
  // PDF fields are optional and can be null/undefined to remove them
  if (data.pdfUrl !== undefined && data.pdfUrl !== null && typeof data.pdfUrl !== 'string') {
    errors.push('PDF URL must be a string');
  }
  if (data.pdfFileName !== undefined && data.pdfFileName !== null && typeof data.pdfFileName !== 'string') {
    errors.push('PDF file name must be a string');
  }

  return {
    success: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params in Next.js 15
    const { id } = await context.params;

    // Get author's profile
    const author = await prisma.author.findUnique({
      where: { email: session.user.email! }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      );
    }

    const content = await prisma.content.findFirst({
      where: {
        id: id,
        authors: {
          some: {
            authorId: author.id
          }
        }
      },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params in Next.js 15
    const { id } = await params;

    // Get author's profile
    const author = await prisma.author.findUnique({
      where: { email: session.user.email! }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      );
    }

    // Check if content exists and belongs to author
    const existingContent = await prisma.content.findFirst({
      where: {
        id: id,
        authors: {
          some: {
            authorId: author.id
          }
        }
      },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = validateUpdateContentData(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.errors },
        { status: 400 }
      );
    }

    const { title, slug, description, content, tags, metadata, pdfUrl, pdfFileName } = validationResult.data;

    // Check slug uniqueness if slug is being changed
    if (slug && slug !== existingContent.slug) {
      const slugExists = await prisma.content.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists. Please choose a different slug.' },
          { status: 400 }
        );
      }
    }

    // Update content in transaction with extended timeout
    const result = await prisma.$transaction(async (tx) => {
      // Update content
      const updatedContent = await tx.content.update({
        where: { id: id },
        data: {
          ...(title && { title }),
          ...(slug && { slug }),
          ...(description && { description }),
          ...(content && { content }),
          ...(metadata && { metadata }),
          // PDF fields - can be set to null to remove
          ...(pdfUrl !== undefined && { pdfUrl: pdfUrl || null }),
          ...(pdfFileName !== undefined && { pdfFileName: pdfFileName || null }),
        },
      });

      // Update tags if provided
      if (tags !== undefined) {
        // Remove existing tag relationships
        await tx.contentTag.deleteMany({
          where: { contentId: id }
        });

        // Add new tag relationships in batch
        if (tags.length > 0) {
          // First, upsert all tags to ensure they exist
          const tagPromises = tags.map((tagName: string) =>
            tx.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName },
            })
          );

          const tagResults = await Promise.all(tagPromises);

          // Then create all content-tag relationships
          const contentTagPromises = tagResults.map(tag =>
            tx.contentTag.create({
              data: {
                contentId: id,
                tagId: tag.id,
              },
            })
          );

          await Promise.all(contentTagPromises);
        }
      }

      // Return updated content with relationships
      return await tx.content.findUnique({
        where: { id: id },
        include: {
          authors: {
            include: { author: true }
          },
          tags: {
            include: { tag: true }
          }
        }
      });
    }, {
      timeout: 10000, // 10 second timeout instead of default 5 seconds
    });

    return NextResponse.json({
      success: true,
      content: result,
      message: 'Content updated successfully'
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params in Next.js 15
    const { id } = await params;

    // Get author's profile
    const author = await prisma.author.findUnique({
      where: { email: session.user.email! }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      );
    }

    // Check if content exists and belongs to author
    const content = await prisma.content.findFirst({
      where: {
        id: id,
        authors: {
          some: {
            authorId: author.id
          }
        }
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      );
    }

    // Only allow deletion of draft content
    if (content.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft content can be deleted' },
        { status: 400 }
      );
    }

    // Delete content (cascade will handle relationships)
    await prisma.content.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}