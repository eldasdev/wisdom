import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        authoredContent: {
          include: {
            content: {
              select: {
                id: true,
                title: true,
                slug: true,
                type: true,
                publishedAt: true,
                status: true
              }
            }
          }
        },
        _count: {
          select: { authoredContent: true }
        }
      }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { name, title, institution, bio, email, website, linkedin, twitter, image } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        title,
        institution,
        bio,
        email,
        website,
        linkedin,
        twitter,
        image,
      },
    });

    return NextResponse.json(author);
  } catch (error) {
    console.error('Error updating author:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if author has any content
    const authorWithContent = await prisma.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: { authoredContent: true }
        }
      }
    });

    if (!authorWithContent) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    if (authorWithContent._count.authoredContent > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author with associated content. Remove content associations first.' },
        { status: 400 }
      );
    }

    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
