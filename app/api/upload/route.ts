import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";

// Define a schema for the prcofile piture update
const ProfilePicSchema = z.object({
  profilePic: z.string().url(),
});

// Function to update settings including the profile picture
export const updateSettings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // Validate the incoming values against the SettingsSchema
  const validationResult = SettingsSchema.safeParse(values);
  if (!validationResult.success) {
    return { error: validationResult.error.errors };
  }

  // Update user settings
  await db.user.update({
    where: { id: user.id },
    data: validationResult.data,
  });

  return { success: true };
};

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

  // Update profile picture
  await db.user.update({
    where: { id: user.id },
    data: {
      profilePic: validationResult.data.profilePic,
    },
  });

  return { success: true };
};

// Function to retrieve the user's profile picture
export const getProfilePic = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  return { profilePic: dbUser.profilePic };
};

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
