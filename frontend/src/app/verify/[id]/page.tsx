"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getBadges } from "@/lib/badges";
import { DeclarationBadge } from "@/components/DeclarationBadge";

interface Declaration {
  id: string;
  title: string;
  artistName: string;
  artistWallet: string | null;
  aiComposition: number;
  aiArrangement: number;
  aiProduction: number;
  aiMixing: number;
  aiMastering: number;
  transparencyScore: number;
  badge: string | null;
  methodology: string | null;
  parentDeclarationId: string | null;
  parentRelation: string | null;
  ipfsCID: string;
  sha256: string;
  trainingRights: boolean;
  derivativeRights: boolean;
  remixRights: boolean;
  contributorSplits: unknown;
  createdAt: string;
  childDeclarations?: {
    id: string;
    title: string;
    artistName: string;
    parentRelation: string | null;
    createdAt: string;
  }[];
}

function calculateAverageAI(dec: Declaration) {
  return (
    (dec.aiComposition + dec.aiArrangement + dec.aiProduction + dec.aiMixing + dec.aiMastering) / 5
  );
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  useEffect(() => {
    async function fetchDeclaration() {
      try {
        const res = await fetch(`/api/declarations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDeclaration(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchDeclaration();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#8A8A8A]">Loading declaration...</p>
      </div>
    );
  }

  if (notFound || !declaration) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
            Not Found
          </p>
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-4">
            Declaration Not Found
          </h1>
          <p className="text-[#8A8A8A] mb-8">
            This declaration does not exist or has been removed.
          </p>
          <Link
            href="/gallery"
            className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
          >
            &larr; Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const avgAI = calculateAverageAI(declaration);
  const badges = getBadges(declaration.badge);
  const contributors = Array.isArray(declaration.contributorSplits)
    ? (declaration.contributorSplits as { name: string; role: string; wallet?: string; split: number }[])
    : [];

  const exportData = {
    version: "2.0",
    declaration_id: declaration.id,
    identity: {
      primary_artist: {
        name: declaration.artistName,
        wallet: declaration.artistWallet,
      },
    },
    production_intelligence: {
      ai_contribution: {
        composition: declaration.aiComposition,
        arrangement: declaration.aiArrangement,
        production: declaration.aiProduction,
        mixing: declaration.aiMixing,
        mastering: declaration.aiMastering,
      },
      methodology: declaration.methodology,
    },
    provenance: {
      ipfs_cid: declaration.ipfsCID,
      sha256: declaration.sha256,
    },
    badges: badges.map((b) => b.key),
    transparency_score: declaration.transparencyScore,
    created_at: declaration.createdAt,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const embedHtml = `<a href="${baseUrl}/verify/${declaration.id}" target="_blank" rel="noopener"><img src="${baseUrl}/api/og/${declaration.id}" alt="Ø8 Declaration: ${declaration.title}" width="600" /></a>`;
  const embedMarkdown = `[![Ø8 Declaration: ${declaration.title}](${baseUrl}/api/og/${declaration.id})](${baseUrl}/verify/${declaration.id})`;

  const handleEmbedCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[960px] mx-auto">
        {/* Back link */}
        <Link
          href="/gallery"
          className="inline-block text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100 mb-12"
        >
          &larr; Back to Gallery
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
              Declaration
            </p>
            <h1 className="text-3xl font-medium text-[#F5F3F0] mb-2">
              {declaration.title || "Untitled"}
            </h1>
            <p className="text-[#8A8A8A]">{declaration.artistName}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            {/* Declaration status badge */}
            <DeclarationBadge declared={true} />
            {/* Process badges */}
            <div className="flex flex-wrap gap-1">
              {badges.map((badge) => (
                <span
                  key={badge.key}
                  className="px-2 py-0.5 text-xs uppercase tracking-widest"
                  style={{ backgroundColor: badge.color, color: badge.textColor }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#8A8A8A]">
              {new Date(declaration.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              Transparency Score
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-medium text-[#F5F3F0]">
                {declaration.transparencyScore}
              </span>
              <span className="text-[#8A8A8A]">/ 100</span>
            </div>
            <div className="h-1 bg-[#2A2A2A]">
              <div
                className="h-full bg-[#8A8A8A] transition-all duration-300"
                style={{ width: `${declaration.transparencyScore}%` }}
              />
            </div>
            <p className="text-xs text-[#8A8A8A] mt-2">
              Based on declaration completeness, not AI percentage.
            </p>
          </div>

          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              Average AI Contribution
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-medium text-[#F5F3F0]">
                {Math.round(avgAI)}
              </span>
              <span className="text-[#8A8A8A]">%</span>
            </div>
            <div className="h-1 bg-[#2A2A2A]">
              <div
                className="h-full bg-[#8A8A8A] transition-all duration-300"
                style={{ width: `${avgAI}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Contribution Breakdown */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
            Production Intelligence
          </p>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { label: "Composition", value: declaration.aiComposition },
              { label: "Arrangement", value: declaration.aiArrangement },
              { label: "Production", value: declaration.aiProduction },
              { label: "Mixing", value: declaration.aiMixing },
              { label: "Mastering", value: declaration.aiMastering },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-medium text-[#F5F3F0] mb-1">
                  {value}%
                </p>
                <p className="text-xs text-[#8A8A8A]">{label}</p>
                <div className="h-1 bg-[#2A2A2A] mt-2">
                  <div
                    className="h-full bg-[#8A8A8A] transition-all duration-300"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {declaration.methodology && (
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                Methodology
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                {declaration.methodology}
              </p>
            </div>
          )}
        </div>

        {/* Collaborators & Consent */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Collaborators */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Collaborators
            </p>
            {contributors.length === 0 ? (
              <p className="text-sm text-[#8A8A8A]">Solo declaration</p>
            ) : (
              <div className="space-y-3">
                {contributors.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-[#F5F3F0] text-sm">{c.name}</p>
                      <p className="text-xs text-[#8A8A8A]">{c.role}</p>
                    </div>
                    <span className="text-sm font-mono text-[#F5F3F0]">
                      {c.split}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consent */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Usage Consent
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">AI Training</span>
                <span className={declaration.trainingRights ? "text-[#4A7C59]" : "text-[#8B4049]"}>
                  {declaration.trainingRights ? "Allowed" : "Denied"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Derivatives</span>
                <span className={declaration.derivativeRights ? "text-[#4A7C59]" : "text-[#8B4049]"}>
                  {declaration.derivativeRights ? "Allowed" : "Denied"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Remixes</span>
                <span className={declaration.remixRights ? "text-[#4A7C59]" : "text-[#8B4049]"}>
                  {declaration.remixRights ? "Allowed" : "Denied"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lineage */}
        {(declaration.parentDeclarationId || (declaration.childDeclarations && declaration.childDeclarations.length > 0)) && (
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] mb-8">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Lineage
            </p>
            {declaration.parentDeclarationId && (
              <div className="mb-4">
                <p className="text-xs text-[#8A8A8A] mb-1">Parent Declaration</p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/verify/${declaration.parentDeclarationId}`}
                    className="text-[#F5F3F0] font-mono text-sm hover:text-[#8A8A8A] transition-colors duration-100"
                  >
                    {declaration.parentDeclarationId}
                  </Link>
                  {declaration.parentRelation && (
                    <span className="px-2 py-0.5 text-xs uppercase tracking-widest bg-[#2A2A2A] text-[#8A8A8A]">
                      {declaration.parentRelation}
                    </span>
                  )}
                </div>
              </div>
            )}
            {declaration.childDeclarations && declaration.childDeclarations.length > 0 && (
              <div>
                <p className="text-xs text-[#8A8A8A] mb-2">Derived Works</p>
                <div className="space-y-2">
                  {declaration.childDeclarations.map((child) => (
                    <Link
                      key={child.id}
                      href={`/verify/${child.id}`}
                      className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100"
                    >
                      <div>
                        <p className="text-sm text-[#F5F3F0]">{child.title || "Untitled"}</p>
                        <p className="text-xs text-[#8A8A8A]">{child.artistName}</p>
                      </div>
                      {child.parentRelation && (
                        <span className="px-2 py-0.5 text-xs uppercase tracking-widest bg-[#2A2A2A] text-[#8A8A8A]">
                          {child.parentRelation}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Provenance */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
            Provenance
          </p>
          <div className="space-y-4">
            {declaration.artistWallet && (
              <div>
                <p className="text-xs text-[#8A8A8A] mb-1">Artist Wallet</p>
                <p className="text-[#F5F3F0] font-mono text-sm break-all">
                  {declaration.artistWallet}
                </p>
              </div>
            )}
            {declaration.ipfsCID && (
              <div>
                <p className="text-xs text-[#8A8A8A] mb-1">IPFS CID</p>
                <a
                  href={`https://ipfs.io/ipfs/${declaration.ipfsCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F3F0] font-mono text-sm hover:text-[#8A8A8A] transition-colors duration-100"
                >
                  {declaration.ipfsCID}
                </a>
              </div>
            )}
            {declaration.sha256 && (
              <div>
                <p className="text-xs text-[#8A8A8A] mb-1">SHA-256 Hash</p>
                <p className="text-[#F5F3F0] font-mono text-sm break-all">
                  {declaration.sha256}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Embed Snippet */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
            Embed This Declaration
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#8A8A8A]">HTML</p>
                <button
                  onClick={() => handleEmbedCopy(embedHtml)}
                  className="text-xs text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
                >
                  {embedCopied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#8A8A8A] overflow-x-auto">
                {embedHtml}
              </pre>
            </div>
            <div>
              <p className="text-xs text-[#8A8A8A] mb-2">Markdown</p>
              <pre className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#8A8A8A] overflow-x-auto">
                {embedMarkdown}
              </pre>
            </div>
          </div>
        </div>

        {/* JSON Export */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
              Declaration Export
            </p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs uppercase tracking-widest border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
            >
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>
          <pre
            className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] overflow-x-auto text-xs text-[#8A8A8A]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {JSON.stringify(exportData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
