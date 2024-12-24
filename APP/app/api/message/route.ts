import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const requestId = searchParams.get("requestId");

  const user = await db.message.findMany({
    where: {
      groupId:id
    },
  });

  return NextResponse.json(user);
}
