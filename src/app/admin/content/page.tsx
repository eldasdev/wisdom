import { prisma } from '@/lib/prisma';
import { AdminContentClient } from './AdminContentClient';
import { ContentStatus } from '@prisma/client';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

// Valid status values
const validStatuses: ContentStatus[] = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];

export default async function AdminContentPage(props: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await props.searchParams;
  
  // Validate status parameter - also handle FEATURED as special filter
  const rawStatus = params.status;
  const isFeaturedFilter = rawStatus === 'FEATURED';
  const status: ContentStatus | undefined = !isFeaturedFilter && rawStatus && validStatuses.includes(rawStatus as ContentStatus)
    ? (rawStatus as ContentStatus)
    : undefined;
  
  const page = parseInt(params.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  // Get content with filters
  const content = await prisma.content.findMany({
    where: isFeaturedFilter 
      ? { featured: true } 
      : status 
        ? { status } 
        : {},
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      authors: {
        include: { author: true }
      },
      tags: {
        include: { tag: true }
      },
      _count: {
        select: {
          tags: true
        }
      }
    }
  });

  // Serialize dates to strings and transform structure for client component
  const serializedContent = content.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    content: item.content,
    type: item.type,
    status: item.status,
    featured: item.featured,
    publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
    updatedAt: item.updatedAt.toISOString(),
    createdAt: item.createdAt.toISOString(),
    metadata: item.metadata,
    viewCount: item.viewCount || 0,
    authors: item.authors.map(a => ({
      author: {
        id: a.author.id,
        name: a.author.name,
        title: a.author.title || undefined,
        institution: a.author.institution || undefined,
        bio: a.author.bio || undefined,
      }
    })),
    tags: item.tags.map(t => ({
      tag: {
        id: t.tag.id,
        name: t.tag.name,
      }
    })),
  }));

  // Get counts for each status
  const [draftCount, reviewCount, publishedCount, archivedCount, featuredCount, totalCount] = await Promise.all([
    prisma.content.count({ where: { status: 'DRAFT' } }),
    prisma.content.count({ where: { status: 'REVIEW' } }),
    prisma.content.count({ where: { status: 'PUBLISHED' } }),
    prisma.content.count({ where: { status: 'ARCHIVED' } }),
    prisma.content.count({ where: { featured: true } }),
    prisma.content.count()
  ]);

  const statusCounts = {
    DRAFT: draftCount,
    REVIEW: reviewCount,
    PUBLISHED: publishedCount,
    ARCHIVED: archivedCount,
    FEATURED: featuredCount,
    ALL: totalCount
  };

  return (
    <AdminContentClient
      initialContent={serializedContent}
      statusCounts={statusCounts}
      currentStatus={isFeaturedFilter ? 'FEATURED' : status}
    />
  );
}