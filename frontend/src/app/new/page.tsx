"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { keccak256, toBytes } from "viem";
import { O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS } from "@/lib/wagmi";
import { computeSHA256, uploadToPinata } from "@/lib/ipfs";

interface AIContribution {
  composition: number;
  arrangement: number;
  production: number;
  mixing: number;
  mastering: number;
}

interface Collaborator {
  name: string;
  role: string;
  wallet: string;
  split: number;
}

const COLLABORATOR_ROLES = [
  "Producer",
  "Songwriter",
  "Vocalist",
  "Engineer",
  "Mixer",
  "Mastering",
  "Instrumentalist",
  "AI Operator",
  "Other",
];

const RELATIONSHIP_TYPES = [
  { value: "", label: "None" },
  { value: "original", label: "Original" },
  { value: "remix", label: "Remix" },
  { value: "cover", label: "Cover" },
  { value: "sample", label: "Sample" },
  { value: "interpolation", label: "Interpolation" },
  { value: "revision", label: "Revision" },
];

const AI_PRESETS: Record<string, AIContribution> = {
  "Mostly Human": { composition: 0, arrangement: 0, production: 0.05, mixing: 0, mastering: 0.1 },
  "AI-Assisted": { composition: 0.2, arrangement: 0.15, production: 0.2, mixing: 0.05, mastering: 0.1 },
  "AI-Native": { composition: 0.7, arrangement: 0.65, production: 0.6, mixing: 0.3, mastering: 0.5 },
};

interface WorkflowTemplate {
  name: string;
  description: string;
  aiModels: string;
  daws: string;
  plugins: string;
  hardware: string;
  aiContribution: AIContribution;
  methodology: string;
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    name: "Suno Only",
    description: "Pure AI generation with Suno",
    aiModels: "Suno v4",
    daws: "N/A",
    plugins: "N/A",
    hardware: "N/A",
    aiContribution: { composition: 1.0, arrangement: 1.0, production: 1.0, mixing: 1.0, mastering: 1.0 },
    methodology: "Track generated entirely with Suno AI. Prompt engineering and iteration for desired output.",
  },
  {
    name: "Udio Only",
    description: "Pure AI generation with Udio",
    aiModels: "Udio v1.5",
    daws: "N/A",
    plugins: "N/A",
    hardware: "N/A",
    aiContribution: { composition: 1.0, arrangement: 1.0, production: 1.0, mixing: 1.0, mastering: 1.0 },
    methodology: "Track generated entirely with Udio AI. Prompt engineering and iteration for desired output.",
  },
  {
    name: "AI + DAW Hybrid",
    description: "AI generation with DAW production",
    aiModels: "Suno v4",
    daws: "Ableton Live 12",
    plugins: "FabFilter Pro-Q 3, Valhalla VintageVerb, Serum",
    hardware: "N/A",
    aiContribution: { composition: 0.8, arrangement: 0.7, production: 0.4, mixing: 0.2, mastering: 0.1 },
    methodology: "Initial composition and arrangement with Suno. Exported stems and processed in Ableton. Manual mixing and mastering with professional plugins.",
  },
  {
    name: "AI-Assisted DAW",
    description: "Traditional DAW with AI assistance",
    aiModels: "AIVA, Splice AI",
    daws: "FL Studio 21",
    plugins: "Ozone 11, Neutron 4, Kontakt 7",
    hardware: "MIDI keyboard",
    aiContribution: { composition: 0.3, arrangement: 0.2, production: 0.2, mixing: 0.1, mastering: 0.3 },
    methodology: "AI-generated melodic ideas and drum patterns. Human arrangement, performance, and production. AI-assisted mastering with Ozone.",
  },
  {
    name: "Traditional (No AI)",
    description: "100% human production",
    aiModels: "N/A",
    daws: "Pro Tools 2024",
    plugins: "Waves Bundle, UAD, Soundtoys",
    hardware: "Apollo interface, SSL console, analog outboard",
    aiContribution: { composition: 0, arrangement: 0, production: 0, mixing: 0, mastering: 0 },
    methodology: "Fully human composition, performance, and production. Traditional analog and digital workflow. No AI tools used.",
  },
];

