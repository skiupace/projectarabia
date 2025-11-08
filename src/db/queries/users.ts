import { eq } from "drizzle-orm";
import { db } from "@/schemas/db";
import { users } from "@/schemas/db/schema";
import type { UserProfileSubmission } from "@/schemas/forms/user-profile";

// User queries
export async function findUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id)).get();
}

export async function findUserByUsername(username: string) {
  return await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
}

export async function findUserByEmail(email: string) {
  return await db.select().from(users).where(eq(users.email, email)).get();
}

export async function createUser(data: {
  username: string;
  email: string | null;
  password: string;
}) {
  return await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      password: data.password,
    })
    .returning()
    .get();
}

export async function updateUserProfile(
  id: string,
  data: UserProfileSubmission,
) {
  return await db
    .update(users)
    .set({
      email: data.email,
      about: data.about,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, id))
    .returning()
    .get();
}
