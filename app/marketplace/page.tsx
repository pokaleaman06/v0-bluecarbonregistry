"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Star, ShoppingCart, MapPin } from "lucide-react"
import Link from "next/link"
import projectsData from "@/data/projects.json"

type SortType = "newest" | "credits" | "verified"

export default function MarketplacePage() {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [sortBy, setSortBy] = useState<SortType>("verified")
  const [showModal, setShowModal] = useState(false)
  const [buyAmount, setBuyAmount] = useState("100")
  const [currency, setCurrency] = useState<"inr" | "kg">("kg")

  const verifiedProjects = projectsData.projects.filter((p) => p.verificationStatus === "verified")

  const sortedProjects = [...verifiedProjects].sort((a, b) => {
    if (sortBy === "credits") return b.availableCredits - a.availableCredits
    if (sortBy === "verified") return b.trustScore - a.trustScore
    return 0
  })

  const handleBuy = (project: any) => {
    setSelectedProject(project)
    setShowModal(true)
  }

  const calculateCost = () => {
    if (currency === "kg") {
      return (Number.parseInt(buyAmount) * selectedProject.pricePerTon) / 1000
    }
    return (Number.parseInt(buyAmount) / selectedProject.pricePerTon) * 1000
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Carbon Marketplace</h1>
              <p className="text-muted-foreground mt-1">Browse and invest in verified carbon offset projects</p>
            </div>

            {/* Filter & Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 flex gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search projects..." className="w-full" />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortType)} className="cs-input">
                <option value="verified">Most Verified</option>
                <option value="credits">Most Credits</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-aqua/20 overflow-hidden">
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-success/90 text-success-foreground rounded-full text-xs font-bold">
                      {project.trustScore}%
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{project.name}</h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      {project.location.district}, {project.location.state}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-1">CO₂ Offset</p>
                        <p className="text-sm font-bold text-foreground">{project.estimatedCO2Tons.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Available</p>
                        <p className="text-sm font-bold text-foreground">
                          {(project.availableCredits / 1000).toFixed(1)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Price/Ton</p>
                        <p className="text-sm font-bold text-primary">₹{project.pricePerTon}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Type</p>
                        <p className="text-sm font-bold text-foreground capitalize">
                          {project.type.split("_").join(" ")}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuy(project)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Offset
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Buy Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{selectedProject.name}</h2>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Amount</label>
                  <button
                    onClick={() => setCurrency(currency === "kg" ? "inr" : "kg")}
                    className="text-xs px-2 py-1 bg-border rounded hover:bg-border/80 text-muted-foreground"
                  >
                    {currency === "kg" ? "INR" : "kg"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="flex-1"
                    placeholder="100"
                  />
                  <span className="px-4 py-2 bg-border rounded-lg text-foreground font-semibold">
                    {currency === "kg" ? "kg" : "₹"}
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-card/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit Price</span>
                  <span className="font-semibold text-foreground">
                    ₹{selectedProject.pricePerTon} {currency === "kg" ? "per ton" : "per kg"}
                  </span>
                </div>
                <div className="flex justify-between text-sm pb-2 border-b border-border">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">
                    {buyAmount} {currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ₹{Math.round(calculateCost()).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Info */}
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <Star className="w-5 h-5 text-success flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>{selectedProject.trustScore}%</strong> trust score - Verified project
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Link
                  href={`/checkout?projectId=${selectedProject.id}&amount=${buyAmount}&currency=${currency}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
