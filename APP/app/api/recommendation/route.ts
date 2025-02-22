import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Function to get embeddings using text-embedding-004 model
async function getEmbedding(text: string, retries = 3): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (!text || text.trim() === "") {
                console.warn("Empty text provided for embedding");
                return [];
            }

            // Simplified embedContent call for embedding models
            const result = await model.embedContent(text);

            // Verify embedding structure
            if (!result || !result.embedding || !Array.isArray(result.embedding.values)) {
                throw new Error("Invalid embedding response format");
            }

            return result.embedding.values;
        } catch (error: any) {
            console.error(`Embedding attempt ${attempt} failed:`, error);
            if (attempt === retries) {
                throw new Error(`Embedding generation failed after ${retries} attempts: ${error.message}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
    }
    return []; // Fallback (unreachable due to throw, but TypeScript requires it)
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    return normA && normB ? dotProduct / (normA * normB) : 0;
}

// Function to recommend users for a group based on tech stack similarity
async function recommendUsersForGroup(groupId: string) {
    try {
        // Fetch group details
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: { members: true },
        });

        if (!group) {
            throw new Error("Group not found");
        }

        // Combine group data into a single text string
        const groupTech = Array.isArray(group.techStack) ? group.techStack.join(", ") : "";
        const groupText = `${groupTech} ${group.projectTitle || ""} ${group.projectDescription || ""}`.trim();

        if (!groupText) {
            throw new Error("No valid group data available for embedding");
        }

        // Generate group embedding
        const groupEmbedding = await getEmbedding(groupText);
        if (groupEmbedding.length === 0) {
            throw new Error("Failed to generate group embedding");
        }

        // Fetch all users along with their projects
        const users = await prisma.user.findMany({
            include: { projects: true },
        });

        const userScores: { user: any; score: number }[] = [];

        // Generate embeddings for each user and compute similarity
        for (const user of users) {
            const userSkills = Array.isArray(user.Skills) ? user.Skills.join(", ") : "";
            const userProjects = user.projects?.map((p) => p.title || "").join(", ") || "";
            const userText = `${userSkills} ${userProjects} ${user.about || ""}`.trim();

            if (!userText) continue; // Skip users with no meaningful data

            const userEmbedding = await getEmbedding(userText);
            if (userEmbedding.length === 0) continue; // Skip if embedding fails

            const similarity = cosineSimilarity(groupEmbedding, userEmbedding);
            userScores.push({ user, score: similarity });
        }

        // Sort by similarity score and return top 5 recommendations
        return userScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(({ user, score }) => ({
                id: user.id,
                name: user.name,
                email: user.email, // Adjust based on your Prisma schema
                similarityScore: score,
            }));
    } catch (error) {
        console.error("Error in recommendation process:", error);
        throw error;
    }
}

// Next.js API route handler
export async function POST(req: NextRequest) {
    try {
        const { groupId } = await req.json();
        if (!groupId) {
            return NextResponse.json({ error: "groupId is required" }, { status: 400 });
        }

        // Verify API key exists
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const recommendedUsers = await recommendUsersForGroup(groupId);
        return NextResponse.json({ recommendedUsers }, { status: 200 });
    } catch (error: any) {
        console.error("Error in recommendation API:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Optional: Cleanup Prisma client on server shutdown (best practice for Next.js)
export async function GET() {
    return NextResponse.json({ message: "Method not allowed, use POST instead" }, { status: 405 });
}
