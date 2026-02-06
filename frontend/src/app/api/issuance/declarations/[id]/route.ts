import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBadges } from "@/lib/badges";

// GET /api/issuance/declarations/[id] - ISSUANCE integration endpoint
// Returns declaration data formatted for NFT minting with full provenance
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

    // Only allow minting of high-transparency declarations
    if (declaration.transparencyScore < 85) {
      return NextResponse.json(
        {
          error: "Declaration does not meet minimum transparency score for minting",
          required: 85,
          current: declaration.transparencyScore,
        },
        { status: 403 }
      );
    }

    // Calculate average AI contribution
    const avgAI =
      (declaration.aiComposition +
        declaration.aiArrangement +
        declaration.aiProduction +
        declaration.aiMixing +
        declaration.aiMastering) /
      5;

    // Get badges
    const badges = getBadges(declaration.badge);

    // Parse collaborators
    const collaborators = Array.isArray(declaration.contributorSplits)
      ? (declaration.contributorSplits as {
          name: string;
          role: string;
          wallet?: string;
          split: number;
        }[])
      : [];

    // Fetch lineage (parent and children)
    const parentDeclaration = declaration.parentDeclarationId
      ? await prisma.declaration.findUnique({
          where: { id: declaration.parentDeclarationId },
          select: {
            id: true,
            title: true,
            artistName: true,
            createdAt: true,
          },
        })
      : null;

    const childDeclarations = await prisma.declaration.findMany({
      where: { parentDeclarationId: id },
      select: {
        id: true,
        title: true,
        artistName: true,
        parentRelation: true,
        createdAt: true,
      },
    });

    // Format response for ISSUANCE
    const response = {
      // Metadata
      declaration_id: declaration.id,
      version: "2.0",
      platform: "∞8 ARCH",

      // Core Identity
      identity: {
        title: declaration.title,
        artist: declaration.artistName,
        wallet: declaration.artistWallet,
        collaborators: collaborators.map((c) => ({
          name: c.name,
          role: c.role,
          wallet: c.wallet || null,
          revenue_split: c.split,
        })),
      },

      // Provenance & Verification
      provenance: {
        ipfs_cid: declaration.ipfsCID,
        sha256_hash: declaration.sha256,
        created_at: declaration.createdAt,
        parent_declaration: parentDeclaration
          ? {
              id: parentDeclaration.id,
              title: parentDeclaration.title,
              artist: parentDeclaration.artistName,
              relation: declaration.parentRelation,
            }
          : null,
        derived_works: childDeclarations.map((child) => ({
          id: child.id,
          title: child.title,
          artist: child.artistName,
          relation: child.parentRelation,
        })),
      },

      // Production Intelligence
      production: {
        ai_contribution: {
          composition: declaration.aiComposition,
          arrangement: declaration.aiArrangement,
          production: declaration.aiProduction,
          mixing: declaration.aiMixing,
          mastering: declaration.aiMastering,
          average: Math.round(avgAI),
        },
        methodology: declaration.methodology,
        process_badges: badges.map((b) => ({
          key: b.key,
          label: b.label,
          color: b.color,
        })),
      },

      // Quality Metrics
      metrics: {
        transparency_score: declaration.transparencyScore,
        rarity_tier:
          declaration.transparencyScore >= 95
            ? "legendary"
            : declaration.transparencyScore >= 90
            ? "epic"
            : declaration.transparencyScore >= 85
            ? "rare"
            : "common",
      },

      // Usage Rights
      rights: {
        ai_training: declaration.trainingRights,
        derivatives: declaration.derivativeRights,
        remixes: declaration.remixRights,
      },

      // Minting Status
      minting: {
        already_minted: declaration.tokenId !== null,
        token_id: declaration.tokenId,
        contract_id: declaration.contractId,
        tx_hash: declaration.txHash,
        minted_at: declaration.mintedAt,
      },

      // For smart contracts
      splits: {
        primary_artist: {
          wallet: declaration.artistWallet,
          percentage: collaborators.length > 0
            ? 100 - collaborators.reduce((sum, c) => sum + c.split, 0)
            : 100,
        },
        collaborators: collaborators.map((c) => ({
          wallet: c.wallet || null,
          percentage: c.split,
          name: c.name,
          role: c.role,
        })),
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow ISSUANCE to call this
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching declaration for ISSUANCE:", error);
    return NextResponse.json(
      { error: "Failed to fetch declaration" },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
