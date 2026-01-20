import { ContentType, SearchFilters, PaginatedResponse, SerializableContent } from '../types';
import { prisma } from '../prisma';

// Serialization utility to convert Date objects to ISO strings
function serializeContent<T extends any | any[]>(content: T): T extends any[] ? SerializableContent[] : SerializableContent {
  if (Array.isArray(content)) {
    return content.map(item => serializeContent(item)) as T extends any[] ? SerializableContent[] : never;
  }

  const serialized = { ...content } as any;
  if (serialized.publishedAt instanceof Date) {
    serialized.publishedAt = serialized.publishedAt.toISOString();
  }
  if (serialized.updatedAt instanceof Date) {
    serialized.updatedAt = serialized.updatedAt.toISOString();
  }
  return serialized;
}

// Data access functions
export class ContentDataLayer {
  // Get all content
  static async getAll(): Promise<SerializableContent[]> {
    const content = await prisma.content.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    return serializeContent(content.map(item => ({
      ...item,
      authors: item.authors.map(ca => ca.author),
      tags: item.tags.map(ct => ct.tag.name)
    })));
  }

  // Get content by ID
  static async getById(id: string): Promise<SerializableContent | null> {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      }
    });

    if (!content) return null;

    return serializeContent({
      ...content,
      authors: content.authors.map(ca => ca.author),
      tags: content.tags.map(ct => ct.tag.name)
    });
  }

  // Get content by slug
  static async getBySlug(slug: string): Promise<SerializableContent | null> {
    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      }
    });

    if (!content) return null;

    return serializeContent({
      ...content,
      authors: content.authors.map(ca => ca.author),
      tags: content.tags.map(ct => ct.tag.name)
    });
  }

  // Get content by type
  static async getByType(type: string): Promise<SerializableContent[]> {
    // Convert URL parameter (case-study) to enum format (CASE_STUDY)
    const normalizedType = type.toUpperCase().replace(/-/g, '_') as ContentType;

    // Validate that it's a valid ContentType
    const validTypes: ContentType[] = ['ARTICLE', 'CASE_STUDY', 'BOOK', 'BOOK_CHAPTER', 'TEACHING_NOTE', 'COLLECTION'];
    if (!validTypes.includes(normalizedType)) {
      throw new Error(`Invalid content type: ${type}`);
    }

    const content = await prisma.content.findMany({
      where: {
        type: normalizedType,
        status: 'PUBLISHED'
      },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    return serializeContent(content.map(item => ({
      ...item,
      authors: item.authors.map(ca => ca.author),
      tags: item.tags.map(ct => ct.tag.name)
    })));
  }

  // Get featured content
  static async getFeatured(): Promise<SerializableContent[]> {
    const content = await prisma.content.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED'
      },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    return serializeContent(content.map(item => ({
      ...item,
      authors: item.authors.map(ca => ca.author),
      tags: item.tags.map(ct => ct.tag.name)
    })));
  }

  // Get recent content (last 30 days)
  static async getRecent(limit: number = 10): Promise<SerializableContent[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const content = await prisma.content.findMany({
      where: {
        publishedAt: { gte: thirtyDaysAgo },
        status: 'PUBLISHED'
      },
      include: {
        authors: {
          include: { author: true }
        },
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    });

    return serializeContent(content.map(item => ({
      ...item,
      authors: item.authors.map(ca => ca.author),
      tags: content.tags.map(ct => ct.tag.name)
    })));
  }

  // Search content with filters
  static async search(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<SerializableContent>> {
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      status: 'PUBLISHED'
    };

    // Apply text search
    if (query.trim()) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        {
          authors: {
            some: {
              author: {
                name: { contains: query, mode: 'insensitive' }
              }
            }
          }
        },
        {
          tags: {
            some: {
              tag: {
                name: { contains: query, mode: 'insensitive' }
              }
            }
          }
        }
      ];
    }

    // Apply type filters
    if (filters.type && filters.type.length > 0) {
      where.type = { in: filters.type.map(t => t.toUpperCase()) };
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: { in: filters.tags }
          }
        }
      };
    }

    // Apply author filters
    if (filters.authors && filters.authors.length > 0) {
      where.authors = {
        some: {
          author: {
            name: { in: filters.authors }
          }
        }
      };
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    // Apply date filters
    if (filters.dateFrom || filters.dateTo) {
      where.publishedAt = {};
      if (filters.dateFrom) {
        where.publishedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.publishedAt.lte = filters.dateTo;
      }
    }

    // Handle metadata filters (industry, category)
    if (filters.industry && filters.industry.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        type: 'CASE_STUDY',
        metadata: {
          path: ['industry'],
          string_contains: filters.industry[0] // Simplified - takes first industry
        }
      });
    }

    if (filters.category && filters.category.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        type: 'ARTICLE',
        metadata: {
          path: ['category'],
          string_contains: filters.category[0] // Simplified - takes first category
        }
      });
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
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.content.count({ where })
    ]);

    const items = serializeContent(content.map(item => ({
      ...item,
      authors: item.authors.map(ca => ca.author),
      tags: item.tags.map(ct => ct.tag.name)
    })));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  // Get related content (by tags, authors, or type)
  static async getRelated(contentId: string, limit: number = 5): Promise<SerializableContent[]> {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        authors: { include: { author: true } },
        tags: { include: { tag: true } }
      }
    });

    if (!content) return [];

    const related: any[] = [];
    const seen = new Set([contentId]);

    // Find content with matching tags
    if (content.tags.length > 0 && related.length < limit) {
      const tagIds = content.tags.map(ct => ct.tagId);
      const taggedContent = await prisma.content.findMany({
        where: {
          tags: {
            some: {
              tagId: { in: tagIds }
            }
          },
          status: 'PUBLISHED',
          id: { not: contentId }
        },
        include: {
          authors: { include: { author: true } },
          tags: { include: { tag: true } }
        },
        take: limit - related.length
      });

      taggedContent.forEach(item => {
        if (!seen.has(item.id)) {
          related.push(item);
          seen.add(item.id);
        }
      });
    }

    // Find content by same authors
    if (related.length < limit && content.authors.length > 0) {
      const authorIds = content.authors.map(ca => ca.authorId);
      const authorContent = await prisma.content.findMany({
        where: {
          authors: {
            some: {
              authorId: { in: authorIds }
            }
          },
          status: 'PUBLISHED',
          id: { not: contentId },
          id: { notIn: Array.from(seen) }
        },
        include: {
          authors: { include: { author: true } },
          tags: { include: { tag: true } }
        },
        take: limit - related.length
      });

      authorContent.forEach(item => {
        if (!seen.has(item.id)) {
          related.push(item);
          seen.add(item.id);
        }
      });
    }

    // Find content of same type
    if (related.length < limit) {
      const typeContent = await prisma.content.findMany({
        where: {
          type: content.type,
          status: 'PUBLISHED',
          id: { not: contentId },
          id: { notIn: Array.from(seen) }
        },
        include: {
          authors: { include: { author: true } },
          tags: { include: { tag: true } }
        },
        take: limit - related.length
      });

      typeContent.forEach(item => {
        if (!seen.has(item.id)) {
          related.push(item);
          seen.add(item.id);
        }
      });
    }

    return serializeContent(related.map(item => ({
      ...item,
      authors: item.authors.map(ca => ca.author),
      tags: item.tags.map(ct => ct.tag.name)
    })));
  }

  // Get content statistics
  static async getStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      total,
      featured,
      recent,
      authorsCount,
      tagsCount,
      typeStats
    ] = await Promise.all([
      prisma.content.count({ where: { status: 'PUBLISHED' } }),
      prisma.content.count({ where: { featured: true, status: 'PUBLISHED' } }),
      prisma.content.count({
        where: {
          publishedAt: { gte: thirtyDaysAgo },
          status: 'PUBLISHED'
        }
      }),
      prisma.author.count(),
      prisma.tag.count(),
      prisma.content.groupBy({
        by: ['type'],
        where: { status: 'PUBLISHED' },
        _count: true
      })
    ]);

    const byType: Record<string, number> = {};
    typeStats.forEach(stat => {
      byType[stat.type.toLowerCase()] = stat._count;
    });

    return {
      total,
      byType,
      featured,
      recent,
      authors: authorsCount,
      tags: tagsCount,
    };
  }

  // Get unique values for filters
  static async getFilterOptions() {
    const [
      tagResults,
      authorResults,
      industryResults,
      categoryResults
    ] = await Promise.all([
      prisma.tag.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
      prisma.author.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
      prisma.content.findMany({
        where: { type: 'CASE_STUDY', status: 'PUBLISHED' },
        select: { metadata: true }
      }),
      prisma.content.findMany({
        where: { type: 'ARTICLE', status: 'PUBLISHED' },
        select: { metadata: true }
      })
    ]);

    const industries = new Set<string>();
    const categories = new Set<string>();

    industryResults.forEach(content => {
      if (content.metadata && typeof content.metadata === 'object' && 'industry' in content.metadata) {
        industries.add((content.metadata as any).industry);
      }
    });

    categoryResults.forEach(content => {
      if (content.metadata && typeof content.metadata === 'object' && 'category' in content.metadata) {
        categories.add((content.metadata as any).category);
      }
    });

    return {
      industries: Array.from(industries).sort(),
      categories: Array.from(categories).sort(),
      tags: tagResults.map(t => t.name),
      authors: authorResults.map(a => a.name),
    };
  }
}

// Database-based data layer - no mock exports needed