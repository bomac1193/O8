// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./O8Registry.sol";

/**
 * @title Ø8Score
 * @notice External verification and badge computation for Ø8 tracks
 * @dev Reads from O8Registry and computes various badges and scores
 *
 * Badge Tiers:
 * - HUMAN_CRAFTED: < 20% AI across all categories, transparency >= 80
 * - AI_DISCLOSED: Any AI usage honestly disclosed, transparency >= 60
 * - FULL_CONSENT: All consent toggles enabled and locked
 * - SOVEREIGN: No AI training allowed, consent locked
 */
contract O8Score {

    // ═══════════════════════════════════════════════════════════════════
    // ENUMS & STRUCTS
    // ═══════════════════════════════════════════════════════════════════

    enum BadgeType {
        NONE,
        HUMAN_CRAFTED,      // Pure human creation
        AI_DISCLOSED,       // Honest AI usage disclosure
        FULL_CONSENT,       // All permissions granted
        SOVEREIGN,          // No AI training, full control
        TRANSPARENT         // High transparency score
    }

    struct TrackScore {
        uint256 tokenId;
        uint8 transparencyScore;
        uint8 humanScore;          // Inverse of AI contribution
        uint8 consentScore;        // Based on consent clarity
        BadgeType primaryBadge;
        bool isHumanCrafted;
        bool isAIDisclosed;
        bool isFullConsent;
        bool isSovereign;
    }

    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════

    O8Registry public immutable registry;

    // ═══════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════

    constructor(address _registry) {
        require(_registry != address(0), "Invalid registry");
        registry = O8Registry(_registry);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SCORING FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Get comprehensive score for a track
     */
    function getTrackScore(uint256 _tokenId) external view returns (TrackScore memory) {
        O8Registry.TrackMetadata memory meta = registry.getTrackMetadata(_tokenId);

        uint8 humanScore = calculateHumanScore(meta.ai);
        uint8 consentScore = calculateConsentScore(meta.consent);

        bool isHuman = checkHumanCrafted(meta);
        bool isAI = checkAIDisclosed(meta);
        bool isFull = checkFullConsent(meta);
        bool isSov = checkSovereign(meta);

        BadgeType primary = determinePrimaryBadge(isHuman, isAI, isFull, isSov, meta.transparencyScore);

        return TrackScore({
            tokenId: _tokenId,
            transparencyScore: meta.transparencyScore,
            humanScore: humanScore,
            consentScore: consentScore,
            primaryBadge: primary,
            isHumanCrafted: isHuman,
            isAIDisclosed: isAI,
            isFullConsent: isFull,
            isSovereign: isSov
        });
    }

    /**
     * @notice Calculate human contribution score (100 - avg AI)
     */
    function calculateHumanScore(O8Registry.AIContributions memory _ai)
        public pure returns (uint8)
    {
        uint16 avgAI = (uint16(_ai.melody) + _ai.lyrics + _ai.stems + _ai.mastering) / 4;
        return uint8(100 - avgAI);
    }

    /**
     * @notice Calculate consent clarity score
     * @dev Higher score = clearer consent stance (either fully open or fully restricted)
     */
    function calculateConsentScore(O8Registry.Consent memory _consent)
        public pure returns (uint8)
    {
        uint8 score = 50; // Base score

        // Bonus for locked consent (commitment)
        if (_consent.locked) score += 30;

        // Bonus for clear stance (all true or all false)
        bool allTrue = _consent.trainingRights && _consent.derivativeRights && _consent.remixRights;
        bool allFalse = !_consent.trainingRights && !_consent.derivativeRights && !_consent.remixRights;

        if (allTrue || allFalse) score += 20;

        return score > 100 ? 100 : score;
    }

    /**
     * @notice Check if track qualifies as Human-Crafted
     */
    function checkHumanCrafted(O8Registry.TrackMetadata memory _meta)
        public pure returns (bool)
    {
        return (
            _meta.ai.melody < 20 &&
            _meta.ai.lyrics < 20 &&
            _meta.ai.stems < 20 &&
            _meta.ai.mastering < 20 &&
            _meta.transparencyScore >= 80
        );
    }

    /**
     * @notice Check if track has honest AI disclosure
     */
    function checkAIDisclosed(O8Registry.TrackMetadata memory _meta)
        public pure returns (bool)
    {
        // Any AI usage with transparency score >= 60
        bool hasAI = _meta.ai.melody > 0 ||
                     _meta.ai.lyrics > 0 ||
                     _meta.ai.stems > 0 ||
                     _meta.ai.mastering > 0;

        return hasAI && _meta.transparencyScore >= 60;
    }

    /**
     * @notice Check if track has full consent enabled
     */
    function checkFullConsent(O8Registry.TrackMetadata memory _meta)
        public pure returns (bool)
    {
        return (
            _meta.consent.trainingRights &&
            _meta.consent.derivativeRights &&
            _meta.consent.remixRights &&
            _meta.consent.locked
        );
    }

    /**
     * @notice Check if track is sovereign (no AI training, full control)
     */
    function checkSovereign(O8Registry.TrackMetadata memory _meta)
        public pure returns (bool)
    {
        return (
            !_meta.consent.trainingRights &&
            _meta.consent.locked
        );
    }

    /**
     * @notice Determine the primary badge for display
     */
    function determinePrimaryBadge(
        bool _isHuman,
        bool _isAI,
        bool _isFull,
        bool _isSov,
        uint8 _transparency
    ) public pure returns (BadgeType) {
        // Priority order: Human > Sovereign > Full Consent > AI Disclosed > Transparent > None
        if (_isHuman) return BadgeType.HUMAN_CRAFTED;
        if (_isSov) return BadgeType.SOVEREIGN;
        if (_isFull) return BadgeType.FULL_CONSENT;
        if (_isAI) return BadgeType.AI_DISCLOSED;
        if (_transparency >= 70) return BadgeType.TRANSPARENT;
        return BadgeType.NONE;
    }

    // ═══════════════════════════════════════════════════════════════════
    // BATCH FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Get scores for multiple tracks
     */
    function batchGetScores(uint256[] calldata _tokenIds)
        external view returns (TrackScore[] memory)
    {
        TrackScore[] memory scores = new TrackScore[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            scores[i] = this.getTrackScore(_tokenIds[i]);
        }

        return scores;
    }

    /**
     * @notice Filter tracks by badge type
     * @dev Returns token IDs that have the specified badge
     */
    function filterByBadge(uint256[] calldata _tokenIds, BadgeType _badge)
        external view returns (uint256[] memory)
    {
        uint256[] memory temp = new uint256[](_tokenIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            TrackScore memory score = this.getTrackScore(_tokenIds[i]);
            if (score.primaryBadge == _badge) {
                temp[count] = _tokenIds[i];
                count++;
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /**
     * @notice Get high transparency tracks (>= threshold)
     */
    function getHighTransparencyTracks(uint256[] calldata _tokenIds, uint8 _threshold)
        external view returns (uint256[] memory)
    {
        uint256[] memory temp = new uint256[](_tokenIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            O8Registry.TrackMetadata memory meta = registry.getTrackMetadata(_tokenIds[i]);
            if (meta.transparencyScore >= _threshold) {
                temp[count] = _tokenIds[i];
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }
}
