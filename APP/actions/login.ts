"use server";

import { signIn } from "@/auth"; // Assuming this is your NextAuth configuration
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  // Validate the login fields
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  // Fetch the user by email
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  try {
    // Attempt to sign in with credentials
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT, // Redirect to this URL after login
      redirect: false, // Prevent automatic redirection
    });

    // Check if sign in was successful
    if (result?.error) {
      return { error: result.error }; // Return any error message from signIn
    }

    // If sign in was successful, return a success message with the redirect URL
    return { success: true, redirect: result?.url || callbackUrl || DEFAULT_LOGIN_REDIRECT };
  } catch (error) {
    // Handle specific authentication errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    // Handle any unexpected errors
    console.error("Unexpected error during login:", error);
    return { error: "An unexpected error occurred." };
  }
}
