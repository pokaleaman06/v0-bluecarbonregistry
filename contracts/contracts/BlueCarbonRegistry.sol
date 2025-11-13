// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title BlueCarbonRegistry
 * @dev Smart contract for managing blue carbon restoration projects and carbon credits
 * @notice This contract handles project registration, field data verification, and carbon credit tokenization
 */
contract BlueCarbonRegistry is ERC721, ERC721URIStorage, AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PROJECT_OWNER_ROLE = keccak256("PROJECT_OWNER_ROLE");
    bytes32 public constant FIELD_COLLECTOR_ROLE = keccak256("FIELD_COLLECTOR_ROLE");

    // Counters for unique IDs
    Counters.Counter private _projectIds;
    Counters.Counter private _fieldDataIds;
    Counters.Counter private _creditIds;

    // Structs
    struct Project {
        uint256 id;
        string name;
        string description;
        string location;
        address owner;
        uint256 totalArea; // in square meters
        uint256 verifiedArea; // in square meters
        uint256 totalCredits;
        ProjectStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        string metadataURI; // IPFS hash for project metadata
    }

    struct FieldData {
        uint256 id;
        uint256 projectId;
        address collector;
        string coordinates; // JSON string of polygon coordinates
        string photoHash; // IPFS hash of photos
        uint256 carbonEstimate; // in kg CO2
        FieldDataStatus status;
        uint256 submittedAt;
        uint256 verifiedAt;
        address verifier;
        string verificationNotes;
    }

    struct CarbonCredit {
        uint256 id;
        uint256 projectId;
        uint256 fieldDataId;
        uint256 amount; // in kg CO2
        CreditStatus status;
        address owner;
        uint256 issuedAt;
        uint256 retiredAt;
        string blockchainTxHash;
    }

    // Enums
    enum ProjectStatus { ACTIVE, COMPLETED, SUSPENDED }
    enum FieldDataStatus { PENDING, VERIFIED, REJECTED }
    enum CreditStatus { PENDING, ISSUED, TRADED, RETIRED }

    // Mappings
    mapping(uint256 => Project) public projects;
    mapping(uint256 => FieldData) public fieldData;
    mapping(uint256 => CarbonCredit) public carbonCredits;
    mapping(address => uint256[]) public userProjects;
    mapping(uint256 => uint256[]) public projectFieldData;
    mapping(uint256 => uint256[]) public projectCredits;

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed owner, string name);
    event FieldDataSubmitted(uint256 indexed fieldDataId, uint256 indexed projectId, address indexed collector);
    event FieldDataVerified(uint256 indexed fieldDataId, address indexed verifier, bool approved);
    event CarbonCreditsIssued(uint256 indexed creditId, uint256 indexed projectId, uint256 amount);
    event CarbonCreditsTransferred(uint256 indexed creditId, address indexed from, address indexed to);
    event CarbonCreditsRetired(uint256 indexed creditId, address indexed owner, uint256 amount);

    constructor() ERC721("BlueCarbonCredits", "BCC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new blue carbon restoration project
     * @param name Project name
     * @param description Project description
     * @param location Project location
     * @param totalArea Total project area in square meters
     * @param metadataURI IPFS hash for project metadata
     */
    function createProject(
        string memory name,
        string memory description,
        string memory location,
        uint256 totalArea,
        string memory metadataURI
    ) external onlyRole(PROJECT_OWNER_ROLE) returns (uint256) {
        _projectIds.increment();
        uint256 projectId = _projectIds.current();

        projects[projectId] = Project({
            id: projectId,
            name: name,
            description: description,
            location: location,
            owner: msg.sender,
            totalArea: totalArea,
            verifiedArea: 0,
            totalCredits: 0,
            status: ProjectStatus.ACTIVE,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            metadataURI: metadataURI
        });

        userProjects[msg.sender].push(projectId);

        emit ProjectCreated(projectId, msg.sender, name);
        return projectId;
    }

    /**
     * @dev Submit field data for verification
     * @param projectId Project ID
     * @param coordinates JSON string of polygon coordinates
     * @param photoHash IPFS hash of photos
     * @param carbonEstimate Estimated carbon sequestration in kg CO2
     */
    function submitFieldData(
        uint256 projectId,
        string memory coordinates,
        string memory photoHash,
        uint256 carbonEstimate
    ) external onlyRole(FIELD_COLLECTOR_ROLE) returns (uint256) {
        require(projects[projectId].status == ProjectStatus.ACTIVE, "Project not active");
        require(projects[projectId].owner == msg.sender || hasRole(PROJECT_OWNER_ROLE, msg.sender), "Not authorized");

        _fieldDataIds.increment();
        uint256 fieldDataId = _fieldDataIds.current();

        fieldData[fieldDataId] = FieldData({
            id: fieldDataId,
            projectId: projectId,
            collector: msg.sender,
            coordinates: coordinates,
            photoHash: photoHash,
            carbonEstimate: carbonEstimate,
            status: FieldDataStatus.PENDING,
            submittedAt: block.timestamp,
            verifiedAt: 0,
            verifier: address(0),
            verificationNotes: ""
        });

        projectFieldData[projectId].push(fieldDataId);

        emit FieldDataSubmitted(fieldDataId, projectId, msg.sender);
        return fieldDataId;
    }

    /**
     * @dev Verify field data (only verifiers can call this)
     * @param fieldDataId Field data ID to verify
     * @param approved Whether to approve or reject
     * @param notes Verification notes
     */
    function verifyFieldData(
        uint256 fieldDataId,
        bool approved,
        string memory notes
    ) external onlyRole(VERIFIER_ROLE) {
        require(fieldData[fieldDataId].status == FieldDataStatus.PENDING, "Field data already processed");

        FieldData storage data = fieldData[fieldDataId];
        data.status = approved ? FieldDataStatus.VERIFIED : FieldDataStatus.REJECTED;
        data.verifiedAt = block.timestamp;
        data.verifier = msg.sender;
        data.verificationNotes = notes;

        if (approved) {
            // Issue carbon credits
            _issueCarbonCredits(fieldDataId);
        }

        emit FieldDataVerified(fieldDataId, msg.sender, approved);
    }

    /**
     * @dev Issue carbon credits for verified field data
     * @param fieldDataId Field data ID
     */
    function _issueCarbonCredits(uint256 fieldDataId) internal {
        FieldData memory data = fieldData[fieldDataId];
        Project storage project = projects[data.projectId];

        _creditIds.increment();
        uint256 creditId = _creditIds.current();

        carbonCredits[creditId] = CarbonCredit({
            id: creditId,
            projectId: data.projectId,
            fieldDataId: fieldDataId,
            amount: data.carbonEstimate,
            status: CreditStatus.ISSUED,
            owner: project.owner,
            issuedAt: block.timestamp,
            retiredAt: 0,
            blockchainTxHash: ""
        });

        projectCredits[data.projectId].push(creditId);
        project.totalCredits += data.carbonEstimate;
        project.verifiedArea += 100; // Assuming 100 sqm per field data entry

        // Mint NFT for carbon credit
        _safeMint(project.owner, creditId);
        _setTokenURI(creditId, data.photoHash);

        emit CarbonCreditsIssued(creditId, data.projectId, data.carbonEstimate);
    }

    /**
     * @dev Transfer carbon credits
     * @param to Recipient address
     * @param creditId Credit ID to transfer
     */
    function transferCarbonCredits(address to, uint256 creditId) external {
        require(ownerOf(creditId) == msg.sender, "Not the owner");
        require(carbonCredits[creditId].status == CreditStatus.ISSUED, "Credit not transferable");

        carbonCredits[creditId].owner = to;
        _transfer(msg.sender, to, creditId);

        emit CarbonCreditsTransferred(creditId, msg.sender, to);
    }

    /**
     * @dev Retire carbon credits (permanent removal from circulation)
     * @param creditId Credit ID to retire
     */
    function retireCarbonCredits(uint256 creditId) external {
        require(ownerOf(creditId) == msg.sender, "Not the owner");
        require(carbonCredits[creditId].status == CreditStatus.ISSUED, "Credit not retireable");

        carbonCredits[creditId].status = CreditStatus.RETIRED;
        carbonCredits[creditId].retiredAt = block.timestamp;
        carbonCredits[creditId].blockchainTxHash = string(abi.encodePacked("0x", _toHexString(block.timestamp)));

        emit CarbonCreditsRetired(creditId, msg.sender, carbonCredits[creditId].amount);
    }

    /**
     * @dev Get project details
     * @param projectId Project ID
     */
    function getProject(uint256 projectId) external view returns (Project memory) {
        return projects[projectId];
    }

    /**
     * @dev Get field data details
     * @param fieldDataId Field data ID
     */
    function getFieldData(uint256 fieldDataId) external view returns (FieldData memory) {
        return fieldData[fieldDataId];
    }

    /**
     * @dev Get carbon credit details
     * @param creditId Credit ID
     */
    function getCarbonCredit(uint256 creditId) external view returns (CarbonCredit memory) {
        return carbonCredits[creditId];
    }

    /**
     * @dev Get user's projects
     * @param user User address
     */
    function getUserProjects(address user) external view returns (uint256[] memory) {
        return userProjects[user];
    }

    /**
     * @dev Get project's field data
     * @param projectId Project ID
     */
    function getProjectFieldData(uint256 projectId) external view returns (uint256[] memory) {
        return projectFieldData[projectId];
    }

    /**
     * @dev Get project's carbon credits
     * @param projectId Project ID
     */
    function getProjectCredits(uint256 projectId) external view returns (uint256[] memory) {
        return projectCredits[projectId];
    }

    /**
     * @dev Helper function to convert uint to hex string
     */
    function _toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp >>= 4;
        }
        bytes memory buffer = new bytes(digits);
        for (uint256 i = digits; i > 0; i--) {
            buffer[i - 1] = bytes16("0123456789abcdef")[value & 0xf];
            value >>= 4;
        }
        return string(buffer);
    }

    // Required overrides for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
