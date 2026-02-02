import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { polygonAmoy, hardhat } from "wagmi/chains";

// Contract addresses (update after deployment)
export const O8_CONTRACTS = {
  registry: process.env.NEXT_PUBLIC_O8_REGISTRY_ADDRESS || "",
  token: process.env.NEXT_PUBLIC_O8_TOKEN_ADDRESS || "",
  score: process.env.NEXT_PUBLIC_O8_SCORE_ADDRESS || "",
} as const;

// Get WalletConnect Project ID - get one free at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";

// Wagmi config
export const config = getDefaultConfig({
  appName: "O8 Protocol",
  projectId,
  chains: [polygonAmoy, hardhat],
  transports: {
    [polygonAmoy.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_AMOY_URL ||
        "https://rpc-amoy.polygon.technology"
    ),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});

// Badge types — process-based, not hierarchy
// See lib/badges.ts for full badge system
export { BADGE_DEFINITIONS, getBadges, computeBadges } from "./badges";
