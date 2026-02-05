import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Public API route to fetch editorial board members
export async function GET(request: NextRequest) {
  try {
    const members = await prisma.editorialBoardMember.findMany({
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

    // Also try to get author profile information if available
    const userEmails = members.map(m => m.user.email);
    const authors = await prisma.author.findMany({
      where: { email: { in: userEmails } },
      select: {
        email: true,
        institution: true,
        title: true,
      }
    });

    // Create a map for quick lookup
    const authorByEmail = new Map(authors.map(a => [a.email, a]));

    // Combine member data with author profile data
    const membersWithDetails = members.map(member => {
      const authorProfile = authorByEmail.get(member.user.email);
      
      return {
        id: member.id,
        name: member.user.name || 'Unnamed',
        email: member.user.email,
        image: member.user.image,
        position: member.position || authorProfile?.title || member.user.role,
        institution: authorProfile?.institution || null,
        department: member.department || null,
        expertise: member.department || authorProfile?.title || null,
        bio: member.bio || null,
        order: member.order,
      };
    });

    return NextResponse.json({ members: membersWithDetails });
  } catch (error) {
    console.error('Error fetching editorial board members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
