"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Leaf, ArrowRight, ArrowLeft } from "lucide-react"
import { saveAuthToken, mockUsers } from "@/lib/auth-utils"

const ROLES = [
  { id: "individual", label: "Individual", description: "Offset your personal carbon footprint" },
  { id: "business", label: "Business", description: "Manage corporate sustainability" },
  { id: "project_owner", label: "Project Owner", description: "Submit and manage projects" },
  { id: "auditor", label: "Auditor", description: "Verify and audit projects" },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", company: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setStep("details")
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock signup
      const token =
        selectedRole === "business"
          ? mockUsers.business.accessToken
          : selectedRole === "project_owner"
            ? mockUsers.project_owner.accessToken
            : mockUsers.individual.accessToken

      saveAuthToken(token)
      router.push("/dashboard")
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CarboSafe</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join the carbon credit revolution</p>
        </div>

        {step === "role" ? (
          // Role Selection
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {ROLES.map((role) => (
              <Card
                key={role.id}
                className="p-6 cursor-pointer border-2 transition-all hover:border-primary"
                onClick={() => handleRoleSelect(role.id)}
              >
                <h3 className="font-semibold text-foreground mb-2">{role.label}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </Card>
            ))}
          </div>
        ) : (
          // Details Form
          <Card className="p-8 mb-6">
            <div className="mb-6">
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-2 text-primary hover:underline text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Change role
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                />
              </div>

              {selectedRole === "business" && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating account..." : "Create Account"}{" "}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </Card>
        )}

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
