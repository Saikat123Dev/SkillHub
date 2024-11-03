import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust based on your project setup

export async function GET(req: NextRequest) {
  // Extract query parameters
  const { searchParams } = new URL(req.url);

  // Construct dynamic filters based on optional query parameters
  const filters: any = {
    username: searchParams.get('username') ? { contains: searchParams.get('username'), mode: 'insensitive' } : undefined,
    
    name: searchParams.get('name') ? { contains: searchParams.get('name'), mode: 'insensitive' } : undefined,
    primarySkill: searchParams.get('primarySkill') ? { contains: searchParams.get('primarySkill'), mode: 'insensitive' } : undefined,
    profession: searchParams.get('profession') ? { contains: searchParams.get('profession'), mode: 'insensitive' } : undefined,
    country: searchParams.get('country') ? { contains: searchParams.get('country'), mode: 'insensitive' } : undefined,
    gender: searchParams.get('gender') ? { equals: searchParams.get('gender') } : undefined, // Use `equals` for enum
    college: searchParams.get('college') ? { equals: searchParams.get('college') } : undefined, // Use 
    profession: searchParams.get('profession') ? { equals: searchParams.get('profession') } : undefined,
  };

  // Remove any undefined fields from filters
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

  try {
    // Query Prisma with constructed filters
    const users = await db.user.findMany({
      where: filters,
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching for users.' },
      { status: 500 }
    );
  }
}
