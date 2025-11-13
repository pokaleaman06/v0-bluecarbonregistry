import { z } from 'zod';

// User Types
export const UserRoleSchema = z.enum([
  'NGO',
  'PANCHAYAT',
  'VERIFIER',
  'ADMIN',
  'INDUSTRY',
  'GOVERNMENT',
  'FIELD_COLLECTOR'
]);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: UserRoleSchema,
  organization: z.string(),
  region: z.string(),
  language: z.string().default('en'),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Location Types
export const CoordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number()
});

export const PolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number())))
});

// Field Data Types
export const TreeMeasurementSchema = z.object({
  dbh: z.number().positive(), // Diameter at Breast Height in cm
  height: z.number().positive(), // Height in meters
  species: z.string(),
  basalArea: z.number().optional() // Auto-calculated
});

export const PhotoPointSchema = z.object({
  id: z.string(),
  url: z.string(),
  coordinates: CoordinateSchema,
  timestamp: z.date(),
  metadata: z.object({
    exif: z.record(z.any()).optional(),
    accuracy: z.number().optional(),
    bearing: z.number().optional()
  })
});

export const FieldDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string(),
  polygon: PolygonSchema,
  photoPoints: z.array(PhotoPointSchema),
  treeMeasurements: z.array(TreeMeasurementSchema),
  notes: z.string().optional(),
  submittedAt: z.date(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  carbonEstimate: z.number().optional()
});

// Verification Types
export const VerificationSchema = z.object({
  id: z.string(),
  fieldDataId: z.string(),
  verifierId: z.string(),
  action: z.enum(['APPROVE', 'REJECT', 'ADJUST']),
  adjustedCarbonValue: z.number().optional(),
  comments: z.string().optional(),
  verifiedAt: z.date()
});

// Carbon Credit Types
export const CarbonCreditSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  amount: z.number().positive(),
  status: z.enum(['PENDING', 'ISSUED', 'TRADED', 'RETIRED']),
  issuedAt: z.date().optional(),
  retiredAt: z.date().optional(),
  blockchainTxHash: z.string().optional()
});

// Project Types
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  polygon: PolygonSchema,
  ownerId: z.string(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'SUSPENDED']),
  totalArea: z.number().positive(), // in hectares
  verifiedArea: z.number().default(0),
  totalCredits: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional()
});

// Export types
export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type Coordinate = z.infer<typeof CoordinateSchema>;
export type Polygon = z.infer<typeof PolygonSchema>;
export type TreeMeasurement = z.infer<typeof TreeMeasurementSchema>;
export type PhotoPoint = z.infer<typeof PhotoPointSchema>;
export type FieldData = z.infer<typeof FieldDataSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
export type CarbonCredit = z.infer<typeof CarbonCreditSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
