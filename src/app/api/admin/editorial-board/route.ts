import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET - List all editorial board members
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: Prisma.EditorialBoardMemberWhereInput = search
      ? {
          OR: [
            { user: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } },
            { user: { email: { contains: search, mode: Prisma.QueryMode.insensitive } } },
            { position: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { department: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ]
        }
      : {};

    const members = await prisma.editorialBoardMember.findMany({
      where,
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
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching editorial board members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add a new editorial board member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, position, department, bio, order } = body;

    // Validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.editorialBoardMember.findUnique({
      where: { userId }
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of the editorial board' }, { status: 409 });
    }

    // Create editorial board member
    const member = await prisma.editorialBoardMember.create({
      data: {
        userId,
        position: position || null,
        department: department || null,
        bio: bio || null,
        order: order || 0,
      },
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

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Error creating editorial board member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}
