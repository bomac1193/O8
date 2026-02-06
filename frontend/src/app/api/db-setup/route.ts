import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/db-setup - Check database connection and table status
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Try to count declarations (will fail if table doesn't exist)
    const count = await prisma.declaration.count();

    return NextResponse.json({
      status: "connected",
      message: "Database is set up correctly",
      declarationsCount: count,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed or tables don't exist",
        error: errorMessage,
        fix: "Run: DATABASE_URL='your-neon-url' npx prisma db push",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
