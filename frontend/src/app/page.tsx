"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReadContract } from "wagmi";
import { O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS } from "@/lib/wagmi";

export default function Home() {
  const { data: totalTracks } = useReadContract({
    address: O8_CONTRACTS.registry as `0x${string}`,
    abi: O8RegistryABI,
    functionName: "totalTracks",
  });

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-black to-black" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-violet-200 to-purple-400 bg-clip-text text-transparent">
                Ø8
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-zinc-300 font-light mb-4">
              Prove you&apos;re human.
            </p>
            <p className="text-xl md:text-3xl text-zinc-300 font-light mb-4">
              Earn more.
            </p>
            <p className="text-xl md:text-3xl text-violet-400 font-medium mb-12">
              Control AI usage of your music.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/new"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-violet-500/25"
            >
              Declare Your Track
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium rounded-full transition-all"
            >
              Explore Gallery
            </Link>
          </motion.div>

          {/* Live mint counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Live on Polygon Amoy</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-zinc-700" />
            <div>
              <span className="text-violet-400 font-mono">
                {totalTracks?.toString() || "0"}
              </span>{" "}
              tracks verified
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            The Human-First Music Protocol
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Human Verification</h3>
              <p className="text-zinc-400">
                Declare your AI contribution honestly. Earn the Human-Crafted
                badge for tracks with &lt;20% AI across all categories.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Consent Control</h3>
              <p className="text-zinc-400">
                SOVN module lets you control AI training, derivatives, and
                remixes. Lock your consent on-chain permanently.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ø8 Token Rewards</h3>
              <p className="text-zinc-400">
                Earn Ø8 tokens for verified human-crafted tracks, transparent
                disclosures, and early adoption.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Upload Your Track",
                desc: "Connect your wallet and upload your stems, master, or audio file to IPFS.",
              },
              {
                step: "02",
                title: "Declare AI Usage",
                desc: "Honestly declare the AI contribution percentage for melody, lyrics, stems, and mastering.",
              },
              {
                step: "03",
                title: "Set Consent Toggles",
                desc: "Choose whether to allow AI training, derivatives, and remixes using the SOVN module.",
              },
              {
                step: "04",
                title: "Mint Your Badge",
                desc: "Mint your Ø8 NFT badge on Polygon. Earn tokens and prove your track's provenance forever.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="text-4xl font-bold text-violet-600/50 font-mono">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-t from-violet-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to prove you&apos;re human?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join the movement. Declare your tracks. Own your consent.
          </p>
          <Link
            href="/new"
            className="inline-block px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
          >
            Try Live on Polygon Amoy
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div>Ø8 Protocol — Human-First Music</div>
          <div className="flex gap-6">
            <Link href="/gallery" className="hover:text-white transition-colors">
              Gallery
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://polygonscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Contract
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
