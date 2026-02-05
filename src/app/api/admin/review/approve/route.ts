import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
    }

    switch (type) {
      case 'content': {
        const content = await prisma.content.findUnique({ where: { id } });
        if (!content) {
          return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }
        
        // Approve = change status from REVIEW to PUBLISHED
        const updated = await prisma.content.update({
          where: { id },
          data: {
            status: 'PUBLISHED',
            publishedAt: content.publishedAt || new Date()
          }
        });
        
        return NextResponse.json({ message: 'Content approved and published', content: updated });
      }

      case 'journal': {
        const journal = await prisma.journal.findUnique({ where: { id } });
        if (!journal) {
          return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
        }
        
        // Approve = change status from DRAFT to PUBLISHED
        const updated = await prisma.journal.update({
          where: { id },
          data: {
            status: 'PUBLISHED'
          }
        });
        
        return NextResponse.json({ message: 'Journal approved and published', journal: updated });
      }

      case 'user': {
        // For users, approval might mean activating their account
        // This is a placeholder - adjust based on your user approval logic
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // User approval might not require status change, just return success
        return NextResponse.json({ message: 'User approved', user });
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error approving item:', error);
    return NextResponse.json({ error: 'Failed to approve item' }, { status: 500 });
  }
}
