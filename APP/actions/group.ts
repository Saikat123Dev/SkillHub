"use server";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const Creategroup = async (formData: { get: (arg0: string) => any }) => {
  try {
    // Extract form data
    const grpname = formData.get("Name");
    const grpbio = formData.get("description");
    const projectTitle = formData.get("projectTitle");
    const projectDescription = formData.get("projectDescription");
    const githubLink = formData.get("githubLink");
    const techStack = JSON.parse(formData.get("techStack"));
    const projectGoals = formData.get("projectGoals");

    console.log("Received form data:", {
      grpname,
      grpbio,
      projectTitle,
      projectDescription,
      githubLink,
      techStack,
      projectGoals,
    });

    // Validate required fields
    if (!grpname || !grpbio || !projectTitle || !projectDescription || !projectGoals) {
      throw new Error("Missing required fields: name, description, projectTitle, projectDescription, projectGoals");
    }

    // Get the current user
    const user = await currentUser();
    console.log("currentuser", user);

    if (!user) {
      return { error: "Unauthorized" };
    }

    // Fetch the user from the database
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized" };
    }
    console.log("dbUser", dbUser);

    // Create the new group
    const newGroup = await db.group.create({
      data: {
        grpname,
        grpbio,
        projectTitle,
        projectDescription,
        githubLink,
        techStack,
        projectGoals,
        adminId: dbUser.id,
        members: {
          create: {
            userId: dbUser.id,
            role: "ADMIN",
          },
        },
      },
      include: {
        members: true,
      },
    });

    console.log("New group created:", newGroup);
    return newGroup;
  } catch (error) {
    console.error("Error in Creategroup function:", error);
    throw new Error("Failed to create group");
  }
};

export const IndividualGroup = async (grpid: any) => {
  try {
    const group = await db.group.findUnique({
      where: {
        id: grpid,
      },
    });
    console.log("group", group);
    return group;
  } catch (error) {
    console.error("Error in IndividualGroup function:", error);
    throw new Error("Failed to get group");
  }
};

export const AllGroups = async (userid: any) => {
  try {
    const groups = await db.group.findMany({
      where: {
        adminId: userid,
      },
      select: {
        id: true,
        grpname: true,
      },
    });
    return groups;
  } catch (error) {
    console.error("Error in AllGroups function:", error);
    throw new Error("Failed to find all groups");
  }
};

export const Findgrouprole = async (groupid: any) => {
  try {
    const user = await currentUser();
    console.log("currentuser", user);

    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized" };
    }
    console.log("dbUser", dbUser);

    const groupMembers = await db.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: dbUser.id,
          groupId: groupid,
        },
      },
      select: {
        role: true,
      },
    });

    if (!groupMembers) {
      return { error: "User is not a member of the group" };
    }

    const isAdmin = groupMembers.role === "ADMIN";

    return {
      isAdmin,
      role: groupMembers.role,
    };
  } catch (error) {
    console.error("Error in Findgrouprole function:", error);
    throw new Error("Failed to find group role");
  }
};

export const findMyAllGroups = async () => {
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
  console.log("dbUser", dbUser);

  try {
    const groups = await db.groupMembership.findMany({
      where: {
        userId: dbUser.id
      },
      include: {
        group: {
          select: {
            id: true,
            grpname: true,
            grpbio: true,
            admin: {
              select: {
                name: true,
                id: true,
              },
            },
            members: {
              select: {
                user: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                role: true,
              },
            },
          },
        },
      },
    });
   console.log(groups);
    return groups;
  } catch (error) {
    console.error("Error in findAllGroups function:", error);
    throw new Error("Failed to find all groups");
  }
};

export const findMembers = async (groupId: any) => {
  try {
    const members = await db.group.findMany({
      where: {
        id: groupId,
      },
      include: {
        members: {
          select: {
            role: true,
            user: {
              select: {
                name: true,
                id: true,
                image:true
              },
            },
          },
        },

      },
    });
    return members;
    console.log("members", members);
  } catch (error) {
    console.error("Error in findMembers function:", error);
    throw new Error("Failed to find all groups");
  }
};
