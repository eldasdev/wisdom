import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all journals
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { issn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      where.status = status;
    }

    const journals = await prisma.journal.findMany({
      where,
      include: {
        _count: {
          select: {
            content: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ journals });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json({ error: 'Failed to fetch journals' }, { status: 500 });
  }
}

// POST - Create a new journal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      issn,
      eissn,
      publisher,
      frequency,
      language,
      openAccess,
      impactFactor,
      coverImage,
      website,
      submissionGuidelines,
      scope,
      indexedIn,
      status,
      featured,
      order
    } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // Check if slug already exists
    const existingJournal = await prisma.journal.findUnique({
      where: { slug }
    });

    if (existingJournal) {
      return NextResponse.json({ error: 'A journal with this slug already exists' }, { status: 409 });
    }

    const journal = await prisma.journal.create({
      data: {
        title,
        slug,
        description: description || null,
        issn: issn || null,
        eissn: eissn || null,
        publisher: publisher || null,
        frequency: frequency || null,
        language: language || null,
        openAccess: openAccess || false,
        impactFactor: impactFactor || null,
        coverImage: coverImage || null,
        website: website || null,
        submissionGuidelines: submissionGuidelines || null,
        scope: scope || null,
        indexedIn: indexedIn || null,
        status: status || 'DRAFT',
        featured: featured || false,
        order: order || 0
      }
    });

    return NextResponse.json({ journal }, { status: 201 });
  } catch (error) {
    console.error('Error creating journal:', error);
    return NextResponse.json({ error: 'Failed to create journal' }, { status: 500 });
  }
}
