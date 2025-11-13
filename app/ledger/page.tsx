"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Copy, ExternalLink, CheckCircle2, Clock } from "lucide-react"
import transactionsData from "@/data/transactions.json"

interface Transaction {
  id: string
  projectId: string
  userId: string
  txHash: string
  tokenType: string
  amount: number
  pricePerUnit: number
  totalInr: number
  status: "completed" | "pending"
  timestamp: string
}

export default function LedgerPage() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Blockchain Ledger</h1>
              <p className="text-muted-foreground mt-1">Track all your carbon credit transactions on the blockchain</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">Total Transactions</p>
                <p className="text-3xl font-bold text-foreground">{transactionsData.transactions.length}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">Completed</p>
                <p className="text-3xl font-bold text-success">
                  {transactionsData.transactions.filter((t) => t.status === "completed").length}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">Total Investment</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{transactionsData.transactions.reduce((sum, t) => sum + t.totalInr, 0).toLocaleString()}
                </p>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Transaction History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Token</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsData.transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-border/50 hover:bg-accent/5 cursor-pointer"
                        onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                      >
                        <td className="py-4 px-4 text-foreground text-sm">{formatDate(tx.timestamp)}</td>
                        <td className="py-4 px-4 text-foreground text-sm font-semibold">{tx.tokenType}</td>
                        <td className="py-4 px-4 text-foreground text-sm">{tx.amount.toLocaleString()}</td>
                        <td className="py-4 px-4 text-primary font-bold">₹{tx.totalInr.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                              tx.status === "completed"
                                ? "bg-success/20 text-success"
                                : "bg-amber-500/20 text-amber-600"
                            }`}
                          >
                            {tx.status === "completed" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-xs font-mono">
                          {tx.txHash.slice(0, 12)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expanded Transaction Details */}
              {expandedTx && (
                <div className="mt-6 p-4 bg-card/50 border border-border rounded-lg">
                  {transactionsData.transactions.find((t) => t.id === expandedTx) && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground mb-4">Transaction Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Transaction ID</p>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-foreground break-all">
                              {transactionsData.transactions.find((t) => t.id === expandedTx)?.txHash}
                            </code>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  transactionsData.transactions.find((t) => t.id === expandedTx)?.txHash || "",
                                )
                              }
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Status</p>
                          <p className="text-foreground font-semibold capitalize">
                            {transactionsData.transactions.find((t) => t.id === expandedTx)?.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Unit Price</p>
                          <p className="text-foreground font-semibold">
                            ₹{transactionsData.transactions.find((t) => t.id === expandedTx)?.pricePerUnit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">View on Blockchain</p>
                          <a
                            href="#"
                            className="text-primary hover:underline flex items-center gap-1 text-sm font-semibold"
                          >
                            Etherscan <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
