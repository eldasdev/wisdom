import { prisma } from '@/lib/prisma';
import { AdminContentClient } from './AdminContentClient';
import { ContentStatus } from '@prisma/client';

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string }
}) {
  const params = await searchParams;
  const status = params.status as ContentStatus | undefined;
  const page = parseInt(params.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  // Get content with filters
  const content = await prisma.content.findMany({
    where: status ? { status } : {},
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

  // Get counts for each status
  const [draftCount, reviewCount, publishedCount, totalCount] = await Promise.all([
    prisma.content.count({ where: { status: 'DRAFT' } }),
    prisma.content.count({ where: { status: 'REVIEW' } }),
    prisma.content.count({ where: { status: 'PUBLISHED' } }),
    prisma.content.count()
  ]);

  const statusCounts = {
    DRAFT: draftCount,
    REVIEW: reviewCount,
    PUBLISHED: publishedCount,
    ALL: totalCount
  };

  return (
    <AdminContentClient
      initialContent={content}
      statusCounts={statusCounts}
      currentStatus={status}
    />
  );
}