function NewDeclarationForm() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({ hash });
  const searchParams = useSearchParams();

  // Form state
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [daws, setDaws] = useState("");
  const [plugins, setPlugins] = useState("");
  const [aiModels, setAiModels] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [methodology, setMethodology] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [promptVisibility, setPromptVisibility] = useState<"public" | "private" | "paywalled">("private");
  const [aiContribution, setAiContribution] = useState<AIContribution>({
    composition: 0,
    arrangement: 0,
    production: 0,
    mixing: 0,
    mastering: 0,
  });

  // Consent state
  const [trainingRights, setTrainingRights] = useState(false);
  const [derivativeRights, setDerivativeRights] = useState(true);
  const [remixRights, setRemixRights] = useState(true);

  // Collaborator state
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  // Lineage state
  const [parentDeclarationId, setParentDeclarationId] = useState("");
  const [parentRelation, setParentRelation] = useState("");

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API save state
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Load parent declaration for versioning
  useEffect(() => {
    const fromVersion = searchParams?.get("fromVersion");
    if (fromVersion) {
      // Fetch parent declaration and pre-fill
      fetch(`/api/declarations/${fromVersion}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(`${data.title} (v2)`);
          setArtistName(data.artistName);
          setDaws(data.daws || "");
          setPlugins(data.plugins || "");
          setAiModels(data.aiModels || "");
          setMethodology(data.methodology || "");
          setAiContribution({
            composition: data.aiComposition / 100,
            arrangement: data.aiArrangement / 100,
            production: data.aiProduction / 100,
            mixing: data.aiMixing / 100,
            mastering: data.aiMastering / 100,
          });
          setParentDeclarationId(fromVersion);
          setParentRelation("revision");
        })
        .catch((err) => console.error("Failed to load parent declaration:", err));
    }
  }, [searchParams]);

  // Pre-fill form from URL parameters (Suno bookmarklet integration)
  useEffect(() => {
    if (searchParams) {
      const urlTitle = searchParams.get("title");
      const urlMethodology = searchParams.get("methodology");
      const urlAiPrompt = searchParams.get("aiPrompt");
      const urlModel = searchParams.get("model");
      const urlArtist = searchParams.get("artist");

      // Creative stack parameters
      const urlAiModels = searchParams.get("aiModels");
      const urlDaws = searchParams.get("daws");
      const urlPlugins = searchParams.get("plugins");
      const urlHardware = searchParams.get("hardware");

      // AI contribution parameters (0-100 scale from bookmarklet)
      const urlAiComp = searchParams.get("aiComp");
      const urlAiArr = searchParams.get("aiArr");
      const urlAiProd = searchParams.get("aiProd");
      const urlAiMix = searchParams.get("aiMix");
      const urlAiMaster = searchParams.get("aiMaster");

      if (urlTitle) setTitle(urlTitle);
      if (urlArtist) setArtistName(urlArtist);
      if (urlMethodology) setMethodology(urlMethodology);
      if (urlAiPrompt) setAiPrompt(urlAiPrompt);

      // Creative stack auto-fill
      if (urlAiModels) setAiModels(urlAiModels);
      else if (urlModel) setAiModels(urlModel);

      if (urlDaws) setDaws(urlDaws);
      if (urlPlugins) setPlugins(urlPlugins);

      // AI contribution auto-fill (convert from 0-100 to 0-1 scale)
      if (urlAiComp || urlAiArr || urlAiProd || urlAiMix || urlAiMaster) {
        setAiContribution({
          composition: urlAiComp ? parseInt(urlAiComp) / 100 : 0,
          arrangement: urlAiArr ? parseInt(urlAiArr) / 100 : 0,
          production: urlAiProd ? parseInt(urlAiProd) / 100 : 0,
          mixing: urlAiMix ? parseInt(urlAiMix) / 100 : 0,
          mastering: urlAiMaster ? parseInt(urlAiMaster) / 100 : 0,
        });
      } else if (urlModel && urlModel.toLowerCase().includes("suno")) {
        // Fallback: If coming from Suno but no explicit AI values, use defaults
        setAiContribution({
          composition: 1.0,
          arrangement: 1.0,
          production: 0.5,
          mixing: 0.3,
          mastering: 0.3,
        });
      }
    }
  }, [searchParams]);

  const updateAI = (key: keyof AIContribution, value: number) => {
    setAiContribution({ ...aiContribution, [key]: value });
  };

  const applyPreset = (presetName: string) => {
    const preset = AI_PRESETS[presetName];
    if (preset) setAiContribution(preset);
  };

  const applyTemplate = (template: WorkflowTemplate) => {
    setAiModels(template.aiModels);
    setDaws(template.daws);
    setPlugins(template.plugins);
    setAiContribution(template.aiContribution);
    setMethodology(template.methodology);
  };

  // Calculate transparency score (client-side preview)
  const transparencyScore = useCallback(() => {
    let score = 30; // declaring at all
    score += 20; // AI phases always filled
    score += Math.round(Math.min(methodology.length / 200, 1) * 15);
    const stackItems = [
      ...daws.split(",").filter(Boolean),
      ...plugins.split(",").filter(Boolean),
      ...aiModels.split(",").filter(Boolean),
    ];
    score += Math.min(stackItems.length * 3, 15);
    if (ipfsCID) score += 5;
    if (sha256Hash) score += 5;
    if (collaborators.length > 0) score += 10;
    return Math.min(score, 100);
  }, [methodology, daws, plugins, aiModels, ipfsCID, sha256Hash, collaborators]);

  // Handle file upload for IPFS
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("audio/")) {
      setUploadError("Please upload an audio file.");
      return;
    }
    setIsUploading(true);
    setUploadError("");

    // Compute SHA-256 client-side
    const hash = await computeSHA256(file);
    setSha256Hash(hash);

    // Upload to Pinata
    const result = await uploadToPinata(file);
    if (result.error) {
      setUploadError(result.error);
    } else {
      setIpfsCID(result.cid);
    }
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // Add collaborator
  const addCollaborator = () => {
    setCollaborators([...collaborators, { name: "", role: "Producer", wallet: "", split: 0 }]);
  };

  const removeCollaborator = (index: number) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  const updateCollaborator = (index: number, field: keyof Collaborator, value: string | number) => {
    const updated = [...collaborators];
    updated[index] = { ...updated[index], [field]: value };
    setCollaborators(updated);
  };

  // Validate collaborator splits
  const splitsValid = collaborators.length === 0 || collaborators.reduce((sum, c) => sum + c.split, 0) === 100;

  // Save to API (database only, no wallet required)
  const saveToAPI = async () => {
    if (!artistName) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/declarations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artistName,
          artistWallet: isConnected ? address : null,
          aiComposition: Math.round(aiContribution.composition * 100),
          aiArrangement: Math.round(aiContribution.arrangement * 100),
          aiProduction: Math.round(aiContribution.production * 100),
          aiMixing: Math.round(aiContribution.mixing * 100),
          aiMastering: Math.round(aiContribution.mastering * 100),
          ipfsCID,
          sha256: sha256Hash,
          trainingRights,
          derivativeRights,
          remixRights,
          contributorSplits: collaborators.length > 0 ? collaborators : [],
          methodology,
          aiPrompt,
          promptVisibility,
          daws,
          plugins,
          aiModels,
          parentDeclarationId: parentDeclarationId || undefined,
          parentRelation: parentRelation || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedId(data.id);
      }
    } catch (err) {
      console.error("Failed to save declaration:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Mint on-chain (requires wallet)
  const handleMint = async () => {
    if (!address || !ipfsCID || !artistName) return;

    const contractHash = keccak256(toBytes(ipfsCID + artistName + Date.now()));
    const tokenURI = `ipfs://${ipfsCID}`;

    // Bridge 5 frontend phases to 4 contract phases until contract V2
    writeContract({
      address: O8_CONTRACTS.registry as `0x${string}`,
      abi: O8RegistryABI,
      functionName: "mintTrack",
      args: [
        title || artistName,
        artistName,
        Math.round(aiContribution.composition * 100),
        Math.round(aiContribution.arrangement * 100),
        Math.round(aiContribution.production * 100),
        Math.round(aiContribution.mastering * 100),
        ipfsCID,
        contractHash,
        trainingRights,
        derivativeRights,
        remixRights,
        tokenURI,
      ],
    });
  };

  // Submit handler: save to DB, then optionally mint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!splitsValid) return;

    if (isConnected && ipfsCID) {
      // Save to API first, then mint on-chain
      await saveToAPI();
      await handleMint();
    } else {
      // Save to API only
      await saveToAPI();
    }
  };

  const avgAI =
    (aiContribution.composition +
      aiContribution.arrangement +
      aiContribution.production +
      aiContribution.mixing +
      aiContribution.mastering) /
    5;

  if (savedId && !isConnected) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
        <div className="max-w-[640px] mx-auto">
          <div className="text-center py-16 bg-[#1A1A1A] border border-[#4A7C59]">
            <p className="text-xs uppercase tracking-widest text-[#4A7C59] mb-4">
              Declaration Saved
            </p>
            <p className="text-[#F5F3F0] mb-4">
              Your declaration has been saved to the database.
            </p>
            <p className="text-[#8A8A8A] text-sm mb-6">
              Connect a wallet to publish on-chain.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href={`/verify/${savedId}`}
                className="px-4 py-2 bg-[#F5F3F0] text-[#0A0A0A] text-sm font-medium hover:opacity-85"
              >
                View Declaration
              </a>
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isMintSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
        <div className="max-w-[640px] mx-auto">
          <div className="text-center py-16 bg-[#1A1A1A] border border-[#4A7C59]">
            <p className="text-xs uppercase tracking-widest text-[#4A7C59] mb-4">
              Declaration Published
            </p>
            <p className="text-[#F5F3F0] mb-6">
              Your declaration has been minted on-chain.
            </p>
            <a
              href={`https://amoy.polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A8A8A] hover:text-[#F5F3F0] text-sm"
            >
              View transaction
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            Create Declaration
          </h1>
          <p className="text-[#8A8A8A]">
            Document your creative provenance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Workflow Templates */}
          <section className="p-4 bg-[#1A1A1A] border border-[#8A8A8A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-3">
              Quick Start Templates
            </p>
            <p className="text-xs text-[#8A8A8A] mb-4">
              Choose a template to pre-fill your workflow, or start from scratch.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {WORKFLOW_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100 text-left"
                  title={template.description}
                >
                  <p className="text-xs font-medium text-[#F5F3F0] mb-1">
                    {template.name}
                  </p>
                  <p className="text-[10px] text-[#8A8A8A] line-clamp-2">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Identity Section */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Identity
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Track Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                  placeholder="Track title"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                  placeholder="Your name or alias"
                />
              </div>
              {isConnected && (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                    Wallet
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#8A8A8A] font-mono text-sm">
                    {address}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Creative Stack Section */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Creative Stack
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  DAWs
                </label>
                <input
                  type="text"
                  value={daws}
                  onChange={(e) => setDaws(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                  placeholder="Ableton, Logic, FL Studio..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Plugins
                </label>
                <input
                  type="text"
                  value={plugins}
                  onChange={(e) => setPlugins(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                  placeholder="Serum, Omnisphere, FabFilter..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  AI Models
                </label>
                <input
                  type="text"
                  value={aiModels}
                  onChange={(e) => setAiModels(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                  placeholder="Suno, Udio, none..."
                />
              </div>
            </div>
          </section>

          {/* Production Intelligence Section */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
                AI Contribution
              </p>
              <div className="flex gap-1.5">
                {Object.keys(AI_PRESETS).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-2 py-1 text-[10px] border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
                  >
                    {preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAiContribution({ composition: 0, arrangement: 0, production: 0, mixing: 0, mastering: 0 })}
                  className="px-2 py-1 text-[10px] border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {[
                { key: "composition", label: "COMP" },
                { key: "arrangement", label: "ARR" },
                { key: "production", label: "PROD" },
                { key: "mixing", label: "MIX" },
                { key: "mastering", label: "MSTR" },
              ].map(({ key, label }) => {
                const val = Math.round(aiContribution[key as keyof AIContribution] * 100);
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-9 text-[10px] text-[#8A8A8A] font-mono shrink-0">
                      {label}
                    </span>
                    <div className="relative flex-1 h-5">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#8A8A8A] opacity-20 pointer-events-none transition-all duration-75 rounded-full"
                        style={{ width: `${val}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) =>
                          updateAI(key as keyof AIContribution, Number(e.target.value) / 100)
                        }
                        className="o8-slider absolute inset-0 w-full h-full"
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] text-[#F5F3F0] font-mono tabular-nums shrink-0">
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Score + Avg inline */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2A2A2A]">
              <span className="text-[10px] text-[#8A8A8A] font-mono">
                AVG AI {Math.round(avgAI * 100)}%
              </span>
              <span
                className="text-[10px] font-mono"
                style={{
                  color: transparencyScore() >= 95 ? '#F5F3F0' :
                         transparencyScore() >= 70 ? '#8A8A8A' :
                         transparencyScore() >= 50 ? '#8A8A8A' : '#8A8A8A'
                }}
                title={`Transparency Score: ${transparencyScore()}/100 - Increases as you add methodology, creative stack, collaborators, and audio`}
              >
                TRANSPARENCY {transparencyScore()}/100
              </span>
            </div>

            {/* Methodology - Public description */}
            <div className="mt-4">
              <label className="block text-xs text-[#8A8A8A] mb-2">
                Methodology (Public) — Describe your creative process
              </label>
              <textarea
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none resize-none text-sm"
                placeholder="e.g., Started with Suno generation. Exported stems and rebuilt in Ableton. Added live vocals. Mixed with analog-style processing..."
              />
              <div className="mt-1 flex items-center justify-between">
                <p className="text-[10px] text-[#8A8A8A]">
                  {methodology.length}/200+ for Process Doc badge
                </p>
                <div className="flex-1 h-1 bg-[#2A2A2A] ml-3 max-w-[100px]">
                  <div
                    className="h-full bg-[#4A7C59] transition-all duration-200"
                    style={{ width: `${Math.min((methodology.length / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Prompt - Optional with visibility control */}
            <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#8A8A8A]">
                  AI Prompt (Optional) — Exact prompt used
                </label>
                <select
                  value={promptVisibility}
                  onChange={(e) => setPromptVisibility(e.target.value as "public" | "private" | "paywalled")}
                  className="px-2 py-1 text-xs bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] outline-none"
                >
                  <option value="private">Private (Keep hidden)</option>
                  <option value="public">Public (Full transparency)</option>
                  <option value="paywalled">Paid Access (Monetize prompt)</option>
                </select>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none resize-none text-sm"
                placeholder={promptVisibility === "private"
                  ? "Your exact AI prompt (will not be shown publicly)"
                  : "Your exact AI prompt (will be visible to all)"}
              />
              <p className="text-[10px] text-[#8A8A8A] mt-1">
                {promptVisibility === "private" && "Prompt will be kept private (not shown on declaration page)"}
                {promptVisibility === "public" && "🌐 Prompt will be publicly visible (+5 transparency bonus)"}
                {promptVisibility === "paywalled" && "💰 Fans must pay to view prompt (smart contract revenue split)"}
              </p>
            </div>
          </section>

          {/* Collaborators Section */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
                Collaborators
              </p>
              <button
                type="button"
                onClick={addCollaborator}
                className="px-3 py-1.5 text-xs border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
              >
                + Add Collaborator
              </button>
            </div>

            {collaborators.length === 0 ? (
              <p className="text-sm text-[#8A8A8A]">
                No collaborators? Earn Multiplayer badge
              </p>
            ) : (
              <div className="space-y-4">
                {collaborators.map((collab, i) => (
                  <div key={i} className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={collab.name}
                        onChange={(e) => updateCollaborator(i, "name", e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] text-sm outline-none"
                        placeholder="Name"
                      />
                      <select
                        value={collab.role}
                        onChange={(e) => updateCollaborator(i, "role", e.target.value)}
                        className="px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] text-sm outline-none"
                      >
                        {COLLABORATOR_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={collab.wallet}
                        onChange={(e) => updateCollaborator(i, "wallet", e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] text-sm font-mono outline-none"
                        placeholder="Wallet (optional)"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={collab.split}
                        onChange={(e) => updateCollaborator(i, "split", Number(e.target.value))}
                        className="w-20 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] text-sm font-mono outline-none text-right"
                      />
                      <span className="self-center text-sm text-[#8A8A8A]">%</span>
                      <button
                        type="button"
                        onClick={() => removeCollaborator(i)}
                        className="px-2 text-[#8B4049] hover:text-[#F5F3F0] text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {!splitsValid && (
                  <p className="text-xs text-[#8B4049]">
                    Splits must sum to 100% (currently {collaborators.reduce((s, c) => s + c.split, 0)}%)
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Lineage Section */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
                  Lineage
                </p>
                <p className="text-[10px] text-[#8A8A8A] mt-1">
                  Link to source material for remixes, samples, or derivative works
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Source / Parent Declaration ID
                </label>
                <input
                  type="text"
                  value={parentDeclarationId}
                  onChange={(e) => setParentDeclarationId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none font-mono text-sm"
                  placeholder="∞8-cm5x8k2... (optional, for derivatives)"
                />
                <p className="text-[10px] text-[#8A8A8A] mt-1">
                  Declaration ID from the gallery (e.g., ∞8-cm5x8k2...) - Used for tracking creative lineage
                </p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Relationship Type
                </label>
                <select
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] outline-none"
                >
                  {RELATIONSHIP_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Provenance Section with Drag & Drop */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
                  Provenance
                </p>
                <p className="text-[10px] text-[#8A8A8A] mt-1">
                  Upload audio file → Auto-generates IPFS CID + SHA-256 hash for immutable proof
                </p>
              </div>
            </div>

            {/* Drag & Drop Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mb-4 p-8 border-2 border-dashed text-center cursor-pointer transition-colors duration-100 ${
                isDragging
                  ? "border-[#8A8A8A] bg-[#2A2A2A]"
                  : "border-[#2A2A2A] hover:border-[#8A8A8A]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              {isUploading ? (
                <p className="text-[#8A8A8A] text-sm">Uploading to IPFS...</p>
              ) : (
                <>
                  <p className="text-[#8A8A8A] text-sm mb-1">
                    Drop audio file here
                  </p>
                  <p className="text-[#8A8A8A] text-xs">
                    Auto IPFS → Pinata → SHA-256 fingerprint
                  </p>
                </>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-[#8B7355] mb-4">{uploadError}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  IPFS CID {ipfsCID && <span className="text-[#4A7C59] ml-2">✓</span>}
                </label>
                <input
                  type="text"
                  value={ipfsCID}
                  onChange={(e) => setIpfsCID(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none font-mono text-sm"
                  placeholder="Auto-filled on upload (Qm... or bafk...)"
                  readOnly={isUploading}
                />
                <p className="text-[10px] text-[#8A8A8A] mt-1">
                  Content-addressed storage ID - Points to your actual audio file on IPFS
                </p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  SHA-256 Hash {sha256Hash && <span className="text-[#4A7C59] ml-2">✓</span>}
                </label>
                <input
                  type="text"
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none font-mono text-sm"
                  placeholder="Auto-computed on upload"
                  readOnly={isUploading}
                />
                <p className="text-[10px] text-[#8A8A8A] mt-1">
                  Cryptographic fingerprint - Proves file integrity and prevents tampering
                </p>
              </div>
            </div>
          </section>

          {/* Usage Rights Section */}
          <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Usage Rights
            </p>
            <div className="space-y-3">
              {[
                { label: "AI Training Rights", value: trainingRights, setter: setTrainingRights },
                { label: "Derivative Rights", value: derivativeRights, setter: setDerivativeRights },
                { label: "Remix Rights", value: remixRights, setter: setRemixRights },
              ].map(({ label, value, setter }) => (
                <label key={label} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-[#8A8A8A]">{label}</span>
                  <button
                    type="button"
                    onClick={() => setter(!value)}
                    className={`w-10 h-5 rounded-full transition-colors duration-100 ${
                      value ? "bg-[#5A5A5A]" : "bg-[#2A2A2A]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-[#F5F3F0] transition-transform duration-100 ${
                        value ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isPending || isConfirming || isSaving || !artistName || !splitsValid}
              className="w-full py-3 px-6 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-100"
            >
              {isPending
                ? "Confirm in wallet..."
                : isConfirming
                ? "Publishing on-chain..."
                : isSaving
                ? "Saving..."
                : isConnected && ipfsCID
                ? "Publish Declaration On-Chain"
                : "Save Declaration"}
            </button>
            {!isConnected && (
              <p className="text-xs text-center text-[#8A8A8A]">
                No wallet = database only
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Wrap in Suspense to handle useSearchParams()
export default function NewDeclaration() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#8A8A8A]">Loading...</p>
      </div>
    }>
      <NewDeclarationForm />
    </Suspense>
  );
}
