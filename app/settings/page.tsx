"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth-utils"

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = () => {
    clearAuthToken()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="individual" />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile Section */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <Input defaultValue="Raj Kumar" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input type="email" defaultValue="raj@example.com" className="w-full" />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">These actions cannot be undone. Please be certain.</p>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
