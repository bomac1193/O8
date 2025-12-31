import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const DEMO_TRACKS = [
  {
    title: "Midnight Synthesis",
    artistName: "Neural Echo",
    artistWallet: "0x1234567890abcdef1234567890abcdef12345678",
    aiMelody: 5,
    aiLyrics: 0,
    aiStems: 10,
    aiMastering: 15,
    transparencyScore: 93,
    humanScore: 93,
    ipfsCID: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    sha256: "0xabc123def456789012345678901234567890abcdef",
    trainingRights: false,
    derivativeRights: true,
    remixRights: true,
    consentLocked: true,
    badge: "HUMAN_CRAFTED",
    tokenId: 1,
    contractId: "0x0000000000000000000000000000000000000001",
    txHash: "0xdemo1",
  },
  {
    title: "Circuit Dreams",
    artistName: "Analog Heart",
    artistWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    aiMelody: 30,
    aiLyrics: 25,
    aiStems: 20,
    aiMastering: 10,
    transparencyScore: 84,
    humanScore: 79,
    ipfsCID: "QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX",
    sha256: "0xdef456abc789012345678901234567890abcdef12",
    trainingRights: true,
    derivativeRights: true,
    remixRights: true,
    consentLocked: false,
    badge: "AI_DISCLOSED",
    tokenId: 2,
    contractId: "0x0000000000000000000000000000000000000001",
    txHash: "0xdemo2",
  },
  {
    title: "Human Touch",
    artistName: "Organic Waves",
    artistWallet: "0x9876543210fedcba9876543210fedcba98765432",
    aiMelody: 0,
    aiLyrics: 0,
    aiStems: 0,
    aiMastering: 5,
    transparencyScore: 100,
    humanScore: 99,
    ipfsCID: "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    sha256: "0x789012abc345def678901234567890abcdef1234",
    trainingRights: false,
    derivativeRights: false,
    remixRights: true,
    consentLocked: true,
    badge: "HUMAN_CRAFTED",
    tokenId: 3,
    contractId: "0x0000000000000000000000000000000000000001",
    txHash: "0xdemo3",
  },
  {
    title: "Sovereign Sound",
    artistName: "No AI Please",
    artistWallet: "0xfedcba9876543210fedcba9876543210fedcba98",
    aiMelody: 0,
    aiLyrics: 0,
    aiStems: 0,
    aiMastering: 0,
    transparencyScore: 100,
    humanScore: 100,
    ipfsCID: "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ",
    sha256: "0x012345def678abc901234567890abcdef12345678",
    trainingRights: false,
    derivativeRights: false,
    remixRights: false,
    consentLocked: true,
    badge: "SOVEREIGN",
    tokenId: 4,
    contractId: "0x0000000000000000000000000000000000000001",
    txHash: "0xdemo4",
  },
  {
    title: "Full Consent EP",
    artistName: "Open Source Music",
    artistWallet: "0x1111222233334444555566667777888899990000",
    aiMelody: 45,
    aiLyrics: 40,
    aiStems: 35,
    aiMastering: 20,
    transparencyScore: 70,
    humanScore: 65,
    ipfsCID: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB",
    sha256: "0x345678abc901def234567890abcdef1234567890",
    trainingRights: true,
    derivativeRights: true,
    remixRights: true,
    consentLocked: true,
    badge: "FULL_CONSENT",
    tokenId: 5,
    contractId: "0x0000000000000000000000000000000000000001",
    txHash: "0xdemo5",
  },
];

async function main() {
  console.log("🌱 Seeding database with demo tracks...\n");

  for (const track of DEMO_TRACKS) {
    const declaration = await prisma.declaration.create({
      data: {
        ...track,
        contributorSplits: [],
        mintedAt: new Date(),
      },
    });

    console.log(`✅ Created: ${declaration.title} (${declaration.badge})`);

    // Add reward history for demo
    await prisma.rewardHistory.create({
      data: {
        declarationId: declaration.id,
        artistWallet: track.artistWallet,
        rewardType:
          track.badge === "HUMAN_CRAFTED" ? "human_crafted" : "transparent",
        amount: track.badge === "HUMAN_CRAFTED" ? "100000000000000000000" : "50000000000000000000",
        txHash: `${track.txHash}_reward`,
      },
    });
  }

  console.log("\n✨ Seeding complete!");
  console.log(`   Created ${DEMO_TRACKS.length} demo tracks`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
