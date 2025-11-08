import type { SafeUser } from "@/schemas/db/users";
import type { UserStatus } from "@/schemas/db/user_status";

export type UserWithStatus = (SafeUser & Omit<UserStatus, "createdAt" | "updatedAt">) | null;

