import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";

import { getUserById } from "@/data/user";
import { createClient } from "redis";

// Initialize Redis client
const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function getRedisClient() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

// Define a schema for the profile picture update
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

  // Update profile picture in the database
  await db.user.update({
    where: { id: user.id },
    data: {
      profilePic: validationResult.data.profilePic,
    },
  });

  // Cache the new profile picture URL in Redis
  const redis = await getRedisClient();
  await redis.set(`user:${user.id}:profilePic`, validationResult.data.profilePic);

  return { success: true };
};

// Function to retrieve the user's profile picture
export const getProfilePic = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const redis = await getRedisClient();

  // Try to get the profile picture from Redis cache
  const cachedProfilePic = await redis.get(`user:${user.id}:profilePic`);
  if (cachedProfilePic) {
    return { profilePic: cachedProfilePic };
  }

  // If not found in Redis, fetch from the database
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // Cache the profile picture in Redis for future requests
  if (dbUser.profilePic) {
    await redis.set(`user:${user.id}:profilePic`, dbUser.profilePic);
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
