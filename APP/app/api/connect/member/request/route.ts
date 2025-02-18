import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {
      receiverId,
      senderId,
      projectDescription,
      groupname,
      groupId,
      postId
    } = await req.json();
    if (!senderId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { message: 'Cannot send friend request to yourself' },
        { status: 400 }
      );
    }

    // Verify all required entities exist
    const [sender, receiver, group] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
      groupId ? prisma.group.findUnique({ where: { id: groupId } }) : null
    ]);

    if (!sender || !receiver) {
      return NextResponse.json(
        { message: 'Sender or receiver not found' },
        { status: 404 }
      );
    }

    if (groupId && !group) {
      return NextResponse.json(
        { message: 'Group not found' },
        { status: 404 }
      );
    }

    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return NextResponse.json(
          { message: 'Post not found' },
          { status: 404 }
        );
      }
    }

    // Check for existing request
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        AND: [
          { senderId },
          { receiverId },
          { groupId },
          { status: 'PENDING' }
        ]
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: 'Friend request already exists' },
        { status: 400 }
      );
    }

    // Create friend request with all relationships
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        projectDescription,
        groupname,
        ...(groupId && { groupId }),
        ...(postId && { postId })
      }
    });

    // Fetch complete data with all relations
    const friendRequestWithData = await prisma.friendRequest.findUnique({
      where: { id: friendRequest.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        post: postId ? {
          select: {
            id: true,
            description: true,
            techStack: true,
            looking: true
          }
        } : false,
        group: groupId ? {
          select: {
            id: true,
            grpname: true,
            grpbio: true
          }
        } : false
      }
    });

    return NextResponse.json(
      {
        message: 'Friend request sent successfully',
        friendRequest: friendRequestWithData
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json(
      { message: 'Error sending friend request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
