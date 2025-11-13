"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAuthToken } from "@/lib/auth-utils"
import { Leaf, Zap, Award, TrendingUp, ArrowRight } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

const chartData = [
  { month: "Jan", offset: 45, verified: 38 },
  { month: "Feb", offset: 52, verified: 45 },
  { month: "Mar", offset: 48, verified: 42 },
  { month: "Apr", offset: 61, verified: 55 },
  { month: "May", offset: 55, verified: 50 },
  { month: "Jun", offset: 72, verified: 68 },
]

const recentProjects = [
  { id: 1, name: "Solar Farm - Maharashtra", status: "verified", credits: 2500 },
  { id: 2, name: "Mangrove Restoration", status: "verified", credits: 1600 },
  { id: 3, name: "Wind Energy - Tamil Nadu", status: "pending", credits: 2250 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="individual" />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" userImage="https://api.dicebear.com/7.x/avataaars/svg?seed=Raj" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, Raj</h1>
                <p className="text-muted-foreground mt-1">Track your carbon offset journey</p>
              </div>
              <Link href="/project/upload">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Upload Project <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Projects" value="12" trend={15} icon={<Leaf className="w-5 h-5 text-primary" />} />
              <StatCard
                label="Verified Credits"
                value="8,450"
                trend={22}
                icon={<Zap className="w-5 h-5 text-primary" />}
              />
              <StatCard label="Pending Verifications" value="3" icon={<Award className="w-5 h-5 text-primary" />} />
              <StatCard
                label="CarboPoints"
                value="12,250"
                trend={8}
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Carbon Offset Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                    <Line type="monotone" dataKey="offset" stroke="#00A86B" strokeWidth={2} />
                    <Line type="monotone" dataKey="verified" stroke="#38BDF8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Bar Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Verification Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                    <Bar dataKey="verified" fill="#00A86B" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Projects</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Project Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Credits</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id} className="border-b border-border/50 hover:bg-accent/5">
                        <td className="py-4 px-4 text-foreground">{project.name}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              project.status === "verified"
                                ? "bg-success/20 text-success"
                                : "bg-amber-500/20 text-amber-600"
                            }`}
                          >
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-foreground font-semibold">{project.credits.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
