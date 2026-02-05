import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single editorial board member
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const member = await prisma.editorialBoardMember.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          }
        }
      }
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error fetching editorial board member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an editorial board member
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { position, department, bio, order } = body;

    // Check if member exists
    const existingMember = await prisma.editorialBoardMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};
    if (position !== undefined) updateData.position = position || null;
    if (department !== undefined) updateData.department = department || null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (order !== undefined) updateData.order = order || 0;

    // Update member
    const member = await prisma.editorialBoardMember.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          }
        }
      }
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating editorial board member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove an editorial board member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if member exists
    const member = await prisma.editorialBoardMember.findUnique({
      where: { id }
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Delete member
    await prisma.editorialBoardMember.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error deleting editorial board member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}
