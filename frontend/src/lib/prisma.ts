import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7.x requires accelerateUrl for client initialization
// For now, we'll use a simple singleton pattern
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
