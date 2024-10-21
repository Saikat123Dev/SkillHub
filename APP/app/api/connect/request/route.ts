// app/api/friend-request/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { useSession }  from 'next-auth/react';
import { useCurrentUser } from "../../../../hooks/use-current-user"

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
  
   
   
    const { receiverId,senderId,message,skills,purpose,groupUrl } = await req.json();
     console.log(message)
   console.log(receiverId,senderId)
     if (!senderId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (senderId === receiverId) {
      return NextResponse.json({ message: 'Cannot send friend request to yourself' }, { status: 400 });
    }

    const existingRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json({ message: 'Friend request already exists' }, { status: 400 });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        projectDescription:message,
        purpose:purpose,
        mutualSkill:skills,
        groupUrl
      },
    });

    return NextResponse.json(friendRequest, { status: 201 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ message: 'Error sending friend request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}