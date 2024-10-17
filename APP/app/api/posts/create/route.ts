import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "@/data/account";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request) {
    try {
     
        const user = await currentUser();
        if (!user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const dbUser = await getUserById(user.id);
        if (!dbUser) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

     
        const { title, content,slug } = await req.json();

      console.log(title)
        const newPost = await db.post.create({
            data: {
                title: title,
                content: content,
                slug,
                author: {
                    connect: { id: dbUser.id },
                },
            },
        });

        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response('Error creating post', { status: 500 });
    }
}
