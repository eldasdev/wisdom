import { ContentType, SearchFilters, PaginatedResponse, SerializableContent } from '../types';
import { prisma } from '../prisma';
import { ContentType as PrismaContentType } from '@prisma/client';

// Serialization utility to convert Date objects to ISO strings
function serializeContent(content: unknown[]): SerializableContent[];
function serializeContent(content: unknown): SerializableContent;
function serializeContent(content: unknown | unknown[]): SerializableContent | SerializableContent[] {
  if (Array.isArray(content)) {
    return content.map(item => serializeContent(item as unknown)) as SerializableContent[];
  }

  const serialized = { ...(content as object) } as Record<string, unknown>;
  if (serialized.publishedAt instanceof Date) {
    serialized.publishedAt = serialized.publishedAt.toISOString();
  }
  if (serialized.updatedAt instanceof Date) {
    serialized.updatedAt = serialized.updatedAt.toISOString();
  }
  return serialized as unknown as SerializableContent;
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
    const normalizedType = type.toUpperCase().replace(/-/g, '_');

    // Validate that it's a valid ContentType
    const validTypes = ['ARTICLE', 'CASE_STUDY', 'BOOK', 'BOOK_CHAPTER', 'TEACHING_NOTE', 'COLLECTION'];
    if (!validTypes.includes(normalizedType)) {
      throw new Error(`Invalid content type: ${type}`);
    }

    const content = await prisma.content.findMany({
      where: {
        type: normalizedType as PrismaContentType,
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
      tags: item.tags.map(ct => ct.tag.name)
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

    // Handle metadata filters (industry, company, sector, region, country, category, topic, subject)
    if (filters.industry && filters.industry.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['industry'],
          string_contains: filters.industry[0]
        }
      });
    }

    if (filters.company && filters.company.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['company'],
          string_contains: filters.company[0]
        }
      });
    }

    if (filters.sector && filters.sector.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['sector'],
          string_contains: filters.sector[0]
        }
      });
    }

    if (filters.region && filters.region.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['region'],
          string_contains: filters.region[0]
        }
      });
    }

    if (filters.country && filters.country.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['country'],
          string_contains: filters.country[0]
        }
      });
    }

    if (filters.category && filters.category.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['category'],
          string_contains: filters.category[0]
        }
      });
    }

    if (filters.topic && filters.topic.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['topic'],
          string_contains: filters.topic[0]
        }
      });
    }

    if (filters.subject && filters.subject.length > 0) {
      where.AND = where.AND || [];
      where.AND.push({
        metadata: {
          path: ['subject'],
          string_contains: filters.subject[0]
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

  // Get related content - ONLY returns content of the SAME TYPE
  static async getRelated(contentId: string, limit: number = 5): Promise<SerializableContent[]> {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        authors: { include: { author: true } },
        tags: { include: { tag: true } }
      }
    });

    if (!content) return [];

    console.log(`[getRelated] Looking for type: ${content.type}, contentId: ${contentId}`);

    // Only get content of the SAME TYPE - prioritize those with matching tags
    const tagIds = content.tags.map(ct => ct.tagId);
    
    const relatedContent = await prisma.content.findMany({
      where: {
        type: content.type, // SAME TYPE ONLY!
        status: 'PUBLISHED',
        id: { not: contentId }
      },
      include: {
        authors: { include: { author: true } },
        tags: { include: { tag: true } }
      },
      orderBy: [
        { featured: 'desc' }, // Featured first
        { publishedAt: 'desc' } // Then by date
      ],
      take: limit * 2 // Get more to sort by tag relevance
    });

    console.log(`[getRelated] Found ${relatedContent.length} items of type ${content.type}:`, 
      relatedContent.map(r => ({ id: r.id, type: r.type, title: r.title })));

    // Sort by tag relevance (more matching tags = higher priority)
    const sortedContent = relatedContent
      .map(item => {
        const itemTagIds = item.tags.map(t => t.tagId);
        const matchingTags = tagIds.filter(id => itemTagIds.includes(id)).length;
        return { item, matchingTags };
      })
      .sort((a, b) => b.matchingTags - a.matchingTags)
      .slice(0, limit)
      .map(({ item }) => item);

    return serializeContent(sortedContent.map(item => ({
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
      metadataResults
    ] = await Promise.all([
      prisma.tag.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
      prisma.author.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
      prisma.content.findMany({
        where: { status: 'PUBLISHED' },
        select: { metadata: true, type: true }
      })
    ]);

    // Initialize filter sets
    const industries = new Set<string>();
    const companies = new Set<string>();
    const sectors = new Set<string>();
    const regions = new Set<string>();
    const countries = new Set<string>();
    const categories = new Set<string>();
    const topics = new Set<string>();
    const subjects = new Set<string>();

    // Extract metadata values from all published content
    metadataResults.forEach(content => {
      if (content.metadata && typeof content.metadata === 'object') {
        const metadata = content.metadata as any;

        // Industry (case studies and other content)
        if ('industry' in metadata && metadata.industry) {
          industries.add(metadata.industry);
        }

        // Company (case studies, articles)
        if ('company' in metadata && metadata.company) {
          companies.add(metadata.company);
        }

        // Sector (broader industry classification)
        if ('sector' in metadata && metadata.sector) {
          sectors.add(metadata.sector);
        }

        // Region/Geographic location
        if ('region' in metadata && metadata.region) {
          regions.add(metadata.region);
        }

        // Country
        if ('country' in metadata && metadata.country) {
          countries.add(metadata.country);
        }

        // Category (articles, books, teaching notes)
        if ('category' in metadata && metadata.category) {
          categories.add(metadata.category);
        }

        // Topic (specific subject areas)
        if ('topic' in metadata && metadata.topic) {
          topics.add(metadata.topic);
        }

        // Subject (academic subjects for teaching notes)
        if ('subject' in metadata && metadata.subject) {
          subjects.add(metadata.subject);
        }
      }
    });

    return {
      industries: Array.from(industries).sort(),
      companies: Array.from(companies).sort(),
      sectors: Array.from(sectors).sort(),
      regions: Array.from(regions).sort(),
      countries: Array.from(countries).sort(),
      categories: Array.from(categories).sort(),
      topics: Array.from(topics).sort(),
      subjects: Array.from(subjects).sort(),
      tags: tagResults.map(t => t.name),
      authors: authorResults.map(a => a.name),
    };
  }
}

// Database-based data layer - no mock exports needed