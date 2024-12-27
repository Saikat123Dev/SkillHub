export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const receiverId = searchParams.get('receiverId');
    if (!receiverId) {
      return NextResponse.json({ message: 'Receiver ID is required' }, { status: 400 });
    }

    const sentRequests = await prisma.friendRequest.findMany({
      where: { receiverId: receiverId }, // Ensure we filter by the receiverId
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (sentRequests.length === 0) {
      return NextResponse.json({ message: 'No friend requests found for this receiver' }, { status: 200 });
    }

    return NextResponse.json(sentRequests, { status: 200 });
  } catch (error) {
    console.error('Error fetching sent friend requests:', error);
    return NextResponse.json({ message: 'Error fetching friend requests' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
