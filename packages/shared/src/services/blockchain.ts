import { ethers } from 'ethers';
import { z } from 'zod';

// Blockchain configuration schema
export const BlockchainConfigSchema = z.object({
  rpcUrl: z.string(),
  contractAddress: z.string(),
  chainId: z.number(),
  privateKey: z.string().optional(),
});

export type BlockchainConfig = z.infer<typeof BlockchainConfigSchema>;

// Contract interaction types
export const ContractProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  owner: z.string(),
  totalArea: z.number(),
  verifiedArea: z.number(),
  totalCredits: z.number(),
  status: z.number(), // 0: ACTIVE, 1: COMPLETED, 2: SUSPENDED
  createdAt: z.number(),
  updatedAt: z.number(),
  metadataURI: z.string(),
});

export const ContractFieldDataSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  collector: z.string(),
  coordinates: z.string(),
  photoHash: z.string(),
  carbonEstimate: z.number(),
  status: z.number(), // 0: PENDING, 1: VERIFIED, 2: REJECTED
  submittedAt: z.number(),
  verifiedAt: z.number(),
  verifier: z.string(),
  verificationNotes: z.string(),
});

export const ContractCarbonCreditSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  fieldDataId: z.number(),
  amount: z.number(),
  status: z.number(), // 0: PENDING, 1: ISSUED, 2: TRADED, 3: RETIRED
  owner: z.string(),
  issuedAt: z.number(),
  retiredAt: z.number(),
  blockchainTxHash: z.string(),
});

export type ContractProject = z.infer<typeof ContractProjectSchema>;
export type ContractFieldData = z.infer<typeof ContractFieldDataSchema>;
export type ContractCarbonCredit = z.infer<typeof ContractCarbonCreditSchema>;

// Contract ABI (simplified version)
export const BLUE_CARBON_REGISTRY_ABI = [
  // Events
  "event ProjectCreated(uint256 indexed projectId, address indexed owner, string name)",
  "event FieldDataSubmitted(uint256 indexed fieldDataId, uint256 indexed projectId, address indexed collector)",
  "event FieldDataVerified(uint256 indexed fieldDataId, address indexed verifier, bool approved)",
  "event CarbonCreditsIssued(uint256 indexed creditId, uint256 indexed projectId, uint256 amount)",
  "event CarbonCreditsTransferred(uint256 indexed creditId, address indexed from, address indexed to)",
  "event CarbonCreditsRetired(uint256 indexed creditId, address indexed owner, uint256 amount)",

  // Functions
  "function createProject(string memory name, string memory description, string memory location, uint256 totalArea, string memory metadataURI) external returns (uint256)",
  "function submitFieldData(uint256 projectId, string memory coordinates, string memory photoHash, uint256 carbonEstimate) external returns (uint256)",
  "function verifyFieldData(uint256 fieldDataId, bool approved, string memory notes) external",
  "function transferCarbonCredits(address to, uint256 creditId) external",
  "function retireCarbonCredits(uint256 creditId) external",
  
  // View functions
  "function getProject(uint256 projectId) external view returns (tuple(uint256 id, string name, string description, string location, address owner, uint256 totalArea, uint256 verifiedArea, uint256 totalCredits, uint8 status, uint256 createdAt, uint256 updatedAt, string metadataURI))",
  "function getFieldData(uint256 fieldDataId) external view returns (tuple(uint256 id, uint256 projectId, address collector, string coordinates, string photoHash, uint256 carbonEstimate, uint8 status, uint256 submittedAt, uint256 verifiedAt, address verifier, string verificationNotes))",
  "function getCarbonCredit(uint256 creditId) external view returns (tuple(uint256 id, uint256 projectId, uint256 fieldDataId, uint256 amount, uint8 status, address owner, uint256 issuedAt, uint256 retiredAt, string blockchainTxHash))",
  "function getUserProjects(address user) external view returns (uint256[] memory)",
  "function getProjectFieldData(uint256 projectId) external view returns (uint256[] memory)",
  "function getProjectCredits(uint256 projectId) external view returns (uint256[] memory)",
  
  // Role management
  "function grantRole(bytes32 role, address account) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function PROJECT_OWNER_ROLE() external view returns (bytes32)",
  "function FIELD_COLLECTOR_ROLE() external view returns (bytes32)",
  "function VERIFIER_ROLE() external view returns (bytes32)",
  "function ADMIN_ROLE() external view returns (bytes32)",
] as const;

