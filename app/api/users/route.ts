import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Since this is in the `app` directory, you will handle the request using `req.nextUrl`
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters from the URL
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch the users with pagination
    const users = await prisma.user.findMany({
      skip: skip,
      take: limit, // Limit the number of users fetched
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

    // Count the total number of users for pagination
    const totalUsers = await prisma.user.count();

    // Return users and pagination details
    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
