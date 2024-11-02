'use server';
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

export const createCalendy = async (
  groupId: string, 
  calendyData: { 
    title: string; 
    description: string;  
    priority: { id: string; }; 
    start: Date;
    end: Date;
    color: string;
  }
) => {
    try {
        const createcalendy = await db.calendy.create({
            data: {
                title: calendyData.title,
                description: calendyData.description,
                priority: calendyData.priority.id,
                start: new Date(calendyData.start),
                end: new Date(calendyData.end),
                color: calendyData.color,
                groupId: groupId
            }
        });
        
        console.log('calendyData', createcalendy);
        return createcalendy; // Return the created event
        
    } catch (error) {
        console.log('error in creating calendy data', error.message || error);
        throw error; // Throw error to handle it in the frontend
    }
};

export const getEvents = async (groupId: string) => {
    try {
        const events = await db.calendy.findMany({
            where: {
                groupId: groupId
            }
        });
        
        console.log('events found true', events);
        return events; // Return the events array
        
    } catch (error) {
        console.log('error in getting events', error.message || error);
        throw error; // Throw error to handle it in the frontend
    }
};