// Mock API for AI Verification and Tokenization workflow
// TODO: Replace with real AI model inference and smart contract calls

import { v4 as uuidv4 } from 'uuid'

export type AdminStatus = 'pending' | 'approved' | 'rejected' | 'adjusted'

export interface SubmissionRecord {
  id: string
  projectName: string
  imageUrl: string
  submittedAt: string
  aiHealthScore?: number
  metrics?: {
    treeDensity: number
    canopyCoverage: number
    survivalRate: number
  }
  adminStatus: AdminStatus
  adminNote?: string
  mintedCredits?: number
  tokenId?: string
  txHash?: string
}

// In-memory store for session-lifetime persistence
const submissions: SubmissionRecord[] = []

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function createSubmission(input: {
  projectName: string
  imageUrl: string
}): Promise<SubmissionRecord> {
  const record: SubmissionRecord = {
    id: uuidv4(),
    projectName: input.projectName,
    imageUrl: input.imageUrl,
    submittedAt: new Date().toISOString(),
    adminStatus: 'pending',
  }
  submissions.unshift(record)
  return record
}

export async function runAiVerification(submissionId: string): Promise<SubmissionRecord> {
  // Simulate processing
  await delay(1500)
  const record = submissions.find((s) => s.id === submissionId)
  if (!record) throw new Error('Submission not found')

  const healthScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70
  const treeDensity = Math.round(50 + healthScore / 2)
  const canopyCoverage = Math.round(healthScore * 0.8)
  const survivalRate = Math.round(healthScore - 10)

  record.aiHealthScore = healthScore
  record.metrics = {
    treeDensity,
    canopyCoverage,
    survivalRate,
  }
  return record
}

export async function adjustAiResults(
  submissionId: string,
  update: { aiHealthScore: number; adminNote?: string }
): Promise<SubmissionRecord> {
  const record = submissions.find((s) => s.id === submissionId)
  if (!record) throw new Error('Submission not found')
  const healthScore = Math.max(0, Math.min(100, Math.round(update.aiHealthScore)))
  record.aiHealthScore = healthScore
  record.metrics = {
    treeDensity: Math.round(50 + healthScore / 2),
    canopyCoverage: Math.round(healthScore * 0.8),
    survivalRate: Math.round(healthScore - 10),
  }
  record.adminStatus = 'adjusted'
  record.adminNote = update.adminNote
  return record
}

export async function setAdminDecision(
  submissionId: string,
  decision: AdminStatus,
  adminNote?: string
): Promise<SubmissionRecord> {
  const record = submissions.find((s) => s.id === submissionId)
  if (!record) throw new Error('Submission not found')
  record.adminStatus = decision
  record.adminNote = adminNote
  return record
}

export async function mintTokens(submissionId: string): Promise<SubmissionRecord> {
  const record = submissions.find((s) => s.id === submissionId)
  if (!record) throw new Error('Submission not found')
  if (record.adminStatus !== 'approved') throw new Error('Submission not approved')
  if (typeof record.aiHealthScore !== 'number') throw new Error('AI score missing')

  await delay(1000)

  const credits = Math.floor(record.aiHealthScore / 10)
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const tokenId = `TKN-${dateStr}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  const txHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random()
    .toString(16)
    .slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`

  record.mintedCredits = credits
  record.tokenId = tokenId
  record.txHash = txHash
  return record
}

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  await delay(150)
  return submissions
}

// Seed with one demo submission for judges
;(function seed() {
  const demo: SubmissionRecord = {
    id: uuidv4(),
    projectName: 'Demo Mangrove Plot A',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=1200&q=60',
    submittedAt: new Date().toISOString(),
    adminStatus: 'pending',
  }
  submissions.push(demo)
})()
