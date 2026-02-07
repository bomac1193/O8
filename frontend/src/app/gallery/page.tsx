"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBadges, GALLERY_FILTERS, type GalleryFilterKey } from "@/lib/badges";

interface Declaration {
  id: string;
  title: string;
  artistName: string;
  artistWallet: string | null;
  tokenId: number | null;
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

type SortOption = "date-desc" | "date-asc" | "score-desc" | "score-asc" | "ai-desc" | "ai-asc";

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this declaration? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/declarations/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from local state
        setDeclarations(declarations.filter(d => d.id !== id));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete declaration');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete declaration');
    } finally {
      setDeleting(null);
    }
  };

  const filteredDeclarations = declarations
    .filter((dec) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !dec.title.toLowerCase().includes(query) &&
          !dec.artistName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Transparency score filter
      if (dec.transparencyScore < minScore || dec.transparencyScore > maxScore) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sorting
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "score-desc":
          return b.transparencyScore - a.transparencyScore;
        case "score-asc":
          return a.transparencyScore - b.transparencyScore;
        case "ai-desc":
          return calculateAverageAI(b) - calculateAverageAI(a);
        case "ai-asc":
          return calculateAverageAI(a) - calculateAverageAI(b);
        default:
          return 0;
      }
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

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Badge Filters */}
          <div className="flex gap-2 flex-wrap">
            {GALLERY_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 text-xs font-medium transition-colors duration-100 ${
                  filter === key
                    ? "bg-[#F5F3F0] text-[#0A0A0A]"
                    : "bg-transparent border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Transparency Score Range */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-xs text-[#8A8A8A] whitespace-nowrap">Score:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
              className="w-16 px-2 py-1 text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] focus:border-[#8A8A8A] outline-none"
            />
            <span className="text-xs text-[#8A8A8A]">-</span>
            <input
              type="number"
              min="0"
              max="100"
              value={maxScore}
              onChange={(e) => setMaxScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 100)))}
              className="w-16 px-2 py-1 text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] focus:border-[#8A8A8A] outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-xs bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] focus:border-[#8A8A8A] outline-none cursor-pointer"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
            <option value="ai-desc">Most AI</option>
            <option value="ai-asc">Least AI</option>
          </select>
        </div>

        {/* Declarations Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#8A8A8A]">
            Loading declarations...
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeclarations.map((dec) => {
              const avgAI = calculateAverageAI(dec);
              const badges = getBadges(dec.badge);
              const canDelete = !dec.artistWallet && !dec.tokenId;
              return (
                <div key={dec.id} className="relative group">
                  <Link href={`/verify/${dec.id}`}>
                    <div className="p-4 bg-black border border-[#3A3A3A] hover:border-[#F5F3F0] transition-colors duration-100 cursor-pointer">
                      {/* Header Row - Compact */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-medium text-[#F5F3F0] truncate">
                              {dec.title || "Untitled"}
                            </h3>
                            {badges.length > 0 && (
                              <span className="text-[10px] text-[#8A8A8A] font-mono shrink-0">
                                [{badges.length}]
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#8A8A8A]">{dec.artistName}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-xs text-[#8A8A8A] mb-0.5">Score</p>
                          <p className="text-sm font-mono text-[#F5F3F0]">
                            {dec.transparencyScore}
                          </p>
                        </div>
                      </div>

                      {/* AI Contribution - Compact Inline Bars */}
                      <div className="flex items-center gap-2 mb-2">
                        {[
                          { label: "C", value: dec.aiComposition / 100, title: "Composition" },
                          { label: "A", value: dec.aiArrangement / 100, title: "Arrangement" },
                          { label: "P", value: dec.aiProduction / 100, title: "Production" },
                          { label: "M", value: dec.aiMixing / 100, title: "Mixing" },
                          { label: "Ms", value: dec.aiMastering / 100, title: "Mastering" },
                        ].map(({ label, value, title }) => (
                          <div key={label} className="flex-1" title={`${title}: ${Math.round(value * 100)}%`}>
                            <div className="h-1 bg-[#1A1A1A]">
                              <div
                                className="h-full bg-[#F5F3F0] transition-all duration-300"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer - Compact */}
                      <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] font-mono">
                        <span>AVG {Math.round(avgAI * 100)}%</span>
                        <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Delete Button - X in top right */}
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm(`Delete "${dec.title || 'Untitled'}"?\n\nThis cannot be undone.`)) {
                          handleDelete(dec.id, e);
                        }
                      }}
                      disabled={deleting === dec.id}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#8A8A8A] hover:text-[#F5F3F0] bg-black/80 border border-[#3A3A3A] hover:border-[#F5F3F0] transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 z-10"
                      title="Delete declaration"
                    >
                      {deleting === dec.id ? '...' : '×'}
                    </button>
                  )}
                </div>
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
