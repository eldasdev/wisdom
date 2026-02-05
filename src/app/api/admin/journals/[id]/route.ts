import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single journal
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            content: true
          }
        }
      }
    });

    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
    }

    return NextResponse.json({ journal });
  } catch (error) {
    console.error('Error fetching journal:', error);
    return NextResponse.json({ error: 'Failed to fetch journal' }, { status: 500 });
  }
}

// PUT - Update a journal
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if journal exists
    const existingJournal = await prisma.journal.findUnique({
      where: { id }
    });

    if (!existingJournal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
    }

    // If slug is being changed, check if new slug is available
    if (slug && slug !== existingJournal.slug) {
      const slugTaken = await prisma.journal.findUnique({
        where: { slug }
      });

      if (slugTaken) {
        return NextResponse.json({ error: 'A journal with this slug already exists' }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description || null;
    if (issn !== undefined) updateData.issn = issn || null;
    if (eissn !== undefined) updateData.eissn = eissn || null;
    if (publisher !== undefined) updateData.publisher = publisher || null;
    if (frequency !== undefined) updateData.frequency = frequency || null;
    if (language !== undefined) updateData.language = language || null;
    if (openAccess !== undefined) updateData.openAccess = openAccess;
    if (impactFactor !== undefined) updateData.impactFactor = impactFactor || null;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (website !== undefined) updateData.website = website || null;
    if (submissionGuidelines !== undefined) updateData.submissionGuidelines = submissionGuidelines || null;
    if (scope !== undefined) updateData.scope = scope || null;
    if (indexedIn !== undefined) updateData.indexedIn = indexedIn || null;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (order !== undefined) updateData.order = order;

    const journal = await prisma.journal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ journal });
  } catch (error) {
    console.error('Error updating journal:', error);
    return NextResponse.json({ error: 'Failed to update journal' }, { status: 500 });
  }
}

// DELETE - Delete a journal
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if journal exists
    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            content: true
          }
        }
      }
    });

    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
    }

    // Check if journal has content
    if (journal._count.content > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete journal with published content. Please remove or reassign content first.' 
      }, { status: 400 });
    }

    await prisma.journal.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal:', error);
    return NextResponse.json({ error: 'Failed to delete journal' }, { status: 500 });
  }
}
