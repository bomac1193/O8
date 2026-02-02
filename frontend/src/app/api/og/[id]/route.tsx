import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const declaration = await prisma.declaration.findUnique({
    where: { id },
  });

  if (!declaration) {
    return new Response("Not found", { status: 404 });
  }

  const avgAI = Math.round(
    (declaration.aiComposition +
      declaration.aiArrangement +
      declaration.aiProduction +
      declaration.aiMixing +
      declaration.aiMastering) /
      5
  );

  const badges = declaration.badge?.split(",") || [];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          backgroundColor: "#0A0A0A",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "36px", color: "#F5F3F0", fontWeight: "bold" }}>Ø8</span>
            <span style={{ fontSize: "14px", color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Protocol
            </span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              backgroundColor: "#F5F3F0",
              color: "#0A0A0A",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: "bold",
            }}
          >
            Ø8 DECLARED
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h1 style={{ fontSize: "48px", color: "#F5F3F0", margin: "0 0 12px 0", fontWeight: "500" }}>
            {declaration.title || "Untitled"}
          </h1>
          <p style={{ fontSize: "24px", color: "#8A8A8A", margin: "0 0 32px 0" }}>
            {declaration.artistName}
          </p>

          {/* Badges */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
            {badges.map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  backgroundColor: "#2A2A2A",
                  color: "#F5F3F0",
                }}
              >
                {badge.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", gap: "60px", borderTop: "1px solid #2A2A2A", paddingTop: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Transparency
            </span>
            <span style={{ fontSize: "36px", color: "#F5F3F0", fontWeight: "500" }}>
              {declaration.transparencyScore}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Avg AI
            </span>
            <span style={{ fontSize: "36px", color: "#F5F3F0", fontWeight: "500" }}>
              {avgAI}%
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Phases
            </span>
            <span style={{ fontSize: "36px", color: "#F5F3F0", fontWeight: "500" }}>5</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
