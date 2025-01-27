"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, birthday } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

      },
    });

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/settings",
    });

    return { success: "Registration completed" };
  } catch (error) {
    // Handle NextAuth.js errors
    if (isNextAuthError(error)) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong with authentication!" };
      }
    }

    // Handle other errors
    console.error("Registration error:", error);
    return { error: "Failed to register user. Please try again." };
  }
};

// Type guard for NextAuth.js errors
function isNextAuthError(error: unknown): error is { type: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    typeof (error as { type: unknown }).type === "string"
  );
}
