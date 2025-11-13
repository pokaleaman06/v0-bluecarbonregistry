"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Leaf, ArrowRight } from "lucide-react"
import { saveAuthToken, mockUsers } from "@/lib/auth-utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Mock login - validate email and password
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email.includes("@company") || email.includes("priya")) {
        saveAuthToken(mockUsers.business.accessToken)
        router.push("/dashboard")
      } else if (email.includes("@ngo") || email.includes("amit")) {
        saveAuthToken(mockUsers.project_owner.accessToken)
        router.push("/dashboard")
      } else if (email && password) {
        saveAuthToken(mockUsers.individual.accessToken)
        router.push("/dashboard")
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CarboSafe</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>

        {/* Form Card */}
        <Card className="p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="bg-card/50 p-4 rounded-lg mb-6 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Demo Credentials</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <strong>Individual:</strong> raj@example.com / password
            </p>
            <p>
              <strong>Business:</strong> priya@company.com / password
            </p>
            <p>
              <strong>Project Owner:</strong> amit@ngo.org / password
            </p>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
