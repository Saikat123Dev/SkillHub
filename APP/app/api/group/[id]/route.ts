import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const { groupId, userId, role = "MEMBER" } = await request.json();
    console.log(groupId, userId, role);
    const existingMembership = await db.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });
    if (existingMembership) {
      return NextResponse.json({ error: "User is already a member of this group" }, { status: 400 });
    }
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
