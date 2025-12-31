// Ø8 Protocol Contract ABIs
// Generated from Hardhat artifacts

export const O8RegistryABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "ipfsCID", type: "string" },
      { indexed: false, internalType: "uint8", name: "transparencyScore", type: "uint8" },
    ],
    name: "VerifiedHuman",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "bool", name: "trainingRights", type: "bool" },
      { indexed: false, internalType: "bool", name: "derivativeRights", type: "bool" },
      { indexed: false, internalType: "bool", name: "remixRights", type: "bool" },
    ],
    name: "ConsentUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "SplitsLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ConsentLocked",
    type: "event",
  },
  // Core functions
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_artistName", type: "string" },
      { internalType: "uint8", name: "_aiMelody", type: "uint8" },
      { internalType: "uint8", name: "_aiLyrics", type: "uint8" },
      { internalType: "uint8", name: "_aiStems", type: "uint8" },
      { internalType: "uint8", name: "_aiMastering", type: "uint8" },
      { internalType: "string", name: "_ipfsCID", type: "string" },
      { internalType: "bytes32", name: "_sha256Hash", type: "bytes32" },
      { internalType: "bool", name: "_trainingRights", type: "bool" },
      { internalType: "bool", name: "_derivativeRights", type: "bool" },
      { internalType: "bool", name: "_remixRights", type: "bool" },
      { internalType: "string", name: "_tokenURI", type: "string" },
    ],
    name: "mintTrack",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "getTrackMetadata",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "artistName", type: "string" },
          {
            components: [
              { internalType: "uint8", name: "melody", type: "uint8" },
              { internalType: "uint8", name: "lyrics", type: "uint8" },
              { internalType: "uint8", name: "stems", type: "uint8" },
              { internalType: "uint8", name: "mastering", type: "uint8" },
            ],
            internalType: "struct O8Registry.AIContributions",
            name: "ai",
            type: "tuple",
          },
          { internalType: "uint8", name: "transparencyScore", type: "uint8" },
          { internalType: "string", name: "ipfsCID", type: "string" },
          { internalType: "bytes32", name: "sha256Hash", type: "bytes32" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          {
            components: [
              { internalType: "bool", name: "trainingRights", type: "bool" },
              { internalType: "bool", name: "derivativeRights", type: "bool" },
              { internalType: "bool", name: "remixRights", type: "bool" },
              { internalType: "bool", name: "locked", type: "bool" },
            ],
            internalType: "struct O8Registry.Consent",
            name: "consent",
            type: "tuple",
          },
          { internalType: "bool", name: "splitsLocked", type: "bool" },
        ],
        internalType: "struct O8Registry.TrackMetadata",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "isHumanCrafted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "bool", name: "_trainingRights", type: "bool" },
      { internalType: "bool", name: "_derivativeRights", type: "bool" },
      { internalType: "bool", name: "_remixRights", type: "bool" },
    ],
    name: "updateConsent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "lockConsent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "string", name: "_permissionType", type: "string" },
    ],
    name: "hasPermission",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "getCreatorTracks",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTracks",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint8", name: "_aiMelody", type: "uint8" },
      { internalType: "uint8", name: "_aiLyrics", type: "uint8" },
      { internalType: "uint8", name: "_aiStems", type: "uint8" },
      { internalType: "uint8", name: "_aiMastering", type: "uint8" },
    ],
    name: "calculateTransparencyScore",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function",
  },
] as const;

export const O8TokenABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "artist", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" },
    ],
    name: "ArtistRewarded",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_artist", type: "address" }],
    name: "getArtistRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRewardsDistributed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
