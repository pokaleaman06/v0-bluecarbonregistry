"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle2, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const verificationSteps = [
  { name: "Cloud Masking", status: "completed", duration: "2m" },
  { name: "NDVI Calculation", status: "completed", duration: "3m" },
  { name: "Biomass Estimation", status: "completed", duration: "4m" },
  { name: "CO₂ Calculation", status: "in-progress", duration: "~2m" },
  { name: "Final Report", status: "pending", duration: "~1m" },
]

const confidenceData = [
  { time: "0s", confidence: 0 },
  { time: "2m", confidence: 35 },
  { time: "5m", confidence: 62 },
  { time: "8m", confidence: 85 },
  { time: "10m", confidence: 98 },
]

export default function VerificationPage() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploading(true)
      setTimeout(() => setUploading(false), 2000)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="auditor" />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Audit Team" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">AI Verification</h1>
              <p className="text-muted-foreground mt-1">Monitor satellite analysis and project verification</p>
            </div>

            {/* Upload Section */}
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Upload Dataset</h2>
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold text-foreground mb-2">Upload satellite imagery</p>
                <p className="text-sm text-muted-foreground mb-6">GeoTIFF, PNG or CSV files</p>
                <label>
                  <input
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    multiple
                    accept=".tif,.tiff,.png,.csv"
                  />
                  <Button as="span" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {uploading ? "Uploading..." : "Select Files"}
                  </Button>
                </label>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Verification Pipeline */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Verification Pipeline</h2>
                  <div className="space-y-4">
                    {verificationSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-card/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {step.status === "completed" && <CheckCircle2 className="w-5 h-5 text-success" />}
                            {step.status === "in-progress" && <Clock className="w-5 h-5 text-primary animate-spin" />}
                            {step.status === "pending" && (
                              <div className="w-5 h-5 rounded-full border-2 border-border" />
                            )}
                            <span
                              className={`font-semibold ${
                                step.status === "completed" ? "text-success" : "text-foreground"
                              }`}
                            >
                              {step.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Duration: {step.duration}</p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            step.status === "completed"
                              ? "bg-success/20 text-success"
                              : step.status === "in-progress"
                                ? "bg-primary/20 text-primary"
                                : "bg-border text-muted-foreground"
                          }`}
                        >
                          {step.status === "in-progress" ? "Processing..." : step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Trust Score Gauge */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Trust Score</h3>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#00A86B"
                        strokeWidth="8"
                        strokeDasharray={`${(98 / 100) * 314} 314`}
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">98%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">High confidence verification</p>
                </div>
              </Card>
            </div>

            {/* Confidence Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Verification Timeline</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#00A86B"
                    strokeWidth={3}
                    dot={{ fill: "#00A86B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
