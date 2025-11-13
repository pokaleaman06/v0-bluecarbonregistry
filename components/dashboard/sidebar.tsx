"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  Zap,
  Map,
  ShoppingBag,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { clearAuthToken } from "@/lib/auth-utils"

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole = "individual" }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "Projects", href: "/projects" },
    { icon: CheckCircle, label: "Verification", href: "/verification" },
    { icon: Zap, label: "Upload", href: "/project/upload" },
    { icon: Map, label: "Map", href: "/map" },
    { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
    { icon: Zap, label: "Ledger", href: "/ledger" },
    { icon: Gift, label: "Rewards", href: "/wallet" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  // Filter menu based on role
  const filteredMenu = menuItems.filter((item) => {
    if (userRole === "auditor" && item.label === "Upload") return false
    if (userRole === "admin") return true
    return true
  })

  const handleLogout = () => {
    clearAuthToken()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-40 md:hidden">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative w-64 h-screen bg-card border-r border-border overflow-y-auto z-40
        transform transition-transform duration-300 md:transform-none
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">C</span>
            </div>
            <span className="font-bold text-foreground">CarboSafe</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={handleLogout} variant="outline" className="w-full flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
