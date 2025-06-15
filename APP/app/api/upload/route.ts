import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const ProfilePicSchema = z.object({
  profilePic: z.string().optional(), // Allow empty string for removal
});

export const updateProfilePic = async (
  values: z.infer<typeof ProfilePicSchema>
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "User not found" };
    }

    const validationResult = ProfilePicSchema.safeParse(values);
    if (!validationResult.success) {
      return { error: "Validation failed", details: validationResult.error.errors };
    }

    // Handle empty string as null for removal
    const imageUrl = validationResult.data.profilePic === "" ? null : validationResult.data.profilePic;

    await db.user.update({
      where: { id: user.id },
      data: {
        image: imageUrl, // This maps to your User model's image field
      },
    });

    return { 
      success: true, 
      message: imageUrl ? "Profile picture updated successfully" : "Profile picture removed successfully",
      image: imageUrl 
    };
  } catch (error) {
    console.error("Update profile pic error:", error);
    return { error: "Failed to update profile picture" };
  }
};

export const getProfilePic = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "User not found" };
    }

    return { 
      image: dbUser.image, // Return the image field from your User model
      success: true 
    };
  } catch (error) {
    console.error("Get profile pic error:", error);
    return { error: "Failed to fetch profile picture" };
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const result = await getProfilePic();
    
    if (result.error) {
      return NextResponse.json(result, { status: 401 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const values = await req.json();
    console.log("Received values:", values); // Debug log
    
    const result = await updateProfilePic(values);
    
    if (result?.error) {
      return NextResponse.json(result, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PUT /api/upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
};