"use client"

import Link from "next/link"
import { ArrowRight, Leaf, Zap, Shield, MapPin, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CarboSafe</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm">
            <a href="#how-it-works" className="hover:text-primary transition">
              How it works
            </a>
            <a href="#features" className="hover:text-primary transition">
              Features
            </a>
            <a href="#projects" className="hover:text-primary transition">
              Projects
            </a>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">AI + Blockchain Verified</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Empower Sustainability with <span className="text-primary">AI & Blockchain</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            CarboSafe brings transparency to carbon credits. Buy verified offsets, track your impact on an interactive
            map, and earn rewards for sustainable actions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-aqua/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How CarboSafe Works</h2>
            <p className="text-lg text-muted-foreground">Simple steps to make a real environmental impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "AI Verification",
                description: "Advanced AI analyzes satellite imagery to verify carbon credits with 98%+ accuracy",
              },
              {
                icon: Zap,
                title: "Blockchain Certified",
                description: "Every credit is registered on blockchain for complete transparency and immutability",
              },
              {
                icon: TrendingUp,
                title: "Track & Earn",
                description: "Monitor your impact in real-time and earn CarboPoints redeemable for rewards",
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="cs-card p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Powerful Features</h2>
          <p className="text-lg text-muted-foreground text-center mb-16">
            Everything you need to make climate action count
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="cs-card p-8">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
              <p className="text-muted-foreground">
                Visualize verified carbon projects across India with real-time trust scores
              </p>
            </div>
            <div className="cs-card p-8">
              <Award className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Rewards Program</h3>
              <p className="text-muted-foreground">
                Earn CarboPoints and exclusive NFT badges for your sustainability journey
              </p>
            </div>
            <div className="cs-card p-8">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Trust Score</h3>
              <p className="text-muted-foreground">Transparent verification metrics powered by satellite AI analysis</p>
            </div>
            <div className="cs-card p-8">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Real Impact</h3>
              <p className="text-muted-foreground">
                Track your carbon offset and contribute to verified environmental projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands offsetting their carbon footprint with verified credits
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 lg:px-8 py-12 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">CarboSafe</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-verified carbon credits for a sustainable future</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Map
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CarboSafe. All rights reserved. Building a sustainable future with blockchain & AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
