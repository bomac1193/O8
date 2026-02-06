"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getBadges } from "@/lib/badges";
import { DeclarationBadge } from "@/components/DeclarationBadge";
import { LineageTimeline } from "@/components/LineageTimeline";

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
  aiModels?: string | null;
  daws?: string | null;
  plugins?: string | null;
  hardware?: string | null;
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
  const embedHtml = `<a href="${baseUrl}/verify/${declaration.id}" target="_blank" rel="noopener"><img src="${baseUrl}/api/og/${declaration.id}" alt="∞8 Declaration: ${declaration.title}" width="600" /></a>`;
  const embedMarkdown = `[![∞8 Declaration: ${declaration.title}](${baseUrl}/api/og/${declaration.id})](${baseUrl}/verify/${declaration.id})`;

  const handleEmbedCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-6 md:px-12">
      <div className="max-w-[960px] mx-auto">
        {/* Back link & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/gallery"
            className="inline-block text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
          >
            &larr; Back to Gallery
          </Link>
          <Link
            href={`/new?fromVersion=${declaration.id}`}
            className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] text-xs uppercase tracking-widest hover:border-[#8A8A8A] transition-colors duration-100"
            title="Create a new version of this declaration"
          >
            + New Version
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
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
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
              Transparency Score
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-medium text-[#F5F3F0]">
                {declaration.transparencyScore}
              </span>
              <span className="text-[#8A8A8A] text-sm">/ 100</span>
            </div>
            <div className="h-1 bg-[#2A2A2A] mb-1">
              <div
                className="h-full bg-[#8A8A8A] transition-all duration-300"
                style={{ width: `${declaration.transparencyScore}%` }}
              />
            </div>
            <p className="text-[10px] text-[#8A8A8A]">
              Based on declaration completeness
            </p>
          </div>

          <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
              Average AI Contribution
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-medium text-[#F5F3F0]">
                {Math.round(avgAI)}
              </span>
              <span className="text-[#8A8A8A] text-sm">%</span>
            </div>
            <div className="h-1 bg-[#2A2A2A]">
              <div
                className="h-full bg-[#8A8A8A] transition-all duration-300"
                style={{ width: `${avgAI}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mint on ISSUANCE */}
        {declaration.transparencyScore >= 85 && (
          <div className="p-4 bg-[#1A1A1A] border border-[#8A8A8A] mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Ready for ISSUANCE
                </p>
                <h3 className="text-lg font-medium text-[#F5F3F0] mb-2">
                  Mint as Luxury Sound NFT
                </h3>
                <p className="text-sm text-[#8A8A8A] leading-relaxed mb-3">
                  Your transparency score qualifies this declaration for minting on ISSUANCE.
                  Unlock revenue streams, smart contract splits, and permanent on-chain provenance.
                </p>
                {contributors.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#8A8A8A]">Smart Contract Splits:</span>
                    <span className="text-[#F5F3F0] font-mono">
                      {contributors.length} collaborator{contributors.length > 1 ? 's' : ''} configured
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  // Use the ISSUANCE API endpoint
                  const baseUrl = window.location.origin;
                  const apiEndpoint = `${baseUrl}/api/issuance/declarations/${declaration.id}`;

                  // Open ISSUANCE with API endpoint reference
                  // ISSUANCE will call this endpoint to get full declaration data including splits
                  const issuanceUrl = `http://localhost:3001/mint?api=${encodeURIComponent(apiEndpoint)}`;
                  window.open(issuanceUrl, '_blank');
                }}
                className="shrink-0 px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100 whitespace-nowrap"
              >
                Mint on ISSUANCE →
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#2A2A2A] space-y-2">
              <p className="text-xs text-[#8A8A8A]">
                <span className="text-[#F5F3F0]">What happens next:</span> ISSUANCE will read this declaration's
                full provenance via API endpoint <code className="px-1 py-0.5 bg-[#0A0A0A] text-[#F5F3F0] font-mono text-[10px]">/api/issuance/declarations/{declaration.id}</code>
              </p>
              <ul className="text-xs text-[#8A8A8A] space-y-1 pl-4">
                <li>• NFT minted with rarity tier based on transparency score ({declaration.transparencyScore}/100)</li>
                {contributors.length > 0 && (
                  <li>• Revenue splits automatically enforced via smart contracts ({contributors.map(c => `${c.name}: ${c.split}%`).join(', ')})</li>
                )}
                <li>• All provenance data stored immutably on-chain</li>
                <li>• Integration with streaming platforms for automated royalty distribution</li>
              </ul>
            </div>
          </div>
        )}

        {/* AI Contribution Breakdown */}
        <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
            Production Intelligence
          </p>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {[
              { label: "Composition", value: declaration.aiComposition },
              { label: "Arrangement", value: declaration.aiArrangement },
              { label: "Production", value: declaration.aiProduction },
              { label: "Mixing", value: declaration.aiMixing },
              { label: "Mastering", value: declaration.aiMastering },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-medium text-[#F5F3F0] mb-0.5">
                  {value}%
                </p>
                <p className="text-[10px] text-[#8A8A8A] mb-1">{label}</p>
                <div className="h-1 bg-[#2A2A2A]">
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
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Collaborators */}
          <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3">
              Collaborators {contributors.length > 0 && '& Revenue Splits'}
            </p>
            {contributors.length === 0 ? (
              <p className="text-sm text-[#8A8A8A]">Solo declaration</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {contributors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-[#F5F3F0] text-sm">{c.name}</p>
                        <p className="text-xs text-[#8A8A8A]">{c.role}</p>
                        {c.wallet && (
                          <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5 truncate max-w-[160px]">
                            {c.wallet}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-mono text-[#F5F3F0]">
                        {c.split}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-[#2A2A2A]">
                  <p className="text-xs text-[#8A8A8A]">
                    <span className="text-[#F5F3F0]">Smart Contract Ready:</span> Splits will be automatically enforced on-chain when minted on ISSUANCE.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Consent */}
          <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3">
              Usage Consent
            </p>
            <div className="space-y-2">
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

        {/* Lineage Timeline - Enhanced Visualization */}
        <LineageTimeline
          currentDeclarationId={declaration.id}
          currentDeclaration={{
            id: declaration.id,
            title: declaration.title,
            artistName: declaration.artistName,
            transparencyScore: declaration.transparencyScore,
            aiComposition: declaration.aiComposition,
            aiArrangement: declaration.aiArrangement,
            aiProduction: declaration.aiProduction,
            aiMixing: declaration.aiMixing,
            aiMastering: declaration.aiMastering,
            aiModels: declaration.aiModels,
            daws: declaration.daws,
            plugins: declaration.plugins,
            createdAt: declaration.createdAt,
          }}
        />

        {/* Provenance */}
        <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3">
            Provenance
          </p>
          <div className="space-y-2">
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
        <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3">
            Embed This Declaration
          </p>
          <div className="space-y-3">
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
        <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-3">
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
            style={{ fontFamily: "'Söhne Mono', var(--font-plex-mono), monospace" }}
          >
            {JSON.stringify(exportData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
