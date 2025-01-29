import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("id");

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
  }

  // Fetch all messages in the group
  const messages = await db.message.findMany({
    where: { groupId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
    },
  });

  // Extract unique user IDs
  const userIds = [...new Set(messages.map((msg) => msg.userId))];

  // Fetch user details (name) for these user IDs
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  });

  // Create a map of userId -> userName for quick lookup
  const userMap = Object.fromEntries(users.map((user) => [user.id, user.name]));

  // Attach user names to messages
  const enrichedMessages = messages.map((msg) => ({
    ...msg,
    userName: userMap[msg.userId] || "Unknown User",
  }));

  return NextResponse.json({ messages: enrichedMessages });
}
