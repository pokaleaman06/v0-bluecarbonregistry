"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, Copy, Download, Share2 } from "lucide-react"
import projectsData from "@/data/projects.json"

type CheckoutStep = "payment" | "processing" | "minting" | "success"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<CheckoutStep>("payment")
  const [transactionHash, setTransactionHash] = useState("")

  const projectId = searchParams.get("projectId")
  const amount = searchParams.get("amount")
  const currency = searchParams.get("currency")

  const project = projectsData.projects.find((p) => p.id === projectId)
  if (!project) return null

  const handlePayment = async () => {
    setStep("processing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setTransactionHash(`0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`)
    setStep("minting")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStep("success")
  }

  const totalAmount =
    currency === "kg" ? (Number.parseInt(amount || "0") * project.pricePerTon) / 1000 : Number.parseInt(amount || "0")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-2xl mx-auto">
            {step === "success" ? (
              // Success Screen
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  Your carbon credits have been purchased and registered on the blockchain. Your NFT certificate is
                  being minted.
                </p>

                <div className="bg-card/50 p-6 rounded-lg mb-8 text-left space-y-4">
                  <div className="flex justify-between pb-3 border-b border-border">
                    <span className="text-muted-foreground">Project</span>
                    <span className="font-semibold text-foreground">{project.name}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-border">
                    <span className="text-muted-foreground">Credits Purchased</span>
                    <span className="font-semibold text-foreground">
                      {amount} {currency === "kg" ? "kg" : "₹"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-border">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction</span>
                    <code className="text-xs font-mono text-foreground break-all">
                      {transactionHash.slice(0, 16)}...
                    </code>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(transactionHash)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Transaction Hash
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on LinkedIn
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Back to Dashboard
                  </Button>
                  <Button onClick={() => router.push("/wallet")} variant="outline" className="w-full">
                    View My Rewards
                  </Button>
                </div>
              </Card>
            ) : (
              // Payment/Processing Screen
              <Card className="p-8">
                <h1 className="text-2xl font-bold text-foreground mb-8">Complete Your Purchase</h1>

                {/* Progress */}
                <div className="mb-8 flex gap-2">
                  {(["payment", "processing", "minting"] as const).map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step === s
                            ? "bg-primary text-primary-foreground"
                            : ["processing", "minting", "success"].includes(step) && ["payment"].includes(s)
                              ? "bg-success text-success-foreground"
                              : "bg-border text-muted-foreground"
                        }`}
                      >
                        {["payment", "processing", "minting"].indexOf(s) <
                        ["payment", "processing", "minting"].indexOf(step)
                          ? "✓"
                          : i + 1}
                      </div>
                      {i < 2 && <div className="w-4 h-0.5 bg-border" />}
                    </div>
                  ))}
                </div>

                {step === "payment" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                      <div className="bg-card/50 p-4 rounded-lg space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{project.name}</span>
                          <span className="font-semibold text-foreground">
                            {amount} {currency}
                          </span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-border">
                          <span className="text-muted-foreground">Unit Price</span>
                          <span className="font-semibold text-foreground">₹{project.pricePerTon}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="text-lg font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
                      <select className="cs-input w-full">
                        <option>UPI / Debit Card</option>
                        <option>Credit Card</option>
                        <option>Net Banking</option>
                      </select>
                    </div>

                    <Button
                      onClick={handlePayment}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                    >
                      Pay ₹{totalAmount.toLocaleString()}
                    </Button>
                  </div>
                )}

                {step === "processing" && (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Processing Payment</h2>
                    <p className="text-muted-foreground">Your transaction is being processed...</p>
                  </div>
                )}

                {step === "minting" && (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Minting Carbon Credits</h2>
                    <p className="text-muted-foreground">Creating your NFT certificate...</p>
                    <div className="mt-6 p-4 bg-card/50 rounded-lg">
                      <code className="text-xs font-mono text-foreground break-all">{transactionHash}</code>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
