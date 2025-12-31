"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Ø8
            </motion.span>
            <span className="hidden sm:block text-xs text-zinc-500 uppercase tracking-wider">
              Protocol
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/gallery"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/new"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Create
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </header>
  );
}
