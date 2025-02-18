export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const receiverId = searchParams.get('receiverId');

    if (!receiverId) {
      return NextResponse.json({ message: 'Receiver ID is required' }, { status: 400 });
    }

    const sentRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId
      },
      select: {
        id: true,
        status:true,
        purpose: true,        // Optional field
        mutualSkill: true,    // Optional field
        projectDescription: true,
        createdAt: true,
        updatedAt: true,
        groupname: true,
        groupUrl: true,
        receiverId:true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            grpname: true,
            grpbio: true,
          },
        },
        post: {
          select: {
            id: true,
            description: true,
            techStack: true,
            looking: true,
          },
        },
      }
    });

    if (!sentRequests.length) {
      return NextResponse.json({ message: 'No friend requests found for this receiver' }, { status: 200 });
    }

    return NextResponse.json(sentRequests, { status: 200 });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json({ message: 'Error fetching friend requests' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
