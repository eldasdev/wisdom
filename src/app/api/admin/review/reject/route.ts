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
    const { type, id, reason } = body;

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
    }

    switch (type) {
      case 'content': {
        const content = await prisma.content.findUnique({ where: { id } });
        if (!content) {
          return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }
        
        // Reject = change status from REVIEW back to DRAFT
        const updated = await prisma.content.update({
          where: { id },
          data: {
            status: 'DRAFT'
          }
        });
        
        return NextResponse.json({ message: 'Content rejected and moved to draft', content: updated });
      }

      case 'journal': {
        const journal = await prisma.journal.findUnique({ where: { id } });
        if (!journal) {
          return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
        }
        
        // Reject = keep as DRAFT or move to ARCHIVED
        // For now, we'll keep it as DRAFT (admin can delete manually if needed)
        return NextResponse.json({ message: 'Journal rejected', journal });
      }

      case 'user': {
        // For users, rejection might mean deactivating or deleting
        // This is a placeholder - adjust based on your user rejection logic
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // User rejection might not require deletion, just return success
        return NextResponse.json({ message: 'User rejected', user });
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error rejecting item:', error);
    return NextResponse.json({ error: 'Failed to reject item' }, { status: 500 });
  }
}
