import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";

// Enable WebSocket for Neon serverless in development
if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = require("ws");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Prisma 7.x with Neon serverless adapter
// Properly configured for Vercel Edge with connection pooling
const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // Create and cache pool
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  // @ts-ignore - Pool type mismatch in Prisma 7 + Neon adapter
  const adapter = new PrismaNeon(globalForPrisma.pool);
  // @ts-ignore - Adapter type mismatch in Prisma 7
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
