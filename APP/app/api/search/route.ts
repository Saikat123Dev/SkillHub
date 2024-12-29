import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const skip = (page - 1) * PAGE_SIZE;


  const filters: any = {};

  if (searchParams.get('username')) {
    filters.username = { contains: searchParams.get('username'), mode: 'insensitive' };
  }
  if (searchParams.get('name')) {
    filters.name = { contains: searchParams.get('name'), mode: 'insensitive' };
  }
  if (searchParams.get('primarySkill')) {
    filters.primarySkill = { contains: searchParams.get('primarySkill'), mode: 'insensitive' };
  }
  if (searchParams.get('profession')) {
    filters.profession = { equals: searchParams.get('profession') };
  }
  if (searchParams.get('country')) {
    filters.country = { contains: searchParams.get('country'), mode: 'insensitive' };
  }
  if (searchParams.get('gender')) {
    filters.gender = { equals: searchParams.get('gender') };
  }
  if (searchParams.get('college')) {
    filters.college = { equals: searchParams.get('college') };
  }

  try {

    const users = await db.user.findMany({
      where: filters,
      select: {
        id: true,
        username: true,
        name: true,
        country: true,
        gender: true,
        college: true,
      },
      orderBy: {
        id: 'desc'
      },
      skip,
      take: PAGE_SIZE + 1
    });


    const hasMore = users.length > PAGE_SIZE;

    const paginatedUsers = hasMore ? users.slice(0, PAGE_SIZE) : users;

    const totalCount = await db.user.count({
      where: filters
    });

    return NextResponse.json({
      users: paginatedUsers,
      hasMore,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / PAGE_SIZE)
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching for users.' },
      { status: 500 }
    );
  }
}
