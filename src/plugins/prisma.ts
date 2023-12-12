import { PrismaClient, User } from "@prisma/client";

export const prisma = new PrismaClient();
export type { User };
