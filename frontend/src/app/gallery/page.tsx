"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBadges, GALLERY_FILTERS, type GalleryFilterKey } from "@/lib/badges";

interface Declaration {
  id: string;
  title: string;
  artistName: string;
  aiComposition: number;
  aiArrangement: number;
  aiProduction: number;
  aiMixing: number;
  aiMastering: number;
  transparencyScore: number;
  badge: string | null;
  createdAt: string;
}

function calculateAverageAI(dec: Declaration) {
  return (
    (dec.aiComposition + dec.aiArrangement + dec.aiProduction + dec.aiMixing + dec.aiMastering) / 5 / 100
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeclarations() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== "all") {
          params.set("badge", filter);
        }
        const res = await fetch(`/api/declarations?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setDeclarations(data.declarations);
        }
      } catch (err) {
        console.error("Failed to fetch declarations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeclarations();
  }, [filter]);

  const filteredDeclarations = declarations.filter((dec) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      dec.title.toLowerCase().includes(query) ||
      dec.artistName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            Declarations
          </h1>
          <p className="text-[#8A8A8A]">
            Browse creative provenance declarations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search declarations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
          />
          <div className="flex gap-2 flex-wrap">
            {GALLERY_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-100 ${
                  filter === key
                    ? "bg-[#F5F3F0] text-[#0A0A0A]"
                    : "bg-transparent border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Declarations Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#8A8A8A]">
            Loading declarations...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeclarations.map((dec) => {
              const avgAI = calculateAverageAI(dec);
              const badges = getBadges(dec.badge);
              return (
                <Link key={dec.id} href={`/verify/${dec.id}`}>
                  <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100 cursor-pointer">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium text-[#F5F3F0]">
                            {dec.title || "Untitled"}
                          </h3>
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
                        <p className="text-sm text-[#8A8A8A]">{dec.artistName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#8A8A8A]">Score</p>
                        <p className="text-lg font-medium text-[#F5F3F0]">
                          {dec.transparencyScore}
                        </p>
                      </div>
                    </div>

                    {/* AI Contribution Bars */}
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      {[
                        { label: "Comp", value: dec.aiComposition / 100 },
                        { label: "Arr", value: dec.aiArrangement / 100 },
                        { label: "Prod", value: dec.aiProduction / 100 },
                        { label: "Mix", value: dec.aiMixing / 100 },
                        { label: "Master", value: dec.aiMastering / 100 },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                          <div className="h-1 bg-[#2A2A2A] mb-2">
                            <div
                              className="h-full bg-[#8A8A8A] transition-all duration-300"
                              style={{ width: `${value * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-[#8A8A8A]">{label}</p>
                          <p className="text-xs text-[#F5F3F0]">
                            {Math.round(value * 100)}%
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                      <p className="text-xs text-[#8A8A8A]">
                        Avg AI: {Math.round(avgAI * 100)}%
                      </p>
                      <p className="text-xs text-[#8A8A8A]">
                        {new Date(dec.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredDeclarations.length === 0 && (
          <div className="text-center py-16 text-[#8A8A8A]">
            No declarations found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
