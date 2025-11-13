// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CarbonCreditToken
 * @dev ERC-1155 Multi-Token Standard for Blue Carbon Credits
 * 
 * INSTRUCTIONS FOR DEVELOPER:
 * - This is a placeholder contract for tokenized carbon credits
 * - Integrate with real carbon credit standards (VCS, Gold Standard, etc.)
 * - Add proper verification mechanisms for carbon sequestration
 * - Implement real-time carbon credit trading functionality
 * - Connect with actual carbon registries and verification bodies
 * - Add compliance with international carbon trading regulations
 * - Implement proper audit trails for carbon credit lifecycle
 */

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CarbonCreditToken is ERC1155, AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant RETIRER_ROLE = keccak256("RETIRER_ROLE");

    // Token ID counter
    Counters.Counter private _tokenIdCounter;

    // Carbon credit metadata structure
    struct CarbonCredit {
        uint256 tokenId;
        string projectId;
        string ecosystemType; // mangrove, seagrass, saltMarsh
        uint256 carbonAmount; // in kg CO2 equivalent
        uint256 vintage; // year of carbon sequestration
        string location; // geographical location
        string verificationStandard; // VCS, Gold Standard, etc.
        address issuer;
        address verifier;
        uint256 issuedAt;
        uint256 retiredAt;
        bool isRetired;
        string metadataURI; // IPFS hash for detailed metadata
    }

    // Mapping from token ID to carbon credit data
    mapping(uint256 => CarbonCredit) public carbonCredits;
    
    // Mapping from project ID to token IDs
    mapping(string => uint256[]) public projectTokens;
    
    // Mapping from ecosystem type to total credits
    mapping(string => uint256) public ecosystemTotals;
    
    // Mapping from vintage to total credits
    mapping(uint256 => uint256) public vintageTotals;

    // Events
    event CarbonCreditIssued(
        uint256 indexed tokenId,
        string indexed projectId,
        string ecosystemType,
        uint256 carbonAmount,
        uint256 vintage,
        address indexed issuer
    );
    
    event CarbonCreditTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 amount
    );
    
    event CarbonCreditRetired(
        uint256 indexed tokenId,
        address indexed retirer,
        uint256 amount,
        string retirementReason
    );
    
    event ProjectRegistered(
        string indexed projectId,
        string ecosystemType,
        address indexed owner
    );

    // Modifiers
    modifier onlyValidToken(uint256 tokenId) {
        require(carbonCredits[tokenId].tokenId != 0, "Token does not exist");
        _;
    }

    modifier onlyNotRetired(uint256 tokenId) {
        require(!carbonCredits[tokenId].isRetired, "Token is already retired");
        _;
    }

    constructor(string memory uri) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(RETIRER_ROLE, msg.sender);
    }

    /**
     * @dev Issue new carbon credits
     * @param projectId Project identifier
     * @param ecosystemType Type of ecosystem (mangrove, seagrass, saltMarsh)
     * @param carbonAmount Amount of carbon in kg CO2 equivalent
     * @param vintage Year of carbon sequestration
     * @param location Geographical location
     * @param verificationStandard Verification standard used
     * @param verifier Address of the verifier
     * @param metadataURI IPFS hash for detailed metadata
     * @param recipient Address to receive the credits
     * @param amount Number of credits to issue
     */
    function issueCarbonCredits(
        string memory projectId,
        string memory ecosystemType,
        uint256 carbonAmount,
        uint256 vintage,
        string memory location,
        string memory verificationStandard,
        address verifier,
        string memory metadataURI,
        address recipient,
        uint256 amount
    ) external onlyRole(ISSUER_ROLE) whenNotPaused nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        require(hasRole(VERIFIER_ROLE, verifier), "Invalid verifier");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        // Create carbon credit metadata
        carbonCredits[tokenId] = CarbonCredit({
            tokenId: tokenId,
            projectId: projectId,
            ecosystemType: ecosystemType,
            carbonAmount: carbonAmount,
            vintage: vintage,
            location: location,
            verificationStandard: verificationStandard,
            issuer: msg.sender,
            verifier: verifier,
            issuedAt: block.timestamp,
            retiredAt: 0,
            isRetired: false,
            metadataURI: metadataURI
        });

        // Update mappings
        projectTokens[projectId].push(tokenId);
        ecosystemTotals[ecosystemType] += amount;
        vintageTotals[vintage] += amount;

        // Mint tokens
        _mint(recipient, tokenId, amount, "");

        emit CarbonCreditIssued(
            tokenId,
            projectId,
            ecosystemType,
            carbonAmount,
            vintage,
            msg.sender
        );

        return tokenId;
    }

    /**
     * @dev Transfer carbon credits
     * @param to Recipient address
     * @param tokenId Token ID to transfer
     * @param amount Amount to transfer
     */
    function transferCarbonCredits(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyValidToken(tokenId) onlyNotRetired(tokenId) {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");

        _safeTransferFrom(msg.sender, to, tokenId, amount, "");

        emit CarbonCreditTransferred(tokenId, msg.sender, to, amount);
    }

    /**
     * @dev Retire carbon credits (permanent removal from circulation)
     * @param tokenId Token ID to retire
     * @param amount Amount to retire
     * @param retirementReason Reason for retirement
     */
    function retireCarbonCredits(
        uint256 tokenId,
        uint256 amount,
        string memory retirementReason
    ) external onlyRole(RETIRER_ROLE) onlyValidToken(tokenId) onlyNotRetired(tokenId) {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");

        // Mark tokens as retired
        carbonCredits[tokenId].isRetired = true;
        carbonCredits[tokenId].retiredAt = block.timestamp;

        // Burn tokens
        _burn(msg.sender, tokenId, amount);

        emit CarbonCreditRetired(tokenId, msg.sender, amount, retirementReason);
    }

    /**
     * @dev Get carbon credit details
     * @param tokenId Token ID
     * @return Carbon credit metadata
     */
    function getCarbonCredit(uint256 tokenId) 
        external 
        view 
        onlyValidToken(tokenId) 
        returns (CarbonCredit memory) 
    {
        return carbonCredits[tokenId];
    }

    /**
     * @dev Get all tokens for a project
     * @param projectId Project identifier
     * @return Array of token IDs
     */
    function getProjectTokens(string memory projectId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return projectTokens[projectId];
    }

    /**
     * @dev Get total credits by ecosystem type
     * @param ecosystemType Ecosystem type
     * @return Total credits issued
     */
    function getEcosystemTotal(string memory ecosystemType) 
        external 
        view 
        returns (uint256) 
    {
        return ecosystemTotals[ecosystemType];
    }

    /**
     * @dev Get total credits by vintage
     * @param vintage Year
     * @return Total credits issued
     */
    function getVintageTotal(uint256 vintage) 
        external 
        view 
        returns (uint256) 
    {
        return vintageTotals[vintage];
    }

    /**
     * @dev Get total supply of a token
     * @param tokenId Token ID
     * @return Total supply
     */
    function getTotalSupply(uint256 tokenId) 
        external 
        view 
        onlyValidToken(tokenId) 
        returns (uint256) 
    {
        return totalSupply(tokenId);
    }

    /**
     * @dev Check if token is retired
     * @param tokenId Token ID
     * @return True if retired
     */
    function isTokenRetired(uint256 tokenId) 
        external 
        view 
        onlyValidToken(tokenId) 
        returns (bool) 
    {
        return carbonCredits[tokenId].isRetired;
    }

    /**
     * @dev Get token URI for metadata
     * @param tokenId Token ID
     * @return Metadata URI
     */
    function uri(uint256 tokenId) 
        public 
        view 
        override 
        onlyValidToken(tokenId) 
        returns (string memory) 
    {
        return carbonCredits[tokenId].metadataURI;
    }

    /**
     * @dev Pause contract (emergency function)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant role to address
     * @param role Role to grant
     * @param account Address to grant role to
     */
    function grantRole(bytes32 role, address account) 
        public 
        override 
        onlyRole(getRoleAdmin(role)) 
    {
        _grantRole(role, account);
    }

    /**
     * @dev Revoke role from address
     * @param role Role to revoke
     * @param account Address to revoke role from
     */
    function revokeRole(bytes32 role, address account) 
        public 
        override 
        onlyRole(getRoleAdmin(role)) 
    {
        _revokeRole(role, account);
    }

    /**
     * @dev Check if address has role
     * @param role Role to check
     * @param account Address to check
     * @return True if address has role
     */
    function hasRole(bytes32 role, address account) 
        public 
        view 
        override 
        returns (bool) 
    {
        return super.hasRole(role, account);
    }

    /**
     * @dev Get role admin
     * @param role Role to get admin for
     * @return Admin role
     */
    function getRoleAdmin(bytes32 role) 
        public 
        view 
        override 
        returns (bytes32) 
    {
        return super.getRoleAdmin(role);
    }

    /**
     * @dev Supports interface check
     * @param interfaceId Interface ID to check
     * @return True if interface is supported
     */
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC1155, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
