// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params; // Extract 'id' from params

    if (!id) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    try {


        // Fetch the user by ID
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
