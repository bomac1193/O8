import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/export/[id] - Export declaration as JSON metadata
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

    // Format as Ø8 metadata standard
    const metadata = {
      $schema: "https://o8.protocol/schema/v1",
      version: "1.0.0",
      protocol: "O8",

      // Track info
      track: {
        title: declaration.title,
        artist: declaration.artistName,
        token_id: declaration.tokenId,
        contract_address: declaration.contractId,
      },

      // AI contribution disclosure
      ai_contributions: {
        melody: declaration.aiMelody,
        lyrics: declaration.aiLyrics,
        stems: declaration.aiStems,
        mastering: declaration.aiMastering,
        average: Math.round(
          (declaration.aiMelody +
            declaration.aiLyrics +
            declaration.aiStems +
            declaration.aiMastering) /
            4
        ),
      },

      // Scores
      scores: {
        transparency: declaration.transparencyScore,
        human: declaration.humanScore,
      },

      // Badge
      badge: {
        type: declaration.badge,
        label: declaration.badge?.replace("_", "-"),
      },

      // SOVN consent
      consent: {
        training_rights: declaration.trainingRights,
        derivative_rights: declaration.derivativeRights,
        remix_rights: declaration.remixRights,
        locked: declaration.consentLocked,
      },

      // Contributor splits
      contributor_splits: declaration.contributorSplits,

      // Verification
      verification: {
        ipfs_cid: declaration.ipfsCID,
        sha256_hash: declaration.sha256,
        tx_hash: declaration.txHash,
      },

      // Timestamps
      timestamps: {
        created_at: declaration.createdAt,
        minted_at: declaration.mintedAt,
        updated_at: declaration.updatedAt,
      },
    };

    // Check if download format requested
    const format = request.nextUrl.searchParams.get("format");

    if (format === "download") {
      return new NextResponse(JSON.stringify(metadata, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="o8-${declaration.id}.json"`,
        },
      });
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error exporting declaration:", error);
    return NextResponse.json(
      { error: "Failed to export declaration" },
      { status: 500 }
    );
  }
}
