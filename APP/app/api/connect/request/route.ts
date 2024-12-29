// import { PrismaClient } from '@prisma/client';
// import Redis from 'ioredis';
// import { NextRequest, NextResponse } from 'next/server';
// import { setTimeout } from 'timers/promises';

// const prisma = new PrismaClient();
// const redis = new Redis();

// export async function POST(req: NextRequest) {
//   try {
//     const { receiverId, senderId, message, skills, purpose, groupname, groupUrl } = await req.json();
//     if (!senderId) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }
//     if (senderId === receiverId) {
//       return NextResponse.json({ message: 'Cannot send a friend request to yourself' }, { status: 400 });
//     }

//     const requestId = `friendRequest:${senderId}:${receiverId}`;
//     const friendRequestData = {
//       senderId,
//       receiverId,
//       projectDescription: message,
//       purpose,
//       mutualSkill: skills,
//       groupname,
//       groupUrl,
//     };

//     // Store the friend request in Redis with a TTL (e.g., 1 hour)
//     await redis.set(requestId, JSON.stringify(friendRequestData), 'EX', 3600);

//     // Function to progressively store data into the database
//     async function storeFriendRequestInDB(requestId: string) {
//       try {

//         await setTimeout(5000);

//         // Retrieve friend request data from Redis
//         const friendRequestJSON = await redis.get(requestId);
//         if (friendRequestJSON) {
//           const friendRequest = JSON.parse(friendRequestJSON);

//           // Store the friend request into the database
//           await prisma.friendRequest.create({
//             data: friendRequest,
//           });

//           // Remove the friend request from Redis after storing in DB
//           await redis.del(requestId);
//         }
//       } catch (error) {
//         console.error('Error storing friend request in DB:', error);
//       }
//     }

//     // Call the function to progressively store the data into the database
//     storeFriendRequestInDB(requestId);

//     return NextResponse.json(
//       { message: 'Friend request created successfully and is being processed' },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error sending friend request:', error);
//     return NextResponse.json({ message: 'Error sending friend request' }, { status: 500 });
//   } finally {
//     // Disconnect Prisma and Redis (clean up resources)
//     await prisma.$disconnect();
//     redis.quit();
//   }
// }
// app/api/friend-request/send/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {



    const { receiverId, senderId, message, skills, purpose, groupname, groupUrl } = await req.json();
    console.log(message)
    console.log(receiverId, senderId)
    if (!senderId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (senderId === receiverId) {
      return NextResponse.json({ message: 'Cannot send friend request to yourself' }, { status: 400 });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        projectDescription: message,
        purpose: purpose,
        mutualSkill: skills,
        groupname,
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
