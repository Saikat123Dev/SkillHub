import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
   
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        
          primarySkill: true,
          secondarySkills: true,
          country: true,
          about: true,
          location: true,
         
        
          class10: true,
          percentage_10: true,
          class12: true,
          percentage_12: true,
          college: true,
          currentYear: true,
          dept: true,
          domain: true,
             },
      });
      console.log(users)
      return NextResponse.json(users); 
     
  } catch (error) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); 
  } finally {
    await prisma.$disconnect();
  }
}
