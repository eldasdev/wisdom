import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all tags
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            content: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const normalizedName = name.trim().toLowerCase();

    if (normalizedName.length < 2) {
      return NextResponse.json({ error: 'Tag name must be at least 2 characters' }, { status: 400 });
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: normalizedName }
    });

    if (existingTag) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }

    const tag = await prisma.tag.create({
      data: {
        name: normalizedName
      }
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
