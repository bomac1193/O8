"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BADGE_COLORS } from "@/lib/wagmi";

// Demo data (will be replaced with DB/contract data)
const DEMO_TRACKS = [
  {
    id: "demo-1",
    tokenId: 1,
    title: "Midnight Synthesis",
    artistName: "Neural Echo",
    aiMelody: 5,
    aiLyrics: 0,
    aiStems: 10,
    aiMastering: 15,
    transparencyScore: 93,
    badge: "HUMAN_CRAFTED",
    trainingRights: false,
    derivativeRights: true,
    remixRights: true,
    ipfsCID: "Qm...",
  },
  {
    id: "demo-2",
    tokenId: 2,
    title: "Circuit Dreams",
    artistName: "Analog Heart",
    aiMelody: 30,
    aiLyrics: 25,
    aiStems: 20,
    aiMastering: 10,
    transparencyScore: 84,
    badge: "AI_DISCLOSED",
    trainingRights: true,
    derivativeRights: true,
    remixRights: true,
    ipfsCID: "Qm...",
  },
  {
    id: "demo-3",
    tokenId: 3,
    title: "Human Touch",
    artistName: "Organic Waves",
    aiMelody: 0,
    aiLyrics: 0,
    aiStems: 0,
    aiMastering: 5,
    transparencyScore: 100,
    badge: "HUMAN_CRAFTED",
    trainingRights: false,
    derivativeRights: false,
    remixRights: true,
    ipfsCID: "Qm...",
  },
  {
    id: "demo-4",
    tokenId: 4,
    title: "Sovereign Sound",
    artistName: "No AI Please",
    aiMelody: 0,
    aiLyrics: 0,
    aiStems: 0,
    aiMastering: 0,
    transparencyScore: 100,
    badge: "SOVEREIGN",
    trainingRights: false,
    derivativeRights: false,
    remixRights: false,
    ipfsCID: "Qm...",
  },
  {
    id: "demo-5",
    tokenId: 5,
    title: "Full Consent EP",
    artistName: "Open Source Music",
    aiMelody: 45,
    aiLyrics: 40,
    aiStems: 35,
    aiMastering: 20,
    transparencyScore: 70,
    badge: "FULL_CONSENT",
    trainingRights: true,
    derivativeRights: true,
    remixRights: true,
    ipfsCID: "Qm...",
  },
];

type FilterType = "all" | "humanOnly" | "aiDisclosed" | "highScore";

export default function Gallery() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = DEMO_TRACKS.filter((track) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !track.title.toLowerCase().includes(query) &&
        !track.artistName.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Badge filter
    switch (filter) {
      case "humanOnly":
        return track.badge === "HUMAN_CRAFTED";
      case "aiDisclosed":
        return track.badge === "AI_DISCLOSED";
      case "highScore":
        return track.transparencyScore >= 90;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Gallery</h1>
          <p className="text-zinc-400">
            Browse verified tracks with full transparency and consent data.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search tracks or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:outline-none transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "humanOnly", label: "Human-Crafted" },
              { key: "aiDisclosed", label: "AI-Disclosed" },
              { key: "highScore", label: "Score 90+" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Track Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/verify/${track.id}`}>
                <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/50 transition-all cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-violet-400 transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-sm text-zinc-400">{track.artistName}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        BADGE_COLORS[track.badge] || "bg-zinc-600"
                      } text-white`}
                    >
                      {track.badge.replace("_", "-")}
                    </span>
                  </div>

                  {/* AI Contribution Bars */}
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Melody", value: track.aiMelody },
                      { label: "Lyrics", value: track.aiLyrics },
                      { label: "Stems", value: track.aiStems },
                      { label: "Master", value: track.aiMastering },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        <span className="w-12 text-zinc-500">{label}</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              value < 20
                                ? "bg-emerald-500"
                                : value < 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-zinc-400">
                          {value}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="text-sm">
                      <span className="text-zinc-500">Score: </span>
                      <span className="text-violet-400 font-semibold">
                        {track.transparencyScore}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {track.trainingRights && (
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          Training
                        </span>
                      )}
                      {track.remixRights && (
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          Remix
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            No tracks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
