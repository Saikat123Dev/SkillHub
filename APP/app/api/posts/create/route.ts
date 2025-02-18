import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

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

        const { description, techStack, looking, groupId } = await req.json();
        console.log(description, techStack, looking, groupId);
        if (!description || !Array.isArray(techStack) || !Array.isArray(looking) || !groupId) {
            return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
        }

        const newPost = await db.post.create({
            data: {
                description,
                techStack,
                looking,
                group: {
                    connect: { id: groupId },
                },

                author: {
                    connect: { id: dbUser.id },
                },
            },
        });

        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error creating post" }), { status: 500 });
    }
}
