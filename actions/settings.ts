"use server"
import { Prisma } from "@prisma/client";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { unstable_update } from "@/auth";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (
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
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updateData:any= {
    name: values.name,
    email: values.email,
    username:values.username,
    password: values.password,
    primarySkill: values.primarySkill,
    secondarySkills: values.secondarySkills,
    country: values.country,
    location: values.location,
    about: values.about,
    profilePic: values.profilePic,
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
    domain: values.domain
  };

  // Debugging logs
  console.log("Update Data:", updateData);

  try {
    // Handle Projects
    if (values.projects) {
      for (const project of values.projects) {
        if (project.id) {
          await db.project.update({
            where: { id: project.id },
            data: {
              title: project.title ?? undefined,
              about: project.about ?? undefined,
              techStack: project.techStack ?? undefined,
              demovideo: project.demovideo ?? undefined,
              collaborator: project.collaborator ?? undefined,
              liveLink: project.liveLink ?? undefined,
              author: {
                connect: { id: user.id }, // Connects the project to the existing author
              },
            },
          });
        } else {
          await db.project.create({
            data: {
              title: project.title,
              about: project.about,
              techStack: project.techStack,
              demovideo: project.demovideo,
              collaborator: project.collaborator,
              liveLink: project.liveLink,
              author: {
                connect: { id: user.id }, // Connects the new project to the author
              },
            },
          });
        }
      }
    }

    // Handle Experience
    if (values.experience) {
      for (const exp of values.experience) {
        if (exp.id) {
          await db.experience.update({
            where: { id: exp.id },
            data: {
              company: exp.company ?? undefined,
              duration: exp.duration ?? undefined,
              role: exp.role ?? undefined,
              author: {
                connect: { id: user.id }, // Connects the experience to the existing author
              },
            },
          });
        } else {
          await db.experience.create({
            data: {
              company: exp.company,
              duration: exp.duration,
              role: exp.role,
              author: {
                connect: { id: user.id }, // Connects the new experience to the author
              },
            },
          });
        }
      }
    }

    if (values.posts) {
      updateData.posts = {
        connect: values.posts.map(postId => ({ id: postId })),
      };
    }
   
    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: updateData,
    });

    unstable_update({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      }
    });

    return { success: "Settings Updated!" };

  } catch (error) {
    console.error("Update failed:", error);
    return { error: "Failed to update settings." };
  }
};
