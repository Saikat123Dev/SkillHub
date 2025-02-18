import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;
const CACHE_TTL = 300;
const QUERY_TIMEOUT = 10000;

type FilterConfig = {
  [key: string]: {
    condition: string;
    mode?: 'insensitive';
    type?: 'array' | 'string';
  };
};

const FILTER_CONFIG: FilterConfig = {
  username: { condition: 'contains', mode: 'insensitive', type: 'string' },
  name: { condition: 'contains', mode: 'insensitive', type: 'string' },
  Skills: { condition: 'array-contains', mode: 'insensitive', type: 'array' },
  country: { condition: 'contains', mode: 'insensitive', type: 'string' },
  college: { condition: 'contains', mode: 'insensitive', type: 'string' },
  Roles: { condition: 'array-contains', mode: 'insensitive', type: 'array' },
  dept: { condition: 'contains', mode: 'insensitive', type: 'string' },
};

const hashFilters = (filters: Record<string, any>): string =>
  createHash('md5').update(JSON.stringify(filters)).digest('hex');

interface UsersResponse {
  users: Array<{
    id: string;
    username: string;
    name: string;
    country: string;
    college: string;
    Skills: string[];
    Roles: string[];
    dept: string;
  }>;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const buildWhereClause = (searchParams: URLSearchParams) => {
  const where: Prisma.UserWhereInput = {};

  Object.entries(FILTER_CONFIG).forEach(([key, config]) => {
    const value = searchParams.get(key);
    if (!value) return;

    if (config.type === 'array') {
      // Split the search terms and handle each one
      const searchTerms = value.split(',').map(term => term.trim().toLowerCase());
      where[key] = {
        some: {
          in: searchTerms.map(term => ({
            contains: term,
            mode: 'insensitive'
          }))
        }
      };
    } else {
      // Handle string fields
      where[key] = {
        contains: value,
        mode: 'insensitive'
      };
    }
  });

  return where;
};

export async function GET(req: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const skip = (page - 1) * PAGE_SIZE;

    const where = buildWhereClause(searchParams);
    const cacheKey = `users:${hashFilters({ ...where, page })}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      clearTimeout(timeoutId);
      return NextResponse.json(JSON.parse(cachedData));
    }

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          name: true,
          country: true,
          college: true,
          Skills: true,
          Roles: true,
          dept: true
        },
        orderBy: { id: 'desc' },
        skip,
        take: PAGE_SIZE + 1,
      }),
      db.user.count({ where })
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

    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', CACHE_TTL);

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
