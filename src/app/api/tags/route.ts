import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all tags with their content counts and type breakdown
    const tagsWithCounts = await prisma.tag.findMany({
      include: {
        content: {
          include: {
            content: {
              select: {
                type: true,
                status: true
              }
            }
          },
          where: {
            content: {
              status: 'PUBLISHED'
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Process the data to get counts by content type
    const processedTags = tagsWithCounts
      .filter(tag => tag.content.length > 0) // Only include tags that have published content
      .map(tag => {
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

        const totalCount = Object.values(contentTypes).reduce((sum, count) => sum + count, 0);

        return {
          name: tag.name,
          count: totalCount,
          contentTypes
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by popularity

    // Calculate statistics
    const totalTags = processedTags.length;
    const totalContent = processedTags.reduce((sum, tag) => sum + tag.count, 0);
    const avgTagsPerContent = totalContent > 0 ? totalContent / totalTags : 0;

    return NextResponse.json({
      tags: processedTags,
      totalTags,
      totalContent,
      avgTagsPerContent
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}