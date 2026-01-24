import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single tag
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            content: true
          }
        }
      }
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ tag });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

// PUT - Update a tag
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const normalizedName = name.trim().toLowerCase();

    if (normalizedName.length < 2) {
      return NextResponse.json({ error: 'Tag name must be at least 2 characters' }, { status: 400 });
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Check if another tag with the same name exists
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name: normalizedName,
        NOT: { id }
      }
    });

    if (duplicateTag) {
      return NextResponse.json({ error: 'A tag with this name already exists' }, { status: 409 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: { name: normalizedName }
    });

    return NextResponse.json({ tag });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

// DELETE - Delete a tag
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Delete the tag (this will also delete related ContentTag entries due to cascade)
    await prisma.tag.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
