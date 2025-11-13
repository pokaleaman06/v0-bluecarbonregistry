import { User, Project, FieldData, CarbonCredit, Verification } from '../types';

// Sample Users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@nccr.gov.in',
    phone: '+91-9876543210',
    role: 'ADMIN',
    organization: 'National Centre for Coastal Research',
    region: 'Chennai',
    language: 'en',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@kerala.gov.in',
    phone: '+91-9876543211',
    role: 'VERIFIER',
    organization: 'Kerala Coastal Authority',
    region: 'Kerala',
    language: 'en',
    isVerified: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@ngofoundation.org',
    phone: '+91-9876543212',
    role: 'NGO',
    organization: 'Coastal Conservation Society',
    region: 'Gujarat',
    language: 'hi',
    isVerified: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@panchayat.gov.in',
    phone: '+91-9876543213',
    role: 'PANCHAYAT',
    organization: 'Maharashtra Coastal Panchayat',
    region: 'Maharashtra',
    language: 'hi',
    isVerified: true,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '5',
    name: 'Field Collector',
    email: 'collector@example.com',
    phone: '+91-9876543214',
    role: 'FIELD_COLLECTOR',
    organization: 'Coastal Restoration NGO',
    region: 'Maharashtra',
    language: 'en',
    isVerified: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19'),
  },
];

// Sample Projects
export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Sundarbans Mangrove Restoration',
    description: 'Large-scale mangrove restoration project in the Sundarbans delta to enhance carbon sequestration and coastal protection.',
    location: 'Sundarbans, West Bengal',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [88.1, 21.5],
        [88.3, 21.5],
        [88.3, 21.7],
        [88.1, 21.7],
        [88.1, 21.5],
      ]],
    },
    ownerId: '3',
    status: 'ACTIVE',
    totalArea: 150.5,
    verifiedArea: 89.2,
    totalCredits: 1250.8,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Kerala Backwater Conservation',
    description: 'Seagrass restoration and conservation project in Kerala backwaters to improve water quality and carbon storage.',
    location: 'Kerala Backwaters',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [76.2, 9.8],
        [76.4, 9.8],
        [76.4, 10.0],
        [76.2, 10.0],
        [76.2, 9.8],
      ]],
    },
    ownerId: '4',
    status: 'ACTIVE',
    totalArea: 75.3,
    verifiedArea: 45.6,
    totalCredits: 678.4,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: '3',
    name: 'Gujarat Coastal Protection',
    description: 'Mangrove plantation and coastal protection project along Gujarat coastline.',
    location: 'Gujarat Coast',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [70.1, 22.3],
        [70.3, 22.3],
        [70.3, 22.5],
        [70.1, 22.5],
        [70.1, 22.3],
      ]],
    },
    ownerId: '3',
    status: 'ACTIVE',
    totalArea: 200.0,
    verifiedArea: 120.5,
    totalCredits: 1890.2,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
  },
];

// Sample Field Data
export const sampleFieldData: FieldData[] = [
  {
    id: '1',
    userId: '5',
    projectId: '1',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [88.15, 21.55],
        [88.16, 21.55],
        [88.16, 21.56],
        [88.15, 21.56],
        [88.15, 21.55],
      ]],
    },
    photoPoints: [
      {
        id: '1',
        url: 'https://example.com/photo1.jpg',
        coordinates: { latitude: 21.555, longitude: 88.155 },
        timestamp: new Date('2024-01-20T10:30:00Z'),
        metadata: {
          exif: { GPSLatitude: 21.555, GPSLongitude: 88.155 },
          accuracy: 5.0,
          bearing: 45.0,
        },
      },
    ],
    treeMeasurements: [
      {
        dbh: 15.5,
        height: 8.2,
        species: 'Rhizophora mucronata',
        basalArea: 0.019,
      },
      {
        dbh: 12.3,
        height: 6.8,
        species: 'Avicennia marina',
        basalArea: 0.012,
      },
    ],
    notes: 'Mangrove saplings planted in high-density pattern. Good survival rate observed.',
    submittedAt: new Date('2024-01-20T11:00:00Z'),
    status: 'VERIFIED',
    carbonEstimate: 125.5,
  },
  {
    id: '2',
    userId: '5',
    projectId: '2',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [76.25, 9.85],
        [76.26, 9.85],
        [76.26, 9.86],
        [76.25, 9.86],
        [76.25, 9.85],
      ]],
    },
    photoPoints: [
      {
        id: '2',
        url: 'https://example.com/photo2.jpg',
        coordinates: { latitude: 9.855, longitude: 76.255 },
        timestamp: new Date('2024-01-18T14:20:00Z'),
        metadata: {
          exif: { GPSLatitude: 9.855, GPSLongitude: 76.255 },
          accuracy: 3.0,
          bearing: 90.0,
        },
      },
    ],
    treeMeasurements: [
      {
        dbh: 8.7,
        height: 4.5,
        species: 'Halophila ovalis',
        basalArea: 0.006,
      },
    ],
    notes: 'Seagrass restoration area showing good growth. Water quality improved.',
    submittedAt: new Date('2024-01-18T15:00:00Z'),
    status: 'VERIFIED',
    carbonEstimate: 89.2,
  },
  {
    id: '3',
    userId: '5',
    projectId: '3',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [70.15, 22.35],
        [70.16, 22.35],
        [70.16, 22.36],
        [70.15, 22.36],
        [70.15, 22.35],
      ]],
    },
    photoPoints: [
      {
        id: '3',
        url: 'https://example.com/photo3.jpg',
        coordinates: { latitude: 22.355, longitude: 70.155 },
        timestamp: new Date('2024-01-15T09:15:00Z'),
        metadata: {
          exif: { GPSLatitude: 22.355, GPSLongitude: 70.155 },
          accuracy: 4.0,
          bearing: 180.0,
        },
      },
    ],
    treeMeasurements: [
      {
        dbh: 18.2,
        height: 10.5,
        species: 'Rhizophora apiculata',
        basalArea: 0.026,
      },
      {
        dbh: 14.8,
        height: 9.1,
        species: 'Bruguiera gymnorrhiza',
        basalArea: 0.017,
      },
    ],
    notes: 'Mature mangrove trees showing excellent growth. Carbon sequestration potential high.',
    submittedAt: new Date('2024-01-15T10:00:00Z'),
    status: 'PENDING',
    carbonEstimate: 156.8,
  },
];

