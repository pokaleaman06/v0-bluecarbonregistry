"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MapPin, Filter, SlidersIcon as SliderIcon, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import projectsData from "@/data/projects.json"
import Link from "next/link"

export default function MapPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [trustScoreFilter, setTrustScoreFilter] = useState(0)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredProjects = projectsData.projects.filter((project) => {
    const passesStatus = selectedStatus === "all" || project.verificationStatus === selectedStatus
    const passesTrust = project.trustScore >= trustScoreFilter
    return passesStatus && passesTrust
  })

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Control Panel */}
        <div className="bg-card border-b border-border p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Project Map
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Showing {filteredProjects.length} verified projects</p>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowHeatmap(!showHeatmap)}
              title={showHeatmap ? "Hide heatmap" : "Show heatmap"}
            >
              {showHeatmap ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Status:</span>
            </div>
            {["all", "verified", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                  selectedStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-border text-foreground hover:bg-border/80"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}

            <div className="flex items-center gap-2 ml-auto">
              <SliderIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Min Trust:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={trustScoreFilter}
                onChange={(e) => setTrustScoreFilter(Number.parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm font-semibold text-primary">{trustScoreFilter}%</span>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 flex gap-6 p-4 md:p-6 overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 bg-gradient-to-br from-primary/5 via-aqua/5 to-background rounded-lg border border-border overflow-hidden flex flex-col items-center justify-center relative">
            {showHeatmap && (
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-primary rounded-full blur-3xl" />
                <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-aqua rounded-full blur-3xl" />
              </div>
            )}

            <div className="relative z-10 text-center">
              <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-semibold mb-2">Interactive Map</p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Map view requires Mapbox token. This is a demo view showing {filteredProjects.length} projects on the
                map.
              </p>
            </div>

            {/* Project Pins Preview */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {filteredProjects.map((project, index) => {
                const randomX = (index * 33) % 100
                const randomY = (((index * 47) % 100) + 20) % 80
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="absolute w-10 h-10 pointer-events-auto cursor-pointer group"
                    style={{
                      left: `${randomX}%`,
                      top: `${randomY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={project.name}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:bg-primary/50 transition-all" />
                      <div
                        className={`relative w-10 h-10 rounded-full border-2 border-primary-foreground flex items-center justify-center font-bold text-xs ${
                          project.trustScore >= 90
                            ? "bg-primary"
                            : project.trustScore >= 70
                              ? "bg-amber-500"
                              : "bg-orange-500"
                        } text-primary-foreground`}
                      >
                        {project.trustScore}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Project Details Panel */}
          {selectedProject && (
            <div className="w-full md:w-96">
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex-1">{selectedProject.name}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-muted-foreground hover:text-foreground text-lg"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="pb-4 border-b border-border">
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Location</p>
                    <p className="text-sm text-foreground">
                      {selectedProject.location.district}, {selectedProject.location.state}
                    </p>
                  </div>

                  <div className="pb-4 border-b border-border">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">Trust Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-border rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            selectedProject.trustScore >= 90
                              ? "bg-success"
                              : selectedProject.trustScore >= 70
                                ? "bg-amber-500"
                                : "bg-orange-500"
                          }`}
                          style={{ width: `${selectedProject.trustScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground">{selectedProject.trustScore}%</span>
                    </div>
                  </div>

                  <div className="pb-4 border-b border-border">
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Type</p>
                    <p className="text-sm text-foreground">{selectedProject.type.replace(/_/g, " ").toUpperCase()}</p>
                  </div>

                  <div className="pb-4 border-b border-border">
                    <p className="text-xs text-muted-foreground font-semibold mb-1">CO₂ Offset</p>
                    <p className="text-lg font-bold text-primary">
                      {selectedProject.estimatedCO2Tons.toLocaleString()} tons
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Available Credits</p>
                    <p className="text-sm text-foreground">{selectedProject.availableCredits.toLocaleString()} CBT</p>
                  </div>
                </div>

                <Link href={`/marketplace?project=${selectedProject.id}`}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6">
                    Invest Now
                  </Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
