import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/declarations/[id] - Get single declaration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const declaration = await prisma.declaration.findUnique({
      where: { id },
    });

    if (!declaration) {
      return NextResponse.json(
        { error: "Declaration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(declaration);
  } catch (error) {
    console.error("Error fetching declaration:", error);
    return NextResponse.json(
      { error: "Failed to fetch declaration" },
      { status: 500 }
    );
  }
}

// PATCH /api/declarations/[id] - Update declaration (e.g., after minting)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const declaration = await prisma.declaration.update({
      where: { id },
      data: {
        tokenId: body.tokenId,
        contractId: body.contractId,
        txHash: body.txHash,
        mintedAt: body.tokenId ? new Date() : undefined,
        consentLocked: body.consentLocked,
        splitsLocked: body.splitsLocked,
      },
    });

    return NextResponse.json(declaration);
  } catch (error) {
    console.error("Error updating declaration:", error);
    return NextResponse.json(
      { error: "Failed to update declaration" },
      { status: 500 }
    );
  }
}
