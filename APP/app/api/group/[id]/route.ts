import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth'; // update path based on your auth setup
import { db } from '@/lib/db';


export async function POST(request: NextRequest) {
  try {
    const { groupId, userId, role = "MEMBER" } = await request.json();
    

    const newMember = await db.groupMembership.create({
      data: {
        userId,
        groupId,
        role,
      },
    });
    
    console.log("New member added:", newMember);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error in addMemberToGroup function:", error);
    return NextResponse.json(
      { error: "Failed to add member to group" },
      { status: 500 }
    );
  }
}
