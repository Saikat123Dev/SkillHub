"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";


export const creategroup = async (formData: { get: (arg0: string) => any }) => {
  try {
    const grpname = formData.get("Name");
    const grpbio = formData.get("description");
    console.log("Received form data:", { grpname, grpbio });

    if (!grpname || !grpbio) {
      throw new Error("Missing required fields: grpname, grpbio");
    }

    // Await the currentUser() promise to resolve
    const user = await currentUser();
    console.log("currentuser", user);
    
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Await the getUserById() promise to resolve
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized" };
    }
    console.log("dbUser",dbUser);

    // Create a new group
    const new_grp = await db.group.create({
      data: {
        grpname,
        grpbio,
        adminId: dbUser.id,
      },
    });

    console.log("New group created:", new_grp);
    return new_grp;
  } catch (error) {
    console.error("Error in addgroup function:", error);
    throw new Error("Failed to create group");
  } 
};

export const IndividualGroup=async(grpid: any)=>{
  try{
    const group = await db.group.findUnique({
      where: {
        id: grpid,
      }
      
    })
    return group;
    console.log("group",group);
  }catch(error){
    console.error("Error in IndividualGroup function:", error);
    throw new Error("Failed to get group");
  }
}