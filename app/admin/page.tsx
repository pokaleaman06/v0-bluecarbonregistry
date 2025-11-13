"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, Users, TrendingUp, AlertCircle } from "lucide-react"

const pendingProjects = [
  { id: 1, name: "Solar Farm - Maharashtra", owner: "Amit Patel", trustScore: 72, status: "pending" },
  { id: 2, name: "Wind Energy - Tamil Nadu", owner: "Priya Sharma", trustScore: 72, status: "pending" },
]

const users = [
  { id: 1, name: "Raj Kumar", role: "individual", status: "active" },
  { id: 2, name: "Priya Sharma", role: "business", status: "active" },
  { id: 3, name: "Amit Patel", role: "project_owner", status: "active" },
]

export default function AdminPage() {
  const [approvals, setApprovals] = useState<Record<number, boolean | null>>({})

  const handleApprove = (id: number) => {
    setApprovals((prev) => ({ ...prev, [id]: true }))
  }

  const handleReject = (id: number) => {
    setApprovals((prev) => ({ ...prev, [id]: false }))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Admin" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Admin Console</h1>
              <p className="text-muted-foreground mt-1">Manage projects, users, and platform operations</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <AlertCircle className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-foreground">2</p>
              </Card>
              <Card className="p-6">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </Card>
              <Card className="p-6">
                <CheckCircle2 className="w-5 h-5 text-success mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Verified Projects</p>
                <p className="text-3xl font-bold text-foreground">2</p>
              </Card>
              <Card className="p-6">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
                <p className="text-3xl font-bold text-foreground">10.25K</p>
              </Card>
            </div>

            {/* Project Approvals */}
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Project Approval Queue</h2>
              <div className="space-y-3">
                {pendingProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 bg-card/50 border border-border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">by {project.owner}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-20 h-2 bg-border rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: `${project.trustScore}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{project.trustScore}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(project.id)}
                        className="bg-success text-success-foreground hover:bg-success/90"
                        disabled={approvals[project.id] !== undefined}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(project.id)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        disabled={approvals[project.id] !== undefined}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* User Management */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-accent/5">
                        <td className="py-4 px-4 text-foreground text-sm font-semibold">{user.name}</td>
                        <td className="py-4 px-4 text-foreground text-sm capitalize">{user.role.replace(/_/g, " ")}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-success/20 text-success rounded-full text-xs font-semibold">
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
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
