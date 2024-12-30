import { db } from '@/lib/db';
import { redis } from '@/lib/redis'; // Import Redis connection
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;
const CACHE_TTL = 60 * 5; // Cache for 5 minutes

// Helper function to create a hash of the filters
const hashFilters = (filters: Record<string, any>): string => {
  return crypto.createHash('md5').update(JSON.stringify(filters)).digest('hex');
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract and parse query parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const skip = (page - 1) * PAGE_SIZE;

    // Dynamically construct filters
    const filterableFields = [
      { key: 'username', condition: 'contains', mode: 'insensitive' },
      { key: 'name', condition: 'contains', mode: 'insensitive' },
      { key: 'primarySkill', condition: 'contains', mode: 'insensitive' },
      { key: 'profession', condition: 'equals' },
      { key: 'country', condition: 'contains', mode: 'insensitive' },
      { key: 'gender', condition: 'equals' },
      { key: 'college', condition: 'equals' },
    ];

    const filters: Record<string, any> = {};
    filterableFields.forEach(({ key, condition, mode }) => {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = mode
          ? { [condition]: value, mode }
          : { [condition]: value };
      }
    });

    // Generate cache key
    const cacheKey = `users:${hashFilters({ ...filters, page })}`;

    // Check if data exists in cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('Serving from cache');
      return NextResponse.json(JSON.parse(cachedData));
    }

    // Fetch data from the database
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
      orderBy: { id: 'desc' },
      skip,
      take: PAGE_SIZE + 1, // Fetch one extra to determine `hasMore`
    });

    const hasMore = users.length > PAGE_SIZE;
    const paginatedUsers = hasMore ? users.slice(0, PAGE_SIZE) : users;

    // Count total records for pagination
    const totalCount = await db.user.count({ where: filters });

    // Construct response data
    const responseData = {
      users: paginatedUsers,
      hasMore,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    };

    // Cache the result
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', CACHE_TTL);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching users:', error.message || error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users. Please try again later.' },
      { status: 500 }
    );
  }
}
