import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await db.post.findMany({
      select: {
        id:true,
        description: true,
        techStack: true,
        looking: true,
        group: true,
        author: {
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
    });

    // Return the posts as a JSON response
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
