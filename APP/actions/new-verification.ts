"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";

export const newVerification = async (token: string) => {
  // Fetch the existing verification token using the provided token
  const existingToken = await getVerificationTokenByToken(token);

  // Check if the token exists
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // Fetch the user associated with the email in the token
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User not registered!" };
  }

  // Ensure the emailVerified field is set correctly
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(), // Use ISO string format for emailVerified
      // email: existingToken.email, // Uncomment this if email needs to be updated
    },
  });

  // Delete the verification token since it's no longer needed
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Return a success message
  return { success: "Account verified!" };
};
