// Mock authentication utilities for demo purposes

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "individual" | "business" | "project_owner" | "auditor" | "admin"
  accessToken: string
}

export const mockUsers: Record<string, AuthUser> = {
  individual: {
    id: "user_1",
    name: "Raj Kumar",
    email: "raj@example.com",
    role: "individual",
    accessToken: "mock_token_individual_001",
  },
  business: {
    id: "user_2",
    name: "Priya Sharma",
    email: "priya@company.com",
    role: "business",
    accessToken: "mock_token_business_001",
  },
  project_owner: {
    id: "user_3",
    name: "Amit Patel",
    email: "amit@ngo.org",
    role: "project_owner",
    accessToken: "mock_token_projectowner_001",
  },
}

export const saveAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("carbosafe_auth_token", token)
  }
}

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("carbosafe_auth_token")
  }
  return null
}

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("carbosafe_auth_token")
  }
}
