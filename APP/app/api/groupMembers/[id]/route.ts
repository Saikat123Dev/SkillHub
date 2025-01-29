import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db'; // Import your database client

export async function GET(req: NextRequest) {
  try {
    // Extract the `id` from the URL parameters
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }

    const member = await db.groupMembership.findMany({
      where: {
        groupId: id,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error("Error in getMember function:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}