export class BlockchainService {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private signer?: ethers.Signer;

  constructor(config: BlockchainConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    if (config.privateKey) {
      this.signer = new ethers.Wallet(config.privateKey, this.provider);
    }

    this.contract = new ethers.Contract(
      config.contractAddress,
      BLUE_CARBON_REGISTRY_ABI,
      this.signer || this.provider
    );
  }

  // Project management
  async createProject(
    name: string,
    description: string,
    location: string,
    totalArea: number,
    metadataURI: string
  ): Promise<{ txHash: string; projectId: number }> {
    if (!this.signer) {
      throw new Error('Signer required for contract interactions');
    }

    const tx = await this.contract.createProject(
      name,
      description,
      location,
      ethers.parseUnits(totalArea.toString(), 0), // Convert to wei
      metadataURI
    );

    const receipt = await tx.wait();
    const projectCreatedEvent = receipt.logs.find(
      (log: any) => log.topics[0] === this.contract.interface.getEvent('ProjectCreated')?.topicHash
    );

    if (!projectCreatedEvent) {
      throw new Error('Project creation event not found');
    }

    const decoded = this.contract.interface.parseLog(projectCreatedEvent);
    if (!decoded) {
      throw new Error('Failed to decode project creation event');
    }
    const projectId = Number(decoded.args.projectId);

    return {
      txHash: receipt.hash,
      projectId,
    };
  }

  async getProject(projectId: number): Promise<ContractProject> {
    const project = await this.contract.getProject(projectId);
    return {
      id: Number(project.id),
      name: project.name,
      description: project.description,
      location: project.location,
      owner: project.owner,
      totalArea: Number(project.totalArea),
      verifiedArea: Number(project.verifiedArea),
      totalCredits: Number(project.totalCredits),
      status: Number(project.status),
      createdAt: Number(project.createdAt),
      updatedAt: Number(project.updatedAt),
      metadataURI: project.metadataURI,
    };
  }

  async getUserProjects(userAddress: string): Promise<number[]> {
    const projectIds = await this.contract.getUserProjects(userAddress);
    return projectIds.map((id: any) => Number(id));
  }

  // Field data management
  async submitFieldData(
    projectId: number,
    coordinates: string,
    photoHash: string,
    carbonEstimate: number
  ): Promise<{ txHash: string; fieldDataId: number }> {
    if (!this.signer) {
      throw new Error('Signer required for contract interactions');
    }

    const tx = await this.contract.submitFieldData(
      projectId,
      coordinates,
      photoHash,
      ethers.parseUnits(carbonEstimate.toString(), 0)
    );

    const receipt = await tx.wait();
    const fieldDataSubmittedEvent = receipt.logs.find(
      (log: any) => log.topics[0] === this.contract.interface.getEvent('FieldDataSubmitted')?.topicHash
    );

    if (!fieldDataSubmittedEvent) {
      throw new Error('Field data submission event not found');
    }

    const decoded = this.contract.interface.parseLog(fieldDataSubmittedEvent);
    if (!decoded) {
      throw new Error('Failed to decode field data submission event');
    }
    const fieldDataId = Number(decoded.args.fieldDataId);

    return {
      txHash: receipt.hash,
      fieldDataId,
    };
  }

