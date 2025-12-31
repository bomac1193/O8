import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/declarations - List all declarations with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Filter params
    const badge = searchParams.get("badge");
    const minScore = searchParams.get("minScore");
    const artist = searchParams.get("artist");
    const humanOnly = searchParams.get("humanOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (badge) {
      where.badge = badge;
    }

    if (minScore) {
      where.transparencyScore = { gte: parseInt(minScore) };
    }

    if (artist) {
      where.artistWallet = artist;
    }

    if (humanOnly) {
      where.badge = "HUMAN_CRAFTED";
    }

    const [declarations, total] = await Promise.all([
      prisma.declaration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.declaration.count({ where }),
    ]);

    return NextResponse.json({
      declarations,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching declarations:", error);
    return NextResponse.json(
      { error: "Failed to fetch declarations" },
      { status: 500 }
    );
  }
}

// POST /api/declarations - Create a new declaration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      artistName,
      artistWallet,
      aiMelody,
      aiLyrics,
      aiStems,
      aiMastering,
      ipfsCID,
      sha256,
      trainingRights,
      derivativeRights,
      remixRights,
      contributorSplits,
      tokenId,
      contractId,
      txHash,
    } = body;

    // Validate required fields
    if (!title || !artistName || !artistWallet || !ipfsCID || !sha256) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate scores
    const avgAI = (aiMelody + aiLyrics + aiStems + aiMastering) / 4;
    let transparencyScore = Math.round(100 - avgAI);
    if (aiMelody > 0 || aiLyrics > 0 || aiStems > 0 || aiMastering > 0) {
      transparencyScore = Math.min(100, transparencyScore + 5);
    }
    const humanScore = Math.round(100 - avgAI);

    // Determine badge
    const isHumanCrafted =
      aiMelody < 20 &&
      aiLyrics < 20 &&
      aiStems < 20 &&
      aiMastering < 20 &&
      transparencyScore >= 80;

    let badge = "TRANSPARENT";
    if (isHumanCrafted) {
      badge = "HUMAN_CRAFTED";
    } else if (!trainingRights) {
      badge = "SOVEREIGN";
    } else if (trainingRights && derivativeRights && remixRights) {
      badge = "FULL_CONSENT";
    } else if (transparencyScore >= 60) {
      badge = "AI_DISCLOSED";
    }

    const declaration = await prisma.declaration.create({
      data: {
        title,
        artistName,
        artistWallet,
        aiMelody: aiMelody || 0,
        aiLyrics: aiLyrics || 0,
        aiStems: aiStems || 0,
        aiMastering: aiMastering || 0,
        transparencyScore,
        humanScore,
        ipfsCID,
        sha256,
        trainingRights: trainingRights || false,
        derivativeRights: derivativeRights || false,
        remixRights: remixRights || false,
        contributorSplits: contributorSplits || [],
        badge,
        tokenId,
        contractId,
        txHash,
        mintedAt: tokenId ? new Date() : null,
      },
    });

    return NextResponse.json(declaration, { status: 201 });
  } catch (error) {
    console.error("Error creating declaration:", error);
    return NextResponse.json(
      { error: "Failed to create declaration" },
      { status: 500 }
    );
  }
}
