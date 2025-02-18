import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { requestId } = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      const existingRequest = await tx.friendRequest.findUnique({
        where: { id: requestId },
        include: {
          group: true,
          receiver: true,
        },
      });

      if (!existingRequest) {
        throw new Error('Friend request not found');
      }

      if (existingRequest.status !== 'PENDING') {
        throw new Error('Friend request already processed');
      }
      const existingMembership = await tx.groupMembership.findUnique({
        where: {
          userId_groupId: {
            userId: existingRequest.senderId,
            groupId: existingRequest.groupId,
          },
        },
      });

      if (existingMembership) {
        throw new Error('User is already a member of this group');
      }


      const updatedRequest = await tx.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });


      const newMembership = await tx.groupMembership.create({
        data: {
          userId: existingRequest.senderId,
          groupId: existingRequest.groupId,
          role: "MEMBER",
        },
      });

      return {
        friendRequest: updatedRequest,
        groupMembership: newMembership,
      };
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error processing friend request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error processing friend request';
    return NextResponse.json({ error: errorMessage }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
}
