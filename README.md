# ∞8 ARCH

**Declarations v1.0**

Creative provenance protocol for AI-native music.

**Live:** [Coming soon - deploying to Vercel]
**Repo:** https://github.com/bomac1193/inf8
**Domain:** inf8.io (planned)

---

## What ∞8 ARCH Does

Prove your process. Immortalize your chain.

Every ∞8 declaration contains:
- **Identity**: Cryptographically verifiable artist identity, collaborators, contributors with revenue splits
- **Creative Stack**: Every tool in your workflow—DAWs, plugins, AI models, hardware
- **Production Intelligence**: Quantified AI contribution by phase (composition, arrangement, production, mixing, mastering)
- **Provenance Chain**: IPFS CID links to source material, samples, stems—immutable revision history
- **Audio Fingerprint**: SHA-256 verification linking declaration to output

Machine-readable. Verifiable. Permanent.

---

## Who This Is For

Masters-level producers using AI as serious creative tools, not crutches. Remix artists building complex derivative works who need verifiable source chains. Collaborative creators working across platforms, tools, and contributors who need attribution infrastructure. Forward-thinking labels building the next generation of music IP. Anyone who believes the future of music is multiplayer, generative, and AI-enabled.

---

## Who This Is NOT For

Casual beatmakers chasing presets.
AI toy users posting "Suno magic."
Artists afraid to show their workflow.

**Using AI tools isn't shameful. Hiding your process is.**

---

## The Problem

The music industry's metadata infrastructure (ISRC/ISWC) was built for a world that no longer exists:
- Assumes one artist makes one song
- Songs are fixed, final products
- Tools are invisible
- Creation is individual, not networked

**What AI-native music actually looks like:**
- A beat starts in Ableton, gets AI-enhanced melodies via Suno, receives vocal stems from three artists, gets final arrangement by a fifth producer
- Tracks evolve through 47 revisions over 8 months—the evolution IS the art
- Process sophistication is the differentiator between amateur and master
- Remix culture means every track has lineage; derivative works inherit source chains
- Multiplayer creation is the norm, not the exception

ISRC codes tell you nothing about how music was made. They identify; they don't illuminate.

**∞8 ARCH solves this.**

---

## The Solution

**Build the provenance layer for AI-native music where process transparency becomes proof of mastery—not confession of assistance.**

Transparency is technique. Showing your process isn't defensive; it's demonstration of sophistication. Like a chef who shows you the kitchen, or a watchmaker who displays the mechanism through a sapphire caseback.

A producer who declares "88% AI melody, 35% AI arrangement" isn't admitting weakness. They're showing they understand their tools deeply enough to quantify and optimize their workflow. That's mastery.

---

## Declaration Structure

```json
{
  "version": "1.0",
  "declaration_id": "∞8-[IPFS_CID]",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",

  "identity": {
    "primary_artist": {
      "name": "string",
      "wallet": "0x...",
      "signature": "cryptographic_signature"
    },
    "collaborators": [
      {
        "name": "string",
        "wallet": "0x...",
        "role": "string",
        "split_percentage": 0.0
      }
    ],
    "contributors": []
  },

  "creative_stack": {
    "daws": ["Ableton Live 12", "Logic Pro X"],
    "plugins": ["Serum", "FabFilter Pro-Q3"],
    "ai_models": ["Suno v3", "AIVA"],
    "hardware": ["Push 3", "Modular synth"],
    "samples": []
  },

  "production_intelligence": {
    "ai_contribution": {
      "composition": 0.88,
      "arrangement": 0.35,
      "production": 0.12,
      "mixing": 0.05,
      "mastering": 0.20
    },
    "methodology": "Started with AI-generated chord progression (Suno), arranged manually in Ableton, mixed traditionally with FabFilter suite, final master touch with AI balance analysis.",
    "transparency_score": 95
  },

  "provenance": {
    "ipfs_cid": "QmXx...",
    "source_material": ["∞8-QmYy...", "∞8-QmZz..."],
    "samples": [],
    "stems": ["∞8-QmAa..."]
  },

  "revision_history": [
    {
      "version": 2,
      "ipfs_cid": "QmBb...",
      "timestamp": "ISO-8601",
      "changes": "Increased AI arrangement, updated mixing approach"
    }
  ],

  "audio_fingerprint": {
    "sha256": "a3f5...",
    "duration_ms": 245000,
    "format": "wav"
  },

  "usage_rights": {
    "training_rights": false,
    "derivative_rights": true,
    "remix_rights": true
  }
}
```

---

## Verification

Any party can verify a declaration by:
1. Fetching the declaration from IPFS via CID
2. Hashing the referenced audio file
3. Comparing SHA-256 fingerprint to declared value
4. Validating cryptographic signatures against stated identities

**Declarations are facts, not claims.**

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Storage:** IPFS (Pinata), Vercel Postgres
- **Blockchain:** Polygon Amoy (testnet), optional on-chain minting
- **Wallet:** RainbowKit, Wagmi, Viem
- **Design:** Brutalist monochrome (∞8 ARCH aesthetic)

---

## Getting Started

### Prerequisites
- Node.js 18+
- Pinata API key (IPFS uploads)
- WalletConnect Project ID
- Alchemy API key (Polygon RPC)

### Installation

```bash
# Clone
git clone https://github.com/bomac1193/inf8.git
cd inf8/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Run database migration
npx prisma db push

# Start dev server
npm run dev
```

Visit `http://localhost:3000`

---

## Deployment

See [DEPLOY.md](./DEPLOY.md) for complete Vercel deployment guide.

**Quick summary:**
1. Deploy to Vercel (set Root Directory: `frontend`)
2. Add Vercel Postgres database
3. Configure environment variables (Pinata, WalletConnect, Alchemy)
4. Run Prisma migration
5. Redeploy

---

## Brand Identity

**∞8 ARCH** (pronounced "inf-eight arch" or "infinite arch")

### Brand Hierarchy
```
∞8 ARCH              ← BRAND (symbol, culture, identity)
└── Declarations     ← PROTOCOL (product v1.0, technical utility)
```

- **∞** = infinity, endless creative lineage
- **8** = infinity rotated, recursive loop
- **ARCH** = architectural permanence, eternal structure
- **Declarations** = machine-readable provenance protocol

**Every track has infinite lineage. Every process builds an eternal chain. You are an architect of provenance.**

See [BRAND.md](./BRAND.md) for full brand system documentation.

---

## Roadmap

**v1.0 (NOW):** Declarations protocol, IPFS storage, optional on-chain minting
**v1.5 (Month 3-6):** Platform integrations (streaming services, NFT marketplaces)
**v2.0 (Year 1):** Remix lineage chains, generative track support, badge marketplace
**v3.0 (Year 2+):** ∞8 ARCH as foundational music metadata layer

---

## Philosophy

**Process is provenance. Mastery is transparent.**

We're not solving today's authenticity crisis. We're building the provenance layer for tomorrow's music economy.

Using AI tools isn't shameful. Using them poorly is.

---

## Contributing

Open protocol. Open source. Open to contributions.

Issues and PRs welcome at https://github.com/bomac1193/inf8

---

## License

MIT. Open protocol. No gatekeeping.

---

## Contact

**GitHub:** https://github.com/bomac1193/inf8
**Email:** bomac1193@gmail.com
**Domain:** inf8.io (coming soon)

---

**Ship v1.0 at 92/100. Let culture finish the score.**
