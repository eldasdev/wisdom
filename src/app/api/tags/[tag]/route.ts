import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag: tagParam } = await params;
    const tagName = decodeURIComponent(tagParam);

    console.log('Fetching tag:', tagName);

    // First check if tag exists
    const tagExists = await prisma.tag.findUnique({
      where: { name: tagName },
      select: { id: true, name: true }
    });

    if (!tagExists) {
      console.log('Tag not found:', tagName);
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Find the tag and its associated content
    const tag = await prisma.tag.findUnique({
      where: { name: tagName },
      include: {
        content: {
          where: {
            content: {
              status: 'PUBLISHED'
            }
          },
          include: {
            content: true
          }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // If no published content with this tag, return early
    if (tag.content.length === 0) {
      return NextResponse.json({
        tag: tagName,
        totalContent: 0,
        contentTypes: {
          ARTICLE: 0,
          CASE_STUDY: 0,
          BOOK: 0,
          TEACHING_NOTE: 0,
          COLLECTION: 0
        },
        relatedTags: []
      });
    }

    // Process content types and counts
    const contentTypes = {
      ARTICLE: 0,
      CASE_STUDY: 0,
      BOOK: 0,
      TEACHING_NOTE: 0,
      COLLECTION: 0
    };

    tag.content.forEach(contentTag => {
      if (contentTag.content.type in contentTypes) {
        contentTypes[contentTag.content.type as keyof typeof contentTypes]++;
      }
    });

    const totalContent = Object.values(contentTypes).reduce((sum, count) => sum + count, 0);

    // Find related tags (simplified - for now just return empty array)
    // TODO: Implement related tags logic with proper Prisma queries
    const filteredRelatedTags: string[] = [];

    return NextResponse.json({
      tag: tagName,
      totalContent,
      contentTypes,
      relatedTags: filteredRelatedTags
    });

  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}