import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { requestId } = await req.json();

    // Use a transaction for consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find and validate the friend request
      const existingRequest = await tx.friendRequest.findUnique({
        where: { id: requestId },
        include: {
          sender: true,
          receiver: true,
        },
      });

      if (!existingRequest) {
        throw new Error('Friend request not found');
      }

      if (existingRequest.status !== 'PENDING') {
        throw new Error('Friend request already processed');
      }

      // 2. Update friend request status to rejected
      const updatedRequest = await tx.friendRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          updatedAt: new Date(), // Update the timestamp
        },
      });

      return {
        friendRequest: updatedRequest,
        message: 'Friend request rejected successfully'
      };
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error rejecting friend request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error rejecting friend request';
    return NextResponse.json({ error: errorMessage }, { status: 400 });

  } finally {
    await prisma.$disconnect();
  }
}