// Sample Carbon Credits
export const sampleCarbonCredits: CarbonCredit[] = [
  {
    id: '1',
    projectId: '1',
    amount: 125.5,
    status: 'ISSUED',
    issuedAt: new Date('2024-01-21T10:00:00Z'),
    blockchainTxHash: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: '2',
    projectId: '2',
    amount: 89.2,
    status: 'ISSUED',
    issuedAt: new Date('2024-01-19T14:30:00Z'),
    blockchainTxHash: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    id: '3',
    projectId: '1',
    amount: 50.0,
    status: 'RETIRED',
    issuedAt: new Date('2024-01-21T10:00:00Z'),
    retiredAt: new Date('2024-01-22T16:00:00Z'),
    blockchainTxHash: '0x9876543210fedcba9876543210fedcba98765432',
  },
];

// Sample Verifications
export const sampleVerifications: Verification[] = [
  {
    id: '1',
    fieldDataId: '1',
    verifierId: '2',
    action: 'APPROVE',
    adjustedCarbonValue: 125.5,
    comments: 'Field data verified. Photos and measurements are accurate. Carbon estimate is reasonable.',
    verifiedAt: new Date('2024-01-21T09:30:00Z'),
  },
  {
    id: '2',
    fieldDataId: '2',
    verifierId: '2',
    action: 'APPROVE',
    adjustedCarbonValue: 89.2,
    comments: 'Seagrass restoration data verified. Good documentation and accurate measurements.',
    verifiedAt: new Date('2024-01-19T13:45:00Z'),
  },
  {
    id: '3',
    fieldDataId: '3',
    verifierId: '2',
    action: 'REJECT',
    comments: 'Insufficient photo evidence. Please provide more detailed documentation of the restoration area.',
    verifiedAt: new Date('2024-01-16T11:20:00Z'),
  },
];

// Sample blockchain transactions
export const sampleBlockchainTransactions = [
  {
    id: '1',
    type: 'PROJECT_CREATED',
    projectId: '1',
    txHash: '0x1111111111111111111111111111111111111111',
    blockNumber: 12345678,
    timestamp: new Date('2024-01-10T08:00:00Z'),
    gasUsed: '150000',
    gasPrice: '30000000000',
  },
  {
    id: '2',
    type: 'FIELD_DATA_SUBMITTED',
    fieldDataId: '1',
    txHash: '0x2222222222222222222222222222222222222222',
    blockNumber: 12345679,
    timestamp: new Date('2024-01-20T11:00:00Z'),
    gasUsed: '200000',
    gasPrice: '30000000000',
  },
  {
    id: '3',
    type: 'CARBON_CREDITS_ISSUED',
    creditId: '1',
    txHash: '0x3333333333333333333333333333333333333333',
    blockNumber: 12345680,
    timestamp: new Date('2024-01-21T10:00:00Z'),
    gasUsed: '180000',
    gasPrice: '30000000000',
  },
];

// Sample analytics data
export const sampleAnalytics = {
  totalProjects: 156,
  activeProjects: 142,
  completedProjects: 14,
  totalArea: 2847.5,
  verifiedArea: 2156.8,
  totalCredits: 8924.3,
  issuedCredits: 7845.7,
  retiredCredits: 1078.6,
  totalStakeholders: 89,
  verifiedStakeholders: 76,
  pendingVerifications: 23,
  blockchainTransactions: 1247,
  monthlyGrowth: [
    { month: 'Jan', projects: 12, credits: 1250 },
    { month: 'Feb', projects: 18, credits: 1890 },
    { month: 'Mar', projects: 25, credits: 2150 },
    { month: 'Apr', projects: 32, credits: 2890 },
    { month: 'May', projects: 28, credits: 2450 },
    { month: 'Jun', projects: 35, credits: 3120 },
  ],
  regionalDistribution: [
    { region: 'West Bengal', projects: 45, area: 850.2, credits: 1250.8 },
    { region: 'Kerala', projects: 38, area: 650.5, credits: 980.3 },
    { region: 'Gujarat', projects: 42, area: 720.8, credits: 1150.2 },
    { region: 'Maharashtra', projects: 31, area: 625.0, credits: 890.5 },
  ],
  stakeholderTypes: [
    { type: 'NGO', count: 45, verified: 38 },
    { type: 'PANCHAYAT', count: 28, verified: 25 },
    { type: 'VERIFIER', count: 16, verified: 13 },
  ],
};
