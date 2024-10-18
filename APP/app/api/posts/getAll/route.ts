import { NextResponse } from 'next/server';
import {db} from '@/lib/db'; // Assuming prisma is exported from lib/prisma

// GET request to fetch all posts
export async function GET() {
  try {
    // Fetch all posts from the Post table
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc', // Optional: Fetch posts ordered by creation date
      },
      include: {
        author: true, // Assuming you have a relation to the user who created the post
      },
    });

    // Return the posts as a JSON response
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
