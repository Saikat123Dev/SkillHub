"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

// Define the schema for a single project
const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  techstack: z.string().min(1, "Technologies are required"),
  about: z.string().min(1, "Description is required"),
  demovideo: z.string().url().optional().or(z.literal("")),
  livelink: z.string().url().optional().or(z.literal("")),
  collaborator: z.string().optional().or(z.literal(""))
});

// Schema for the entire form
const SettingsSchema = z.object({
  projects: z.array(ProjectSchema)
});

export const addProjects = async (values: z.infer<typeof SettingsSchema>) => {
  try {
    // Validate input data against the schema
    const validatedData = SettingsSchema.parse(values);

    // Get the current user
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Get the user record from the database
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "User not found" };
    }



    // Create all projects in a transaction
    const projects = await db.$transaction(
      validatedData.projects.map((project) => 
        db.project.create({
          data: {
            title: project.title,
            about: project.about,
            techStack: project.techstack,
            demovideo: project.demovideo || "",
            collaborator: project.collaborator || "",
            liveLink: project.livelink || "",
            authorId: dbUser.id // Link to the user
          }
        })
      )
    );

    return { success: "Projects updated successfully" };
  } catch (error) {
    console.error("Error updating projects:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid form data. Please check your input." };
    }
    return { error: "Something went wrong! Please try again." };
  }
};

export const getProjects=async(userId:any)=>{
  try {
   
    const getProjects=await db.project.findMany(
      {
        where:{
          authorId:userId
        }
      }
    )
    return { success: true,getProjects };


  }catch(error){
    console.error("Error fetching projects:", error);
    return { error: "Something went wrong! Please try again." };
  }
}