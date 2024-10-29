"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

export async function createLane(groupId: any, title: any) {
    try {
      const lane = await db.lanes.create({
        data: {
          title,
          groupId,
        },
      })
      return { success: true, lane }
    } catch (error) {
      console.error('Error creating lane:', error)
      return { success: false, error: error.message }
    }
  }
  
  export async function deleteLane(laneId: any) {
    try {
      await db.cards.deleteMany({
        where: { laneId },
      })
      
      await db.lanes.delete({
        where: { id: laneId },
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting lane:', error)
      return { success: false, error: error.message }
    }
  }
  
  export async function createCard(laneId: any, cardData: { title: any; description: any; label: any; priority: { id: any; }; assignee: { id: any; }; }) {
    try {
        const user = await currentUser();
        console.log("currentuser", user);
    
        if (!user) {
          return { error: "Unauthorized" };
        }
    
        // Await the getUserById() promise to resolve
        const dbUser = await getUserById(user.id);
      const card = await db.cards.create({
        data: {
          title: cardData.title,
          description: cardData.description,
          label: cardData.label,
          priority: cardData.priority.id,
          userId: dbUser.id,
          laneId,
        },
        include: {
          assignee: true,
        },
      })
      return { success: true, card }
    } catch (error) {
      console.error('Error creating card:', error)
      return { success: false, error: error.message }
    }
  }
  
  export async function deleteCard(cardId: any) {
    try {
      await db.cards.delete({
        where: { id: cardId },
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting card:', error)
      return { success: false, error: error.message }
    }
  }
  
  export async function moveCard(cardId: any, newLaneId: any) {
    try {
      const card = await db.cards.update({
        where: { id: cardId },
        data: { laneId: newLaneId },
      })
      return { success: true, card }
    } catch (error) {
      console.error('Error moving card:', error)
      return { success: false, error: error.message }
    }
  }
  
  export async function getLanesByGroup(groupId: any) {
    try {
      const lanes = await db.lanes.findMany({
        where: { groupId },
        include: {
          cards: {
            include: {
              assignee: true,
            },
          },
        },
      })
      return { success: true, lanes }
    } catch (error) {
      console.error('Error fetching lanes:', error)
      return { success: false, error: error.message }
    }
  }