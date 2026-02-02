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
    const artistName = searchParams.get("artistName");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (badge) {
      where.badge = { contains: badge };
    }

    if (minScore) {
      where.transparencyScore = { gte: parseInt(minScore) };
    }

    if (artist) {
      where.artistWallet = artist;
    }

    if (artistName) {
      where.artistName = { contains: artistName };
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

// Calculate completeness-based transparency score
function calculateTransparencyScore(body: {
  aiComposition?: number;
  aiArrangement?: number;
  aiProduction?: number;
  aiMixing?: number;
  aiMastering?: number;
  methodology?: string;
  daws?: string;
  plugins?: string;
  aiModels?: string;
  ipfsCID?: string;
  sha256?: string;
  contributorSplits?: unknown[];
}): number {
  let score = 0;

  // +30 for declaring at all
  score += 30;

  // +20 for filling in AI phase values (4pts per phase)
  const phases = [
    body.aiComposition,
    body.aiArrangement,
    body.aiProduction,
    body.aiMixing,
    body.aiMastering,
  ];
  for (const phase of phases) {
    if (phase !== undefined && phase !== null) {
      score += 4;
    }
  }

  // +15 for methodology (scaled by length)
  if (body.methodology) {
    const methodologyScore = Math.min(body.methodology.length / 200, 1) * 15;
    score += Math.round(methodologyScore);
  }

  // +15 for creative stack detail (3pts per tool, max 15)
  const stackItems = [
    ...(body.daws?.split(",").filter(Boolean) || []),
    ...(body.plugins?.split(",").filter(Boolean) || []),
    ...(body.aiModels?.split(",").filter(Boolean) || []),
  ];
  score += Math.min(stackItems.length * 3, 15);

  // +10 for provenance (CID + hash)
  if (body.ipfsCID) score += 5;
  if (body.sha256) score += 5;

  // +10 for listing collaborators
  if (
    Array.isArray(body.contributorSplits) &&
    body.contributorSplits.length > 0
  ) {
    score += 10;
  }

  return Math.min(score, 100);
}

// Determine process-based badges
function determineBadges(body: {
  daws?: string;
  plugins?: string;
  aiModels?: string;
  methodology?: string;
  contributorSplits?: unknown[];
  ipfsCID?: string;
  sha256?: string;
}): string {
  const badges: string[] = [];

  // DECLARED — always gets this
  badges.push("DECLARED");

  // DEEP_STACK — 5+ tools in creative stack
  const stackItems = [
    ...(body.daws?.split(",").filter(Boolean) || []),
    ...(body.plugins?.split(",").filter(Boolean) || []),
    ...(body.aiModels?.split(",").filter(Boolean) || []),
  ];
  if (stackItems.length >= 5) {
    badges.push("DEEP_STACK");
  }

  // PROCESS_DOC — methodology > 200 chars
  if (body.methodology && body.methodology.length > 200) {
    badges.push("PROCESS_DOC");
  }

  // MULTIPLAYER — has collaborators
  if (
    Array.isArray(body.contributorSplits) &&
    body.contributorSplits.length > 0
  ) {
    badges.push("MULTIPLAYER");
  }

  // FULL_LINEAGE — has source material links (CID + hash)
  if (body.ipfsCID && body.sha256) {
    badges.push("FULL_LINEAGE");
  }

  return badges.join(",");
}

// POST /api/declarations - Create a new declaration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      artistName,
      artistWallet,
      aiComposition,
      aiArrangement,
      aiProduction,
      aiMixing,
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
      methodology,
      daws,
      plugins,
      aiModels,
      parentDeclarationId,
      parentRelation,
    } = body;

    // Validate required fields (wallet is now optional)
    if (!artistName) {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    // Calculate completeness-based transparency score
    const transparencyScore = calculateTransparencyScore({
      aiComposition,
      aiArrangement,
      aiProduction,
      aiMixing,
      aiMastering,
      methodology,
      daws,
      plugins,
      aiModels,
      ipfsCID,
      sha256,
      contributorSplits,
    });

    // Determine process-based badges
    const badge = determineBadges({
      daws,
      plugins,
      aiModels,
      methodology,
      contributorSplits,
      ipfsCID,
      sha256,
    });

    const declaration = await prisma.declaration.create({
      data: {
        title: title || "",
        artistName,
        artistWallet: artistWallet || null,
        authMethod: artistWallet ? "wallet" : "anonymous",
        aiComposition: aiComposition || 0,
        aiArrangement: aiArrangement || 0,
        aiProduction: aiProduction || 0,
        aiMixing: aiMixing || 0,
        aiMastering: aiMastering || 0,
        transparencyScore,
        methodology: methodology || null,
        parentDeclarationId: parentDeclarationId || null,
        parentRelation: parentRelation || null,
        ipfsCID: ipfsCID || "",
        sha256: sha256 || "",
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
