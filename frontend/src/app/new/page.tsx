"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { keccak256, toBytes, parseEther } from "viem";
import { O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS } from "@/lib/wagmi";

interface ContributorSplit {
  address: string;
  basisPoints: number;
  role: string;
}

export default function NewDeclaration() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Form state
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [aiMelody, setAiMelody] = useState(0);
  const [aiLyrics, setAiLyrics] = useState(0);
  const [aiStems, setAiStems] = useState(0);
  const [aiMastering, setAiMastering] = useState(0);
  const [trainingRights, setTrainingRights] = useState(false);
  const [derivativeRights, setDerivativeRights] = useState(false);
  const [remixRights, setRemixRights] = useState(false);
  const [ipfsCID, setIpfsCID] = useState("");
  const [contributors, setContributors] = useState<ContributorSplit[]>([]);

  // Calculate transparency score
  const transparencyScore = useCallback(() => {
    const avgAI = (aiMelody + aiLyrics + aiStems + aiMastering) / 4;
    let score = 100 - avgAI;
    if (aiMelody > 0 || aiLyrics > 0 || aiStems > 0 || aiMastering > 0) {
      score += 5;
    }
    return Math.min(100, Math.round(score));
  }, [aiMelody, aiLyrics, aiStems, aiMastering]);

  // Check if human-crafted
  const isHumanCrafted = aiMelody < 20 && aiLyrics < 20 && aiStems < 20 && aiMastering < 20;

  // Determine badge
  const getBadge = () => {
    if (isHumanCrafted && transparencyScore() >= 80) return "HUMAN_CRAFTED";
    if (!trainingRights) return "SOVEREIGN";
    if (trainingRights && derivativeRights && remixRights) return "FULL_CONSENT";
    if (transparencyScore() >= 60) return "AI_DISCLOSED";
    return "TRANSPARENT";
  };

  const handleMint = async () => {
    if (!address || !ipfsCID || !title) return;

    const sha256Hash = keccak256(toBytes(ipfsCID + title + Date.now()));
    const tokenURI = `ipfs://${ipfsCID}`;

    writeContract({
      address: O8_CONTRACTS.registry as `0x${string}`,
      abi: O8RegistryABI,
      functionName: "mintTrack",
      args: [
        title,
        artistName,
        aiMelody,
        aiLyrics,
        aiStems,
        aiMastering,
        ipfsCID,
        sha256Hash,
        trainingRights,
        derivativeRights,
        remixRights,
        tokenURI,
      ],
    });
  };

  const addContributor = () => {
    if (contributors.length < 10) {
      setContributors([...contributors, { address: "", basisPoints: 0, role: "" }]);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Declare Your Track</h1>
          <p className="text-zinc-400 mb-8">
            Register your music on-chain with full transparency and consent control.
          </p>
        </motion.div>

        {!isConnected ? (
          <div className="text-center py-16 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <p className="text-zinc-400 mb-4">Connect your wallet to continue</p>
            <ConnectButton />
          </div>
        ) : isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl bg-emerald-900/20 border border-emerald-500/50"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Track Verified!</h2>
            <p className="text-zinc-400 mb-4">
              Your track has been minted on Polygon Amoy.
            </p>
            <a
              href={`https://amoy.polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline"
            >
              View on PolygonScan →
            </a>
          </motion.div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMint();
            }}
            className="space-y-8"
          >
            {/* Track Info */}
            <section className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-4">Track Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:outline-none transition-colors"
                    placeholder="My Amazing Track"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:outline-none transition-colors"
                    placeholder="Your Artist Name"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-zinc-400 mb-2">
                  IPFS CID *
                </label>
                <input
                  type="text"
                  value={ipfsCID}
                  onChange={(e) => setIpfsCID(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-violet-500 focus:outline-none transition-colors font-mono text-sm"
                  placeholder="Qm... or bafk..."
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Upload your audio to IPFS first (via Pinata, NFT.Storage, etc.)
                </p>
              </div>
            </section>

            {/* AI Contribution */}
            <section className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-4">AI Contribution</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Honestly declare the percentage of AI contribution in each category.
                Lower AI = higher transparency score.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Melody", value: aiMelody, setter: setAiMelody },
                  { label: "Lyrics", value: aiLyrics, setter: setAiLyrics },
                  { label: "Stems/Arrangement", value: aiStems, setter: setAiStems },
                  { label: "Mastering", value: aiMastering, setter: setAiMastering },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-zinc-400">{label}</label>
                      <span
                        className={`text-sm font-mono ${
                          value < 20 ? "text-emerald-400" : value < 50 ? "text-amber-400" : "text-red-400"
                        }`}
                      >
                        {value}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => setter(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>
                ))}
              </div>

              {/* Transparency Score Preview */}
              <div className="mt-8 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-zinc-400">Transparency Score</div>
                    <div className="text-3xl font-bold text-violet-400">
                      {transparencyScore()}
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      isHumanCrafted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {getBadge().replace("_", "-")}
                  </div>
                </div>
              </div>
            </section>

            {/* SOVN Consent */}
            <section className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-2">SOVN Consent Control</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Control how AI systems can use your music. These settings can be locked permanently.
              </p>
              <div className="space-y-4">
                {[
                  {
                    id: "training",
                    label: "Allow AI Training",
                    desc: "Permit AI models to train on this work",
                    checked: trainingRights,
                    setter: setTrainingRights,
                  },
                  {
                    id: "derivative",
                    label: "Allow AI Derivatives",
                    desc: "Permit AI-generated derivative works",
                    checked: derivativeRights,
                    setter: setDerivativeRights,
                  },
                  {
                    id: "remix",
                    label: "Allow Remixes",
                    desc: "Permit covers, remixes, and samples",
                    checked: remixRights,
                    setter: setRemixRights,
                  },
                ].map(({ id, label, desc, checked, setter }) => (
                  <label
                    key={id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setter(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded bg-zinc-700 border-zinc-600 text-violet-500 focus:ring-violet-500"
                    />
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-sm text-zinc-400">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Contributor Splits (Optional) */}
            <section className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Contributor Splits</h2>
                  <p className="text-sm text-zinc-400">Optional: Add collaborators</p>
                </div>
                <button
                  type="button"
                  onClick={addContributor}
                  className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  + Add Contributor
                </button>
              </div>
              {contributors.length > 0 && (
                <div className="space-y-3">
                  {contributors.map((c, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2">
                      <input
                        placeholder="0x..."
                        value={c.address}
                        onChange={(e) => {
                          const updated = [...contributors];
                          updated[i].address = e.target.value;
                          setContributors(updated);
                        }}
                        className="col-span-5 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-mono"
                      />
                      <input
                        type="number"
                        placeholder="BPS"
                        value={c.basisPoints || ""}
                        onChange={(e) => {
                          const updated = [...contributors];
                          updated[i].basisPoints = Number(e.target.value);
                          setContributors(updated);
                        }}
                        className="col-span-3 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm"
                      />
                      <input
                        placeholder="Role"
                        value={c.role}
                        onChange={(e) => {
                          const updated = [...contributors];
                          updated[i].role = e.target.value;
                          setContributors(updated);
                        }}
                        className="col-span-3 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setContributors(contributors.filter((_, j) => j !== i));
                        }}
                        className="col-span-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || isConfirming || !title || !ipfsCID}
              className="w-full py-4 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isPending
                ? "Confirm in Wallet..."
                : isConfirming
                ? "Minting..."
                : "Mint Ø8 Badge"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
