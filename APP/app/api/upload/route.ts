import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";

import { getUserById } from "@/data/user";







const ProfilePicSchema = z.object({
  profilePic: z.string().url(),
});



// Function to update the profile picture
export const updateProfilePic = async (
  values: z.infer<typeof ProfilePicSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // Validate the incoming values against the ProfilePicSchema
  const validationResult = ProfilePicSchema.safeParse(values);
  if (!validationResult.success) {
    return { error: validationResult.error.errors };
  }

 
  await db.user.update({
    where: { id: user.id },
    data: {
      profilePic: validationResult.data.profilePic,
    },
  });
}


export const getProfilePic = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }


 

  // If not found in Redis, fetch from the database
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }
}
// API handler functions
export const GET = async (req: NextRequest) => {
  try {
    const profilePic = await getProfilePic();
    return NextResponse.json(profilePic);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const values = await req.json();
    const result = await updateProfilePic(values);
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
