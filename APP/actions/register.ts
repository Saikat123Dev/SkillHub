"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { createClient } from "redis";

let client;

async function getRedisClient() {
  if (!client || !client.isOpen) {
    client = createClient();
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
  }
  return client;
}

export const register = async (values: z.infer<typeof RegisterSchema>) => {
 
  const redisClient = await getRedisClient();

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, birthday } = validatedFields.data;

 
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

   try {
     const redisSetPromise = redisClient.set(
      `user:register:${email}`,
      JSON.stringify({ name, email }),
      { EX: 900 } 
    );


    const dbCreatePromise = db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        birthday,
      },
    });

   
    await Promise.all([redisSetPromise, dbCreatePromise]);

    return { success: "Registration completed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user. Please try again." };
  }
};