  async verifyFieldData(
    fieldDataId: number,
    approved: boolean,
    notes: string
  ): Promise<{ txHash: string }> {
    if (!this.signer) {
      throw new Error('Signer required for contract interactions');
    }

    const tx = await this.contract.verifyFieldData(fieldDataId, approved, notes);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
    };
  }

  async getFieldData(fieldDataId: number): Promise<ContractFieldData> {
    const fieldData = await this.contract.getFieldData(fieldDataId);
    return {
      id: Number(fieldData.id),
      projectId: Number(fieldData.projectId),
      collector: fieldData.collector,
      coordinates: fieldData.coordinates,
      photoHash: fieldData.photoHash,
      carbonEstimate: Number(fieldData.carbonEstimate),
      status: Number(fieldData.status),
      submittedAt: Number(fieldData.submittedAt),
      verifiedAt: Number(fieldData.verifiedAt),
      verifier: fieldData.verifier,
      verificationNotes: fieldData.verificationNotes,
    };
  }

  async getProjectFieldData(projectId: number): Promise<number[]> {
    const fieldDataIds = await this.contract.getProjectFieldData(projectId);
    return fieldDataIds.map((id: any) => Number(id));
  }

  // Carbon credit management
  async transferCarbonCredits(to: string, creditId: number): Promise<{ txHash: string }> {
    if (!this.signer) {
      throw new Error('Signer required for contract interactions');
    }

    const tx = await this.contract.transferCarbonCredits(to, creditId);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
    };
  }

  async retireCarbonCredits(creditId: number): Promise<{ txHash: string }> {
    if (!this.signer) {
      throw new Error('Signer required for contract interactions');
    }

    const tx = await this.contract.retireCarbonCredits(creditId);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
    };
  }

  async getCarbonCredit(creditId: number): Promise<ContractCarbonCredit> {
    const credit = await this.contract.getCarbonCredit(creditId);
    return {
      id: Number(credit.id),
      projectId: Number(credit.projectId),
      fieldDataId: Number(credit.fieldDataId),
      amount: Number(credit.amount),
      status: Number(credit.status),
      owner: credit.owner,
      issuedAt: Number(credit.issuedAt),
      retiredAt: Number(credit.retiredAt),
      blockchainTxHash: credit.blockchainTxHash,
    };
  }

  async getProjectCredits(projectId: number): Promise<number[]> {
    const creditIds = await this.contract.getProjectCredits(projectId);
    return creditIds.map((id: any) => Number(id));
  }

  // Role management
  async grantRole(role: string, account: string): Promise<{ txHash: string }> {
    if (!this.signer) {
      throw new Error('Signer required for contract interactions');
    }

    const tx = await this.contract.grantRole(role, account);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
    };
  }

  async hasRole(role: string, account: string): Promise<boolean> {
    return await this.contract.hasRole(role, account);
  }

  // Event listeners
  onProjectCreated(callback: (projectId: number, owner: string, name: string) => void) {
    this.contract.on('ProjectCreated', (projectId, owner, name) => {
      callback(Number(projectId), owner, name);
    });
  }

  onFieldDataSubmitted(callback: (fieldDataId: number, projectId: number, collector: string) => void) {
    this.contract.on('FieldDataSubmitted', (fieldDataId, projectId, collector) => {
      callback(Number(fieldDataId), Number(projectId), collector);
    });
  }

  onFieldDataVerified(callback: (fieldDataId: number, verifier: string, approved: boolean) => void) {
    this.contract.on('FieldDataVerified', (fieldDataId, verifier, approved) => {
      callback(Number(fieldDataId), verifier, approved);
    });
  }

  onCarbonCreditsIssued(callback: (creditId: number, projectId: number, amount: number) => void) {
    this.contract.on('CarbonCreditsIssued', (creditId, projectId, amount) => {
      callback(Number(creditId), Number(projectId), Number(amount));
    });
  }

  // Utility methods
  async getCurrentBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getNetwork(): Promise<{ name: string; chainId: number }> {
    const network = await this.provider.getNetwork();
    return {
      name: network.name,
      chainId: Number(network.chainId),
    };
  }

  // Remove all listeners
  removeAllListeners() {
    this.contract.removeAllListeners();
  }
}
