"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"
import projectsData from "@/data/projects.json"

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="individual" />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground mt-1">Browse and invest in verified carbon offset projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData.projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-aqua/20 relative overflow-hidden">
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{project.name}</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {project.location.district}, {project.location.state}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Trust Score</p>
                          <div className="w-full bg-border rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${project.trustScore}%` }} />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary">{project.trustScore}%</span>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Price per ton</span>
                        <span className="font-semibold text-foreground">₹{project.pricePerTon}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-semibold text-foreground">
                          {project.availableCredits.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/marketplace?project=${project.id}`}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Invest Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
