"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BADGE_COLORS } from "@/lib/wagmi";

// Demo data (same as gallery for now)
const DEMO_TRACKS: Record<string, {
  id: string;
  tokenId: number;
  title: string;
  artistName: string;
  artistWallet: string;
  aiMelody: number;
  aiLyrics: number;
  aiStems: number;
  aiMastering: number;
  transparencyScore: number;
  badge: string;
  trainingRights: boolean;
  derivativeRights: boolean;
  remixRights: boolean;
  consentLocked: boolean;
  ipfsCID: string;
  sha256: string;
  createdAt: string;
}> = {
  "demo-1": {
    id: "demo-1",
    tokenId: 1,
    title: "Midnight Synthesis",
    artistName: "Neural Echo",
    artistWallet: "0x1234...5678",
    aiMelody: 5,
    aiLyrics: 0,
    aiStems: 10,
    aiMastering: 15,
    transparencyScore: 93,
    badge: "HUMAN_CRAFTED",
    trainingRights: false,
    derivativeRights: true,
    remixRights: true,
    consentLocked: true,
    ipfsCID: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    sha256: "0xabc123...",
    createdAt: "2024-12-30T12:00:00Z",
  },
  "demo-2": {
    id: "demo-2",
    tokenId: 2,
    title: "Circuit Dreams",
    artistName: "Analog Heart",
    artistWallet: "0xabcd...efgh",
    aiMelody: 30,
    aiLyrics: 25,
    aiStems: 20,
    aiMastering: 10,
    transparencyScore: 84,
    badge: "AI_DISCLOSED",
    trainingRights: true,
    derivativeRights: true,
    remixRights: true,
    consentLocked: false,
    ipfsCID: "QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX",
    sha256: "0xdef456...",
    createdAt: "2024-12-29T15:30:00Z",
  },
};

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const track = DEMO_TRACKS[id];

  if (!track) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Track Not Found</h1>
          <p className="text-zinc-400 mb-6">This declaration doesn&apos;t exist.</p>
          <Link
            href="/gallery"
            className="text-violet-400 hover:underline"
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const metadata = {
    name: track.title,
    artist: track.artistName,
    token_id: track.tokenId,
    ai_contributions: {
      melody: track.aiMelody,
      lyrics: track.aiLyrics,
      stems: track.aiStems,
      mastering: track.aiMastering,
    },
    transparency_score: track.transparencyScore,
    badge: track.badge,
    consent: {
      training_rights: track.trainingRights,
      derivative_rights: track.derivativeRights,
      remix_rights: track.remixRights,
      locked: track.consentLocked,
    },
    ipfs_cid: track.ipfsCID,
    sha256: track.sha256,
    created_at: track.createdAt,
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/gallery"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to Gallery
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{track.title}</h1>
              <p className="text-xl text-zinc-400">{track.artistName}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                BADGE_COLORS[track.badge] || "bg-zinc-600"
              } text-white`}
            >
              {track.badge.replace("_", "-")}
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Transparency Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
          >
            <h2 className="text-lg font-semibold mb-4">Transparency Score</h2>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold text-violet-400">
                {track.transparencyScore}
              </div>
              <div className="text-zinc-500 mb-2">/ 100</div>
            </div>
            <div className="mt-4 h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full"
                style={{ width: `${track.transparencyScore}%` }}
              />
            </div>
          </motion.div>

          {/* Consent Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">SOVN Consent</h2>
              {track.consentLocked && (
                <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-medium">
                  LOCKED
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">AI Training</span>
                <span
                  className={
                    track.trainingRights ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {track.trainingRights ? "Allowed" : "Denied"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">AI Derivatives</span>
                <span
                  className={
                    track.derivativeRights ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {track.derivativeRights ? "Allowed" : "Denied"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Remixes</span>
                <span
                  className={
                    track.remixRights ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {track.remixRights ? "Allowed" : "Denied"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Contribution Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
        >
          <h2 className="text-lg font-semibold mb-4">AI Contribution Breakdown</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { label: "Melody", value: track.aiMelody },
              { label: "Lyrics", value: track.aiLyrics },
              { label: "Stems", value: track.aiStems },
              { label: "Mastering", value: track.aiMastering },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div
                  className={`text-3xl font-bold mb-1 ${
                    value < 20
                      ? "text-emerald-400"
                      : value < 50
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {value}%
                </div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Verification Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
        >
          <h2 className="text-lg font-semibold mb-4">Verification Data</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Token ID</span>
              <span className="font-mono">{track.tokenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Artist Wallet</span>
              <span className="font-mono">{track.artistWallet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">IPFS CID</span>
              <a
                href={`https://ipfs.io/ipfs/${track.ipfsCID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-violet-400 hover:underline"
              >
                {track.ipfsCID.slice(0, 20)}...
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Created</span>
              <span>{new Date(track.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* JSON Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">JSON Metadata Export</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
              }}
              className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 bg-zinc-950 rounded-xl overflow-x-auto text-xs font-mono text-zinc-400">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
