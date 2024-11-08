// app/api/friend-request/accept/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { requestId } = await req.json();
    console.log(requestId)
    const existingRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return NextResponse.json({ message: 'Friend request not found' }, { status: 404 });
    }

    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json({ message: 'Friend request already processed' }, { status: 400 });
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json({ message: 'Error accepting friend request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
