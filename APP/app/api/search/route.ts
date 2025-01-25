import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;
const CACHE_TTL = 300;
const QUERY_TIMEOUT = 5000;

type FilterConfig = {
  [key: string]: {
    condition: string;
    mode?: 'insensitive';
  };
};

const FILTER_CONFIG: FilterConfig = {
  username: { condition: 'contains', mode: 'insensitive' },
  name: { condition: 'contains', mode: 'insensitive' },
  primarySkill: { condition: 'contains', mode: 'insensitive' },
  profession: { condition: 'equals' },
  country: { condition: 'contains', mode: 'insensitive' },
  gender: { condition: 'equals' },
  college: { condition: 'equals' }
};

const hashFilters = (filters: Record<string, any>): string =>
  createHash('md5').update(JSON.stringify(filters)).digest('hex');

interface UsersResponse {
  users: Array<{
    id: string;
    username: string;
    name: string;
    country: string;
    gender: string;
    college: string;
  }>;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export async function GET(req: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const skip = (page - 1) * PAGE_SIZE;

    const filters = Object.entries(FILTER_CONFIG).reduce((acc, [key, config]) => {
      const value = searchParams.get(key);
      if (!value) return acc;

      acc[key] = config.mode
        ? { [config.condition]: value, mode: config.mode }
        : { [config.condition]: value };
      return acc;
    }, {} as Record<string, any>);

    const cacheKey = `users:${hashFilters({ ...filters, page })}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      clearTimeout(timeoutId);
      return NextResponse.json(JSON.parse(cachedData));
    }

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
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
        take: PAGE_SIZE + 1,
      }),
      db.user.count({ where: filters })
    ]);

    const hasMore = users.length > PAGE_SIZE;
    const paginatedUsers = hasMore ? users.slice(0, PAGE_SIZE) : users;

    const responseData: UsersResponse = {
      users: paginatedUsers,
      hasMore,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    };

    redis.set(cacheKey, JSON.stringify(responseData), 'EX', CACHE_TTL)
      .catch(error => console.error('Cache write error:', error));

    clearTimeout(timeoutId);
    return NextResponse.json(responseData);

  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again.' },
        { status: 408 }
      );
    }

    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users. Please try again later.' },
      { status: 500 }
    );
  }
}
