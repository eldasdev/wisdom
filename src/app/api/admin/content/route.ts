import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Simple validation function instead of Zod for now
function validateAdminContentData(data: any) {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) {
    errors.push('Slug is required');
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    errors.push('Content is required');
  }
  if (!data.type || !['ARTICLE', 'CASE_STUDY', 'BOOK', 'BOOK_CHAPTER', 'TEACHING_NOTE'].includes(data.type)) {
    errors.push('Valid content type is required');
  }
  if (!data.authorIds || !Array.isArray(data.authorIds) || data.authorIds.length === 0) {
    errors.push('At least one author is required');
  }
  if (data.status && !['DRAFT', 'REVIEW', 'PUBLISHED'].includes(data.status)) {
    errors.push('Invalid status');
  }

  return {
    success: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = validateAdminContentData(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.errors },
        { status: 400 }
      );
    }

    const { title, slug, description, content, type, status, featured, authorIds, tags, metadata, pdfUrl, pdfFileName } = validationResult.data;

    // Check if slug is unique
    const existingContent = await prisma.content.findUnique({
      where: { slug }
    });

    if (existingContent) {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a different slug.' },
        { status: 400 }
      );
    }

    // Verify authors exist
    const authors = await prisma.author.findMany({
      where: { id: { in: authorIds } }
    });

    if (authors.length !== authorIds.length) {
      return NextResponse.json(
        { error: 'One or more authors not found' },
        { status: 400 }
      );
    }

    // Start a transaction to create content and relationships
    const result = await prisma.$transaction(async (tx) => {
      // Create the content
      const newContent = await tx.content.create({
        data: {
          title,
          slug,
          description,
          content,
          type,
          status,
          featured,
          metadata,
          pdfUrl: pdfUrl || null,
          pdfFileName: pdfFileName || null,
          publishedAt: new Date(), // Always set publishedAt on creation
        },
      });

      // Create author relationships
      for (const authorId of authorIds) {
        await tx.contentAuthor.create({
          data: {
            contentId: newContent.id,
            authorId,
          },
        });
      }

      // Create tag relationships
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });

          // Create content-tag relationship
          await tx.contentTag.create({
            data: {
              contentId: newContent.id,
              tagId: tag.id,
            },
          });
        }
      }

      return newContent;
    });

    return NextResponse.json({
      success: true,
      content: result,
      message: 'Content created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          authors: {
            include: { author: true }
          },
          tags: {
            include: { tag: true }
          },
          _count: {
            select: {
              authors: true,
              tags: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.content.count({ where })
    ]);

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}