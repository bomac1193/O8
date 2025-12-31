// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Ø8Token
 * @notice ERC-20 rewards token for the Ø8 protocol
 * @dev Rewards artists for complete human/consent verified tracks
 *
 * Tokenomics (MVP Mock):
 * - Total Supply: 1,000,000 Ø8
 * - Artist Rewards Pool: 600,000 Ø8 (60%)
 * - Protocol Treasury: 300,000 Ø8 (30%)
 * - Early Adopter Bonus: 100,000 Ø8 (10%)
 */
contract O8Token is ERC20, ERC20Burnable, Ownable {

    // ═══════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════

    event ArtistRewarded(
        address indexed artist,
        uint256 amount,
        uint256 indexed tokenId,
        string reason
    );

    event RewardsDistributorUpdated(address indexed oldDistributor, address indexed newDistributor);

    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════

    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    uint256 public constant REWARDS_POOL = 600_000 * 10**18;
    uint256 public constant TREASURY = 300_000 * 10**18;
    uint256 public constant EARLY_ADOPTER_POOL = 100_000 * 10**18;

    address public rewardsDistributor;
    uint256 public totalRewardsDistributed;
    uint256 public totalEarlyAdopterClaimed;

    mapping(address => uint256) public artistRewards;
    mapping(uint256 => bool) public trackRewarded;

    // Reward amounts (in tokens, not wei)
    uint256 public constant HUMAN_CRAFTED_REWARD = 100 * 10**18;      // 100 Ø8
    uint256 public constant TRANSPARENT_REWARD = 50 * 10**18;         // 50 Ø8
    uint256 public constant CONSENT_LOCKED_REWARD = 25 * 10**18;      // 25 Ø8
    uint256 public constant EARLY_ADOPTER_BONUS = 50 * 10**18;        // 50 Ø8

    // ═══════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════

    constructor() ERC20("O8 Token", "O8") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        rewardsDistributor = msg.sender;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Set the rewards distributor (typically the Ø8Registry contract)
     */
    function setRewardsDistributor(address _distributor) external onlyOwner {
        require(_distributor != address(0), "Invalid distributor");
        address old = rewardsDistributor;
        rewardsDistributor = _distributor;
        emit RewardsDistributorUpdated(old, _distributor);
    }

    // ═══════════════════════════════════════════════════════════════════
    // REWARD FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Reward an artist for a human-crafted track
     * @param _artist Artist address
     * @param _tokenId Track token ID
     */
    function rewardHumanCrafted(address _artist, uint256 _tokenId) external {
        require(msg.sender == rewardsDistributor || msg.sender == owner(), "Not authorized");
        require(!trackRewarded[_tokenId], "Track already rewarded");
        require(balanceOf(owner()) >= HUMAN_CRAFTED_REWARD, "Insufficient rewards pool");

        trackRewarded[_tokenId] = true;
        artistRewards[_artist] += HUMAN_CRAFTED_REWARD;
        totalRewardsDistributed += HUMAN_CRAFTED_REWARD;

        _transfer(owner(), _artist, HUMAN_CRAFTED_REWARD);

        emit ArtistRewarded(_artist, HUMAN_CRAFTED_REWARD, _tokenId, "Human-Crafted Badge");
    }

    /**
     * @notice Reward an artist for transparent AI disclosure
     * @param _artist Artist address
     * @param _tokenId Track token ID
     */
    function rewardTransparent(address _artist, uint256 _tokenId) external {
        require(msg.sender == rewardsDistributor || msg.sender == owner(), "Not authorized");
        require(!trackRewarded[_tokenId], "Track already rewarded");
        require(balanceOf(owner()) >= TRANSPARENT_REWARD, "Insufficient rewards pool");

        trackRewarded[_tokenId] = true;
        artistRewards[_artist] += TRANSPARENT_REWARD;
        totalRewardsDistributed += TRANSPARENT_REWARD;

        _transfer(owner(), _artist, TRANSPARENT_REWARD);

        emit ArtistRewarded(_artist, TRANSPARENT_REWARD, _tokenId, "Transparent Disclosure");
    }

    /**
     * @notice Reward for locking consent (full commitment)
     * @param _artist Artist address
     * @param _tokenId Track token ID
     */
    function rewardConsentLocked(address _artist, uint256 _tokenId) external {
        require(msg.sender == rewardsDistributor || msg.sender == owner(), "Not authorized");
        require(balanceOf(owner()) >= CONSENT_LOCKED_REWARD, "Insufficient rewards pool");

        artistRewards[_artist] += CONSENT_LOCKED_REWARD;
        totalRewardsDistributed += CONSENT_LOCKED_REWARD;

        _transfer(owner(), _artist, CONSENT_LOCKED_REWARD);

        emit ArtistRewarded(_artist, CONSENT_LOCKED_REWARD, _tokenId, "Consent Locked");
    }

    /**
     * @notice Early adopter bonus (first 1000 mints)
     * @param _artist Artist address
     * @param _tokenId Track token ID
     */
    function rewardEarlyAdopter(address _artist, uint256 _tokenId) external {
        require(msg.sender == rewardsDistributor || msg.sender == owner(), "Not authorized");
        require(totalEarlyAdopterClaimed < EARLY_ADOPTER_POOL, "Early adopter pool exhausted");
        require(balanceOf(owner()) >= EARLY_ADOPTER_BONUS, "Insufficient balance");

        totalEarlyAdopterClaimed += EARLY_ADOPTER_BONUS;
        artistRewards[_artist] += EARLY_ADOPTER_BONUS;

        _transfer(owner(), _artist, EARLY_ADOPTER_BONUS);

        emit ArtistRewarded(_artist, EARLY_ADOPTER_BONUS, _tokenId, "Early Adopter Bonus");
    }

    /**
     * @notice Batch reward multiple artists
     * @param _artists Array of artist addresses
     * @param _amounts Array of reward amounts
     * @param _tokenIds Array of track token IDs
     */
    function batchReward(
        address[] calldata _artists,
        uint256[] calldata _amounts,
        uint256[] calldata _tokenIds
    ) external {
        require(msg.sender == rewardsDistributor || msg.sender == owner(), "Not authorized");
        require(_artists.length == _amounts.length, "Array mismatch");
        require(_artists.length == _tokenIds.length, "Array mismatch");

        for (uint256 i = 0; i < _artists.length; i++) {
            if (_amounts[i] > 0 && balanceOf(owner()) >= _amounts[i]) {
                artistRewards[_artists[i]] += _amounts[i];
                totalRewardsDistributed += _amounts[i];
                _transfer(owner(), _artists[i], _amounts[i]);
                emit ArtistRewarded(_artists[i], _amounts[i], _tokenIds[i], "Batch Reward");
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Get remaining rewards pool
     */
    function remainingRewardsPool() external view returns (uint256) {
        uint256 ownerBalance = balanceOf(owner());
        if (ownerBalance < TREASURY) return 0;
        return ownerBalance - TREASURY;
    }

    /**
     * @notice Get total rewards earned by an artist
     */
    function getArtistRewards(address _artist) external view returns (uint256) {
        return artistRewards[_artist];
    }
}
