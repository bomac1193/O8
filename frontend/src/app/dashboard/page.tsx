"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { O8TokenABI, O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS, BADGE_COLORS } from "@/lib/wagmi";

// Demo data for user's tracks
const USER_TRACKS = [
  {
    id: "demo-1",
    tokenId: 1,
    title: "Midnight Synthesis",
    transparencyScore: 93,
    badge: "HUMAN_CRAFTED",
    mintedAt: "2024-12-30T12:00:00Z",
    rewardsEarned: "150",
  },
  {
    id: "demo-2",
    tokenId: 2,
    title: "Circuit Dreams",
    transparencyScore: 84,
    badge: "AI_DISCLOSED",
    mintedAt: "2024-12-29T15:30:00Z",
    rewardsEarned: "50",
  },
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  const { data: tokenBalance } = useReadContract({
    address: O8_CONTRACTS.token as `0x${string}`,
    abi: O8TokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: artistRewards } = useReadContract({
    address: O8_CONTRACTS.token as `0x${string}`,
    abi: O8TokenABI,
    functionName: "getArtistRewards",
    args: address ? [address] : undefined,
  });

  const { data: userTracks } = useReadContract({
    address: O8_CONTRACTS.registry as `0x${string}`,
    abi: O8RegistryABI,
    functionName: "getCreatorTracks",
    args: address ? [address] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-zinc-400 mb-8">
            Connect your wallet to view your declarations, token balance, and rewards.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-zinc-400 font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Token Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/20"
          >
            <div className="text-sm text-zinc-400 mb-2">Ø8 Token Balance</div>
            <div className="text-4xl font-bold text-violet-400">
              {tokenBalance ? formatEther(tokenBalance).slice(0, 8) : "0"}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Ø8</div>
          </motion.div>

          {/* Total Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
          >
            <div className="text-sm text-zinc-400 mb-2">Total Rewards Earned</div>
            <div className="text-4xl font-bold text-emerald-400">
              {artistRewards ? formatEther(artistRewards).slice(0, 8) : "200"}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Ø8</div>
          </motion.div>

          {/* Tracks Verified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
          >
            <div className="text-sm text-zinc-400 mb-2">Tracks Verified</div>
            <div className="text-4xl font-bold">
              {userTracks?.length || USER_TRACKS.length}
            </div>
            <div className="text-sm text-zinc-500 mt-1">NFT badges minted</div>
          </motion.div>
        </div>

        {/* Your Declarations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Declarations</h2>
            <Link
              href="/new"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors"
            >
              + New Declaration
            </Link>
          </div>

          {USER_TRACKS.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-zinc-400 mb-4">
                You haven&apos;t declared any tracks yet.
              </p>
              <Link
                href="/new"
                className="text-violet-400 hover:underline"
              >
                Create your first declaration →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {USER_TRACKS.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Link href={`/verify/${track.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl">
                          🎵
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-violet-400 transition-colors">
                            {track.title}
                          </h3>
                          <div className="text-sm text-zinc-500">
                            Token #{track.tokenId} • Minted{" "}
                            {new Date(track.mintedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="text-sm text-zinc-400">Rewards</div>
                          <div className="text-emerald-400 font-medium">
                            +{track.rewardsEarned} Ø8
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            BADGE_COLORS[track.badge] || "bg-zinc-600"
                          } text-white`}
                        >
                          {track.badge.replace("_", "-")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Reward History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Reward History</h2>
          <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                    Track
                  </th>
                  <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-zinc-400 font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="px-4 py-3 text-zinc-400">Dec 30, 2024</td>
                  <td className="px-4 py-3">Midnight Synthesis</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                      Human-Crafted
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    +100 Ø8
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-zinc-400">Dec 30, 2024</td>
                  <td className="px-4 py-3">Midnight Synthesis</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">
                      Early Adopter
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    +50 Ø8
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-zinc-400">Dec 29, 2024</td>
                  <td className="px-4 py-3">Circuit Dreams</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs">
                      Transparent
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    +50 Ø8
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
