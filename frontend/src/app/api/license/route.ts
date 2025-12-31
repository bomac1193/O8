import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/license - Request license for a track (SOVN enforcement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { declarationId, requesterWallet, requesterName, permissionType } = body;

    // Validate required fields
    if (!declarationId || !requesterWallet || !permissionType) {
      return NextResponse.json(
        { error: "Missing required fields: declarationId, requesterWallet, permissionType" },
        { status: 400 }
      );
    }

    // Validate permission type
    if (!["training", "derivative", "remix"].includes(permissionType)) {
      return NextResponse.json(
        { error: "Invalid permissionType. Must be: training, derivative, or remix" },
        { status: 400 }
      );
    }

    // Get the declaration to check consent
    const declaration = await prisma.declaration.findUnique({
      where: { id: declarationId },
    });

    if (!declaration) {
      return NextResponse.json(
        { error: "Declaration not found" },
        { status: 404 }
      );
    }

    // Check if permission is granted based on consent toggles
    let isGranted = false;
    switch (permissionType) {
      case "training":
        isGranted = declaration.trainingRights;
        break;
      case "derivative":
        isGranted = declaration.derivativeRights;
        break;
      case "remix":
        isGranted = declaration.remixRights;
        break;
    }

    // Create license request record
    const licenseRequest = await prisma.licenseRequest.create({
      data: {
        declarationId,
        requesterWallet,
        requesterName,
        permissionType,
        status: isGranted ? "approved" : "denied",
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({
      request: licenseRequest,
      granted: isGranted,
      message: isGranted
        ? `Permission granted for ${permissionType} on "${declaration.title}"`
        : `Permission denied for ${permissionType} on "${declaration.title}". The artist has not enabled this right.`,
      consent: {
        trainingRights: declaration.trainingRights,
        derivativeRights: declaration.derivativeRights,
        remixRights: declaration.remixRights,
        locked: declaration.consentLocked,
      },
    });
  } catch (error) {
    console.error("Error processing license request:", error);
    return NextResponse.json(
      { error: "Failed to process license request" },
      { status: 500 }
    );
  }
}

// GET /api/license?declarationId=xxx - Check permissions for a track
export async function GET(request: NextRequest) {
  try {
    const declarationId = request.nextUrl.searchParams.get("declarationId");

    if (!declarationId) {
      return NextResponse.json(
        { error: "declarationId query parameter required" },
        { status: 400 }
      );
    }

    const declaration = await prisma.declaration.findUnique({
      where: { id: declarationId },
      select: {
        id: true,
        title: true,
        artistName: true,
        trainingRights: true,
        derivativeRights: true,
        remixRights: true,
        consentLocked: true,
      },
    });

    if (!declaration) {
      return NextResponse.json(
        { error: "Declaration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      declarationId: declaration.id,
      title: declaration.title,
      artist: declaration.artistName,
      permissions: {
        training: declaration.trainingRights,
        derivative: declaration.derivativeRights,
        remix: declaration.remixRights,
      },
      consentLocked: declaration.consentLocked,
    });
  } catch (error) {
    console.error("Error checking permissions:", error);
    return NextResponse.json(
      { error: "Failed to check permissions" },
      { status: 500 }
    );
  }
}
