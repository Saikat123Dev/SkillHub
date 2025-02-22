"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";
// import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    // await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updateData: any = {
    name: values.name,
    email: values.email,
    username: values.username,
    password: values.password,
    Roles: Array.isArray(values.Roles) ? values.Roles : [],
    Skills: Array.isArray(values.Skills) ? values.Skills : [],
    country: values.country,
    location: values.location,
    about: values.about,
    image: values.profilePic,
    gender: values.gender,
    linkedin: values.linkedin,
    github: values.github,
    twitter: values.twitter,
    class10: values.class10,
    percentage_10: values.percentage_10,
    class12: values.class12,
    percentage_12: values.percentage_12,
    college: values.college,
    currentYear: values.currentYear,
    dept: values.dept,
    shortIntro:values.shortIntro,
    leetcode :values.leetcode,
    duration :values.duration,

    domain: values.domain,
  };

  // Debugging logs
  console.log("Update Data:", updateData);

  try {
    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: updateData,
    });

    // No need for unstable_update; session will update via callbacks
    return { success: "Settings Updated!" };
  } catch (error) {
    console.error("Update failed:", error);
    return { error: "Failed to update settings." };
  }
};
export const getSettings = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const Userid= await getUserById(user.id);

  if (!Userid) {
    return { error: "Unauthorized" };
  }
  try{

  const getsettingdetails = await db.user.findUnique({
    where: {
      id: Userid.id,
    },
  });
  return {success:true,getsettingdetails}
  console.log('settingsdata',getsettingdetails);

}catch(error){
  console.error("Get settings data failed:", error);
  return { error: "Failed to get settings." };

}
};
