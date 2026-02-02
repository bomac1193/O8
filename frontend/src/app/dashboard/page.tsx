"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { O8TokenABI, O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS } from "@/lib/wagmi";
import { getBadges } from "@/lib/badges";

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

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: tokenBalance } = useReadContract({
    address: O8_CONTRACTS.token as `0x${string}`,
    abi: O8TokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  });

  const { data: artistRewards } = useReadContract({
    address: O8_CONTRACTS.token as `0x${string}`,
    abi: O8TokenABI,
    functionName: "getArtistRewards",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  });

  const { data: userTracks } = useReadContract({
    address: O8_CONTRACTS.registry as `0x${string}`,
    abi: O8RegistryABI,
    functionName: "getCreatorTracks",
    args: address ? [address] : undefined,
    query: { enabled: isConnected },
  });

  // Fetch declarations from API
  useEffect(() => {
    async function fetchDeclarations() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (isConnected && address) {
          params.set("artist", address);
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
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
            Dashboard
          </p>
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            Your Declarations
          </h1>
          {isConnected ? (
            <p className="text-[#8A8A8A] font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          ) : (
            <p className="text-[#8A8A8A] text-sm">
              Connect a wallet to see on-chain data and token balance.
            </p>
          )}
        </div>

        {/* Stats Grid — wallet panel shown only when connected */}
        {isConnected && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                O8 Token Balance
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-medium text-[#F5F3F0]">
                  {tokenBalance ? formatEther(tokenBalance).slice(0, 8) : "0"}
                </span>
                <span className="text-[#8A8A8A]">O8</span>
              </div>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                Total Rewards Earned
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-medium text-[#4A7C59]">
                  {artistRewards ? formatEther(artistRewards).slice(0, 8) : "0"}
                </span>
                <span className="text-[#8A8A8A]">O8</span>
              </div>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                On-Chain Declarations
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-medium text-[#F5F3F0]">
                  {userTracks?.length || 0}
                </span>
                <span className="text-[#8A8A8A]">minted</span>
              </div>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="mb-12 p-6 bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-between">
            <div>
              <p className="text-sm text-[#F5F3F0] mb-1">Want to see token balance and on-chain data?</p>
              <p className="text-xs text-[#8A8A8A]">Connect a wallet to unlock rewards panel.</p>
            </div>
            <ConnectButton />
          </div>
        )}

        {/* Declarations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
              Declarations
            </p>
            <Link
              href="/new"
              className="px-4 py-2 bg-[#F5F3F0] text-[#0A0A0A] text-sm font-medium hover:opacity-85 transition-opacity duration-100"
            >
              New Declaration
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-[#8A8A8A]">Loading declarations...</p>
            </div>
          ) : declarations.length === 0 ? (
            <div className="text-center py-16 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-[#8A8A8A] mb-6">
                No declarations yet.
              </p>
              <Link
                href="/new"
                className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
              >
                Create your first declaration
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {declarations.map((dec) => {
                const avgAI = calculateAverageAI(dec);
                const badges = getBadges(dec.badge);
                return (
                  <Link key={dec.id} href={`/verify/${dec.id}`}>
                    <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100 cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                          <p className="text-sm text-[#8A8A8A]">
                            {dec.artistName} &middot;{" "}
                            {new Date(dec.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs text-[#8A8A8A]">Score</p>
                            <p className="text-lg font-medium text-[#F5F3F0]">
                              {dec.transparencyScore}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#8A8A8A]">AI</p>
                            <p className="text-lg font-medium text-[#F5F3F0]">
                              {Math.round(avgAI * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
