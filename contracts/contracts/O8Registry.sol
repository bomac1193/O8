// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Ø8Registry
 * @notice ERC-721 NFT registry for human-verified music tracks with AI transparency scoring
 * @dev Fuses CTAD metadata layer with SOVN consent module
 *
 * Ø8 — Prove you're human. Earn more. Control AI usage of your music.
 */
contract O8Registry is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {

    // ═══════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════

    event VerifiedHuman(
        uint256 indexed tokenId,
        address indexed creator,
        string ipfsCID,
        uint8 transparencyScore
    );

    event ConsentUpdated(
        uint256 indexed tokenId,
        bool trainingRights,
        bool derivativeRights,
        bool remixRights
    );

    event SplitsLocked(uint256 indexed tokenId);
    event ConsentLocked(uint256 indexed tokenId);

    // ═══════════════════════════════════════════════════════════════════
    // STRUCTS
    // ═══════════════════════════════════════════════════════════════════

    /// @notice AI contribution percentages (0-100 each)
    struct AIContributions {
        uint8 melody;
        uint8 lyrics;
        uint8 stems;
        uint8 mastering;
    }

    /// @notice Contributor split in basis points (100 = 1%)
    struct ContributorSplit {
        address contributor;
        uint16 basisPoints; // 10000 = 100%
        string role;        // "producer", "vocalist", "songwriter", etc.
    }

    /// @notice SOVN consent toggles
    struct Consent {
        bool trainingRights;    // Allow AI training on this work
        bool derivativeRights;  // Allow AI-generated derivatives
        bool remixRights;       // Allow remixes and covers
        bool locked;            // Once locked, consent cannot change
    }

    /// @notice Full track metadata (CTAD + SOVN unified)
    struct TrackMetadata {
        string title;
        string artistName;
        AIContributions ai;
        uint8 transparencyScore;
        string ipfsCID;
        bytes32 sha256Hash;
        uint256 createdAt;
        Consent consent;
        bool splitsLocked;
    }

    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════

    uint256 private _tokenIdCounter;

    mapping(uint256 => TrackMetadata) public tracks;
    mapping(uint256 => ContributorSplit[]) public contributorSplits;
    mapping(address => uint256[]) public creatorTracks;
    mapping(bytes32 => bool) public hashExists;

    // ═══════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════

    constructor() ERC721("O8 Verified Track", "O8") Ownable(msg.sender) {}

    // ═══════════════════════════════════════════════════════════════════
    // CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Mint a verified track NFT with full metadata
     * @param _title Track title
     * @param _artistName Artist/band name
     * @param _aiMelody AI contribution to melody (0-100)
     * @param _aiLyrics AI contribution to lyrics (0-100)
     * @param _aiStems AI contribution to stems/arrangement (0-100)
     * @param _aiMastering AI contribution to mastering (0-100)
     * @param _ipfsCID IPFS content identifier
     * @param _sha256Hash SHA-256 hash of the audio file
     * @param _trainingRights Allow AI training
     * @param _derivativeRights Allow AI derivatives
     * @param _remixRights Allow remixes
     * @param _tokenURI Metadata URI
     */
    function mintTrack(
        string calldata _title,
        string calldata _artistName,
        uint8 _aiMelody,
        uint8 _aiLyrics,
        uint8 _aiStems,
        uint8 _aiMastering,
        string calldata _ipfsCID,
        bytes32 _sha256Hash,
        bool _trainingRights,
        bool _derivativeRights,
        bool _remixRights,
        string calldata _tokenURI
    ) external nonReentrant returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_ipfsCID).length > 0, "IPFS CID required");
        require(!hashExists[_sha256Hash], "Track already registered");
        require(_aiMelody <= 100 && _aiLyrics <= 100, "AI % must be 0-100");
        require(_aiStems <= 100 && _aiMastering <= 100, "AI % must be 0-100");

        uint256 tokenId = _tokenIdCounter++;

        // Calculate transparency score
        uint8 transparencyScore = calculateTransparencyScore(
            _aiMelody, _aiLyrics, _aiStems, _aiMastering
        );

        // Store metadata
        tracks[tokenId] = TrackMetadata({
            title: _title,
            artistName: _artistName,
            ai: AIContributions({
                melody: _aiMelody,
                lyrics: _aiLyrics,
                stems: _aiStems,
                mastering: _aiMastering
            }),
            transparencyScore: transparencyScore,
            ipfsCID: _ipfsCID,
            sha256Hash: _sha256Hash,
            createdAt: block.timestamp,
            consent: Consent({
                trainingRights: _trainingRights,
                derivativeRights: _derivativeRights,
                remixRights: _remixRights,
                locked: false
            }),
            splitsLocked: false
        });

        hashExists[_sha256Hash] = true;
        creatorTracks[msg.sender].push(tokenId);

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        emit VerifiedHuman(tokenId, msg.sender, _ipfsCID, transparencyScore);
        emit ConsentUpdated(tokenId, _trainingRights, _derivativeRights, _remixRights);

        return tokenId;
    }

    /**
     * @notice Add contributor splits to a track
     * @dev Total basis points must equal 10000 (100%)
     */
    function setContributorSplits(
        uint256 _tokenId,
        address[] calldata _contributors,
        uint16[] calldata _basisPoints,
        string[] calldata _roles
    ) external {
        require(ownerOf(_tokenId) == msg.sender, "Not track owner");
        require(!tracks[_tokenId].splitsLocked, "Splits are locked");
        require(_contributors.length == _basisPoints.length, "Array mismatch");
        require(_contributors.length == _roles.length, "Array mismatch");

        // Clear existing splits
        delete contributorSplits[_tokenId];

        uint16 totalBps = 0;
        for (uint256 i = 0; i < _contributors.length; i++) {
            require(_contributors[i] != address(0), "Invalid contributor");
            totalBps += _basisPoints[i];

            contributorSplits[_tokenId].push(ContributorSplit({
                contributor: _contributors[i],
                basisPoints: _basisPoints[i],
                role: _roles[i]
            }));
        }

        require(totalBps == 10000, "Splits must total 100%");
    }

    /**
     * @notice Lock contributor splits permanently
     */
    function lockSplits(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not track owner");
        require(!tracks[_tokenId].splitsLocked, "Already locked");
        tracks[_tokenId].splitsLocked = true;
        emit SplitsLocked(_tokenId);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SOVN CONSENT MODULE
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Update consent toggles (before locking)
     */
    function updateConsent(
        uint256 _tokenId,
        bool _trainingRights,
        bool _derivativeRights,
        bool _remixRights
    ) external {
        require(ownerOf(_tokenId) == msg.sender, "Not track owner");
        require(!tracks[_tokenId].consent.locked, "Consent is locked");

        tracks[_tokenId].consent.trainingRights = _trainingRights;
        tracks[_tokenId].consent.derivativeRights = _derivativeRights;
        tracks[_tokenId].consent.remixRights = _remixRights;

        emit ConsentUpdated(_tokenId, _trainingRights, _derivativeRights, _remixRights);
    }

    /**
     * @notice Lock consent permanently
     */
    function lockConsent(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not track owner");
        require(!tracks[_tokenId].consent.locked, "Already locked");
        tracks[_tokenId].consent.locked = true;
        emit ConsentLocked(_tokenId);
    }

    /**
     * @notice Check if a specific permission is granted
     */
    function hasPermission(uint256 _tokenId, string calldata _permissionType)
        external view returns (bool)
    {
        require(_tokenId < _tokenIdCounter, "Track does not exist");

        bytes32 permHash = keccak256(bytes(_permissionType));
        Consent memory c = tracks[_tokenId].consent;

        if (permHash == keccak256("training")) return c.trainingRights;
        if (permHash == keccak256("derivative")) return c.derivativeRights;
        if (permHash == keccak256("remix")) return c.remixRights;

        return false;
    }

    // ═══════════════════════════════════════════════════════════════════
    // SCORING (Embedded Ø8Score logic)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Calculate transparency score (0-100)
     * @dev Higher score = more human contribution + full disclosure
     *
     * Formula:
     * - Base: 100 - (average AI contribution)
     * - Bonus: +10 if all AI fields are disclosed (non-zero where applicable)
     * - Minimum: 0, Maximum: 100
     */
    function calculateTransparencyScore(
        uint8 _aiMelody,
        uint8 _aiLyrics,
        uint8 _aiStems,
        uint8 _aiMastering
    ) public pure returns (uint8) {
        uint16 avgAI = (uint16(_aiMelody) + _aiLyrics + _aiStems + _aiMastering) / 4;
        uint16 score = 100 - avgAI;

        // Transparency bonus for honest disclosure
        // If all AI percentages are provided (even if high), +10 bonus
        if (_aiMelody > 0 || _aiLyrics > 0 || _aiStems > 0 || _aiMastering > 0) {
            // They disclosed some AI usage, good faith bonus
            score += 5;
        }

        if (score > 100) score = 100;

        return uint8(score);
    }

    /**
     * @notice Check if track qualifies as "Human-Crafted" badge
     * @dev Requires < 20% AI across all categories and transparency >= 80
     */
    function isHumanCrafted(uint256 _tokenId) external view returns (bool) {
        require(_tokenId < _tokenIdCounter, "Track does not exist");

        TrackMetadata memory t = tracks[_tokenId];

        return (
            t.ai.melody < 20 &&
            t.ai.lyrics < 20 &&
            t.ai.stems < 20 &&
            t.ai.mastering < 20 &&
            t.transparencyScore >= 80
        );
    }

    /**
     * @notice Get full track metadata
     */
    function getTrackMetadata(uint256 _tokenId)
        external view returns (TrackMetadata memory)
    {
        require(_tokenId < _tokenIdCounter, "Track does not exist");
        return tracks[_tokenId];
    }

    /**
     * @notice Get contributor splits for a track
     */
    function getContributorSplits(uint256 _tokenId)
        external view returns (ContributorSplit[] memory)
    {
        return contributorSplits[_tokenId];
    }

    /**
     * @notice Get all tracks by creator
     */
    function getCreatorTracks(address _creator)
        external view returns (uint256[] memory)
    {
        return creatorTracks[_creator];
    }

    /**
     * @notice Get total minted tracks
     */
    function totalTracks() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ═══════════════════════════════════════════════════════════════════
    // OVERRIDES
    // ═══════════════════════════════════════════════════════════════════

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
