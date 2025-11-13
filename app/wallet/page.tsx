"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Gift, Trophy, Zap, TrendingUp, Clock } from "lucide-react"

const rewards = [
  { id: 1, name: "Eco Champion", icon: Trophy, color: "text-amber-500", unlocked: true },
  { id: 2, name: "100 Tons Offset", icon: Zap, color: "text-primary", unlocked: true },
  { id: 3, name: "Climate Hero", icon: TrendingUp, color: "text-success", unlocked: false },
]

const nfts = [
  { id: 1, name: "Solar Project NFT", project: "Solar Farm - Maharashtra", date: "2024-11-10" },
  { id: 2, name: "Mangrove NFT", project: "Mangrove Restoration", date: "2024-11-09" },
]

export default function WalletPage() {
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<any>(null)

  const handleRedeem = (reward: any) => {
    setSelectedReward(reward)
    setShowRedeemModal(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-0">
        <Topbar userName="Raj Kumar" />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Wallet & Rewards</h1>
              <p className="text-muted-foreground mt-1">Track your CarboPoints, NFTs, and achievements</p>
            </div>

            {/* Balance Card */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-aqua/10 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-semibold mb-2">CarboPoints Balance</p>
                  <p className="text-5xl font-bold text-primary">12,250</p>
                </div>
                <Wallet className="w-16 h-16 text-primary/30" />
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Redeem Points</Button>
                <Button variant="outline">Transfer</Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Stats */}
              <Card className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-3">Total Offset</p>
                <p className="text-3xl font-bold text-foreground mb-2">245.5 tons</p>
                <p className="text-xs text-success font-semibold">+22% from last month</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-3">Active Investments</p>
                <p className="text-3xl font-bold text-foreground mb-2">4</p>
                <p className="text-xs text-muted-foreground">Generating carbon credits</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-3">NFT Certificates</p>
                <p className="text-3xl font-bold text-foreground mb-2">{nfts.length}</p>
                <p className="text-xs text-muted-foreground">Blockchain verified</p>
              </Card>
            </div>

            {/* Achievements & Badges */}
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Achievements & Badges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => {
                  const Icon = reward.icon
                  return (
                    <div
                      key={reward.id}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        reward.unlocked
                          ? "bg-card border-primary/20 hover:border-primary/40"
                          : "bg-card/50 border-border/50 opacity-50"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${reward.color}`} />
                      <h3 className="font-semibold text-foreground mb-2">{reward.name}</h3>
                      {reward.unlocked ? (
                        <Button size="sm" onClick={() => handleRedeem(reward)}>
                          <Gift className="w-3 h-3 mr-2" />
                          Redeem
                        </Button>
                      ) : (
                        <Button size="sm" disabled variant="outline">
                          <Clock className="w-3 h-3 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* NFT Certificates */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">NFT Certificates</h2>
              <div className="space-y-3">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    className="p-4 bg-card/50 border border-border rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{nft.name}</h3>
                      <p className="text-sm text-muted-foreground">{nft.project}</p>
                      <p className="text-xs text-muted-foreground mt-1">{nft.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8">
            <selectedReward.icon className={`w-12 h-12 ${selectedReward.color} mx-auto mb-4`} />
            <h2 className="text-2xl font-bold text-foreground text-center mb-6">{selectedReward.name}</h2>

            <div className="bg-card/50 p-4 rounded-lg mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">You earned</p>
              <p className="text-2xl font-bold text-primary">500 CarboPoints</p>
              <p className="text-xs text-muted-foreground mt-2">Added to your wallet</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowRedeemModal(false)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Claim Reward
              </Button>
              <Button onClick={() => setShowRedeemModal(false)} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
