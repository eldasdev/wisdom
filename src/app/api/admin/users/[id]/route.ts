import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single user
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    // Try to find associated author profile by email
    let authorProfile = null;
    if (user?.email) {
      authorProfile = await prisma.author.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          title: true,
          institution: true,
          bio: true,
        }
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: { ...user, author: authorProfile } });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT - Update a user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent demoting the last admin
    if (existingUser.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });
      
      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: 'Cannot change role: This is the only admin account' 
        }, { status: 400 });
      }
    }

    // Build update data
    const updateData: any = {};

    if (name && typeof name === 'string' && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        // Check if email is taken by another user
        const emailTaken = await prisma.user.findFirst({
          where: {
            email: email.toLowerCase(),
            NOT: { id }
          }
        });
        
        if (emailTaken) {
          return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
        }
        
        updateData.email = email.toLowerCase();
      }
    }

    if (password && typeof password === 'string' && password.length >= 8) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (role && ['USER', 'AUTHOR', 'ADMIN', 'EDITOR', 'REVIEWER'].includes(role)) {
      updateData.role = role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Delete a user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting yourself
    if (user.id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Prevent deleting the last admin
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });
      
      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete: This is the only admin account' 
        }, { status: 400 });
      }
    }

    // Delete the user (cascade will handle related records)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
