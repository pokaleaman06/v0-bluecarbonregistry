"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressBar } from "@/components/wizard/progress-bar"
import { WizardStep } from "@/components/wizard/wizard-step"
import { Upload, MapPin, FileText, Zap, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const STEPS = ["Project Info", "Location", "Evidence", "AI Preview", "Mint & Verify"]

interface ProjectData {
  name: string
  type: string
  area: string
  district: string
  state: string
  coordinates: string
  description: string
  files: File[]
}

export default function ProjectUploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({})
  const [completed, setCompleted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setProjectData((prev) => ({ ...prev, files }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setCompleted(true)
    console.log("Project submitted:", projectData)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="project_owner" />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Amit Patel" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Upload Project</h1>
              <p className="text-muted-foreground mt-1">Register your carbon offset project with AI verification</p>
            </div>

            {!completed ? (
              <>
                <Card className="p-8">
                  <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />

                  {/* Step 1: Project Info */}
                  <WizardStep
                    stepNumber={1}
                    title="Project Information"
                    description="Tell us about your project"
                    isActive={currentStep === 1}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
                        <Input
                          name="name"
                          placeholder="e.g., Solar Farm Initiative"
                          value={projectData.name || ""}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Project Type</label>
                        <select
                          name="type"
                          value={projectData.type || ""}
                          onChange={handleInputChange}
                          className="cs-input w-full"
                        >
                          <option value="">Select type...</option>
                          <option value="renewable_energy">Renewable Energy</option>
                          <option value="nature_based">Nature-Based</option>
                          <option value="land_restoration">Land Restoration</option>
                          <option value="methane_reduction">Methane Reduction</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Project Area (km²)</label>
                        <Input
                          name="area"
                          type="number"
                          placeholder="e.g., 50"
                          value={projectData.area || ""}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                        <textarea
                          name="description"
                          placeholder="Describe your project..."
                          value={projectData.description || ""}
                          onChange={handleInputChange}
                          className="cs-input w-full h-24 resize-none"
                        />
                      </div>
                    </div>
                  </WizardStep>

                  {/* Step 2: Location */}
                  <WizardStep
                    stepNumber={2}
                    title="Project Location"
                    description="Specify the geographic location of your project"
                    isActive={currentStep === 2}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">State</label>
                        <select
                          name="state"
                          value={projectData.state || ""}
                          onChange={handleInputChange}
                          className="cs-input w-full"
                        >
                          <option value="">Select state...</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="gujarao">Gujarat</option>
                          <option value="tamil_nadu">Tamil Nadu</option>
                          <option value="karnataka">Karnataka</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">District</label>
                        <Input
                          name="district"
                          placeholder="e.g., Pune"
                          value={projectData.district || ""}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Coordinates (lat, lng)</label>
                        <Input
                          name="coordinates"
                          placeholder="e.g., 18.5204, 73.8567"
                          value={projectData.coordinates || ""}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <MapPin className="w-5 h-5 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Map preview will appear here. Current location: {projectData.district || "Not set"},{" "}
                          {projectData.state || "Not set"}
                        </p>
                      </div>
                    </div>
                  </WizardStep>

                  {/* Step 3: Evidence */}
                  <WizardStep
                    stepNumber={3}
                    title="Upload Evidence"
                    description="Upload satellite imagery, documents, or monitoring data"
                    isActive={currentStep === 3}
                  >
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <label className="cursor-pointer">
                          <p className="font-semibold text-foreground mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground mb-4">PNG, JPG, PDF up to 10MB</p>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.pdf,.csv"
                          />
                          <Button variant="outline">Select Files</Button>
                        </label>
                      </div>
                      {projectData.files && projectData.files.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-2">Uploaded Files:</p>
                          <ul className="space-y-2">
                            {projectData.files.map((file) => (
                              <li key={file.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                {file.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </WizardStep>

                  {/* Step 4: AI Preview */}
                  <WizardStep
                    stepNumber={4}
                    title="AI Verification Preview"
                    description="Preview AI analysis of your project"
                    isActive={currentStep === 4}
                  >
                    <div className="space-y-4">
                      <Card className="p-6 bg-card/50">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Satellite Analysis</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-4 bg-background rounded-lg">
                            <p className="text-xs text-muted-foreground font-semibold mb-2">NDVI Score</p>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-primary">0.68</span>
                              <span className="text-xs text-muted-foreground">/1.0</span>
                            </div>
                          </div>
                          <div className="p-4 bg-background rounded-lg">
                            <p className="text-xs text-muted-foreground font-semibold mb-2">Confidence</p>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-primary">98%</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-aqua/20 rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Satellite imagery preview</p>
                        </div>
                      </Card>
                      <Card className="p-6 bg-card/50">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Estimated Carbon Offset</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Biomass Estimate</span>
                            <span className="font-semibold text-foreground">125.5 tons</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">CO₂ Equivalent</span>
                            <span className="font-semibold text-foreground">5,000 tons</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Estimated Credits</span>
                            <span className="font-bold text-primary text-lg">5,000 CBT</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </WizardStep>

                  {/* Step 5: Mint & Verify */}
                  <WizardStep
                    stepNumber={5}
                    title="Mint & Register"
                    description="Register your project on the blockchain"
                    isActive={currentStep === 5}
                  >
                    <div className="space-y-4">
                      <Card className="p-6 bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-4">
                          <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">Ready to Register</h3>
                            <p className="text-sm text-muted-foreground">
                              Your project will be registered on the blockchain and verified by our AI system. This
                              process typically takes 24-48 hours.
                            </p>
                          </div>
                        </div>
                      </Card>

                      <div className="bg-card rounded-lg p-6 space-y-3">
                        <h4 className="font-semibold text-foreground mb-4">Transaction Summary</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Project Name</span>
                          <span className="font-semibold text-foreground">{projectData.name || "Not set"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Credits</span>
                          <span className="font-semibold text-foreground">5,000 CBT</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gas Fee</span>
                          <span className="font-semibold text-foreground">~₹250</span>
                        </div>
                      </div>
                    </div>
                  </WizardStep>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  {currentStep === STEPS.length ? (
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit Project
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              // Success View
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Project Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  Your project has been submitted for AI verification. You'll be notified once verification is complete.
                </p>
                <div className="bg-card/50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Project ID:</strong> proj_pending_12345
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Status:</strong> Pending AI Review
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link href="/projects" className="flex-1">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      View Projects
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
