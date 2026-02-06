"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DeclarationNode {
  id: string;
  title: string;
  artistName: string;
  transparencyScore: number;
  aiComposition: number;
  aiArrangement: number;
  aiProduction: number;
  aiMixing: number;
  aiMastering: number;
  aiModels?: string | null;
  daws?: string | null;
  plugins?: string | null;
  parentRelation?: string | null;
  createdAt: string;
}

interface LineageTimelineProps {
  currentDeclarationId: string;
  currentDeclaration: DeclarationNode;
}

export function LineageTimeline({ currentDeclarationId, currentDeclaration }: LineageTimelineProps) {
  const [ancestors, setAncestors] = useState<DeclarationNode[]>([]);
  const [descendants, setDescendants] = useState<DeclarationNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFullLineage() {
      try {
        // Fetch ancestors (walk up the parent chain)
        const ancestorChain: DeclarationNode[] = [];
        let currentId = currentDeclaration.id;

        // First, get parent from current declaration
        const currentRes = await fetch(`/api/declarations/${currentId}`);
        const currentData = await currentRes.json();

        let parentId = currentData.parentDeclarationId;

        while (parentId) {
          const res = await fetch(`/api/declarations/${parentId}`);
          if (!res.ok) break;

          const data = await res.json();
          ancestorChain.unshift({
            id: data.id,
            title: data.title,
            artistName: data.artistName,
            transparencyScore: data.transparencyScore,
            aiComposition: data.aiComposition,
            aiArrangement: data.aiArrangement,
            aiProduction: data.aiProduction,
            aiMixing: data.aiMixing,
            aiMastering: data.aiMastering,
            aiModels: data.aiModels,
            daws: data.daws,
            plugins: data.plugins,
            createdAt: data.createdAt,
          });

          parentId = data.parentDeclarationId;
        }

        setAncestors(ancestorChain);

        // Fetch descendants (children)
        const childRes = await fetch(`/api/declarations/${currentId}`);
        const childData = await childRes.json();

        if (childData.childDeclarations && childData.childDeclarations.length > 0) {
          const childDetails = await Promise.all(
            childData.childDeclarations.map(async (child: any) => {
              const res = await fetch(`/api/declarations/${child.id}`);
              const data = await res.json();
              return {
                id: data.id,
                title: data.title,
                artistName: data.artistName,
                transparencyScore: data.transparencyScore,
                aiComposition: data.aiComposition,
                aiArrangement: data.aiArrangement,
                aiProduction: data.aiProduction,
                aiMixing: data.aiMixing,
                aiMastering: data.aiMastering,
                aiModels: data.aiModels,
                daws: data.daws,
                plugins: data.plugins,
                parentRelation: data.parentRelation,
                createdAt: data.createdAt,
              };
            })
          );
          setDescendants(childDetails);
        }
      } catch (error) {
        console.error("Failed to fetch lineage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFullLineage();
  }, [currentDeclarationId, currentDeclaration]);

  const calculateAvgAI = (node: DeclarationNode) => {
    return Math.round(
      (node.aiComposition + node.aiArrangement + node.aiProduction + node.aiMixing + node.aiMastering) / 5
    );
  };

  const getToolCount = (node: DeclarationNode) => {
    const tools = [
      ...(node.aiModels?.split(",").filter(Boolean) || []),
      ...(node.daws?.split(",").filter(Boolean) || []),
      ...(node.plugins?.split(",").filter(Boolean) || []),
    ];
    return tools.length;
  };

  const fullTimeline = [...ancestors, currentDeclaration, ...descendants];

  if (loading) {
    return (
      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
        <p className="text-xs text-[#8A8A8A]">Loading lineage...</p>
      </div>
    );
  }

  if (fullTimeline.length === 1) {
    return (
      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
        <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
          Creative Lineage
        </p>
        <p className="text-sm text-[#8A8A8A]">
          This is the original declaration. No parent or derived versions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
      <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
        Creative Evolution Timeline
      </p>

      {/* Timeline */}
      <div className="space-y-3">
        {fullTimeline.map((node, index) => {
          const isCurrent = node.id === currentDeclarationId;
          const avgAI = calculateAvgAI(node);
          const toolCount = getToolCount(node);
          const prevNode = index > 0 ? fullTimeline[index - 1] : null;

          // Calculate deltas
          const aiDelta = prevNode ? avgAI - calculateAvgAI(prevNode) : 0;
          const scoreDelta = prevNode ? node.transparencyScore - prevNode.transparencyScore : 0;
          const toolDelta = prevNode ? toolCount - getToolCount(prevNode) : 0;

          return (
            <div key={node.id}>
              {/* Connector line */}
              {index > 0 && (
                <div className="flex items-center gap-2 ml-4 mb-2">
                  <div className="w-px h-4 bg-[#2A2A2A]" />
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-px bg-[#2A2A2A]" />
                    <span className="text-[10px] text-[#8A8A8A] uppercase tracking-widest px-2 py-0.5 bg-[#0A0A0A]">
                      {node.parentRelation || "revision"}
                    </span>
                    <div className="flex-1 h-px bg-[#2A2A2A]" />
                  </div>
                </div>
              )}

              {/* Node */}
              <Link
                href={`/verify/${node.id}`}
                className={`block p-3 border transition-colors duration-100 ${
                  isCurrent
                    ? "bg-[#2A2A2A] border-[#8A8A8A]"
                    : "bg-[#0A0A0A] border-[#2A2A2A] hover:border-[#8A8A8A]"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-[#F5F3F0]">
                        {node.title || "Untitled"}
                      </h4>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-widest bg-[#8A8A8A] text-[#0A0A0A]">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8A8A8A]">{node.artistName}</p>
                    <p className="text-[10px] text-[#8A8A8A]">
                      {new Date(node.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div>
                    <p className="text-[10px] text-[#8A8A8A] mb-0.5">AI Contribution</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-medium text-[#F5F3F0]">{avgAI}%</span>
                      {aiDelta !== 0 && (
                        <span className={`text-[10px] ${aiDelta > 0 ? "text-[#8B4049]" : "text-[#4A7C59]"}`}>
                          {aiDelta > 0 ? "+" : ""}{aiDelta}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8A8A8A] mb-0.5">Transparency</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-medium text-[#F5F3F0]">{node.transparencyScore}</span>
                      {scoreDelta !== 0 && (
                        <span className={`text-[10px] ${scoreDelta > 0 ? "text-[#4A7C59]" : "text-[#8B4049]"}`}>
                          {scoreDelta > 0 ? "+" : ""}{scoreDelta}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8A8A8A] mb-0.5">Tools</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-medium text-[#F5F3F0]">{toolCount}</span>
                      {toolDelta !== 0 && (
                        <span className={`text-[10px] ${toolDelta > 0 ? "text-[#4A7C59]" : "text-[#8B4049]"}`}>
                          {toolDelta > 0 ? "+" : ""}{toolDelta}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stack preview */}
                {(node.aiModels || node.daws || node.plugins) && (
                  <div className="pt-2 border-t border-[#2A2A2A]">
                    <p className="text-[10px] text-[#8A8A8A] truncate">
                      Stack: {[node.aiModels, node.daws, node.plugins].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {fullTimeline.length > 1 && (
        <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
          <p className="text-xs text-[#8A8A8A]">
            <span className="text-[#F5F3F0]">Evolution:</span> {fullTimeline.length} version
            {fullTimeline.length > 1 ? "s" : ""} •
            AI: {calculateAvgAI(fullTimeline[0])}% → {calculateAvgAI(fullTimeline[fullTimeline.length - 1])}% •
            Transparency: {fullTimeline[0].transparencyScore} → {fullTimeline[fullTimeline.length - 1].transparencyScore}
          </p>
        </div>
      )}
    </div>
  );
}
