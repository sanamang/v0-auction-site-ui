"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { AuctionCard } from "@/components/auction-card"
import type { AuctionItem } from "@/components/auction-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, TrendingUp, Shield, Clock, Loader2, Package } from "lucide-react"

export default function HomePage() {
  const [auctions, setAuctions] = useState<AuctionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const res = await fetch("/api/auctions")
        const data = await res.json()
        setAuctions(data.items || [])
      } catch {
        setAuctions([])
      } finally {
        setLoading(false)
      }
    }
    fetchAuctions()
  }, [])

  const filteredAuctions = searchQuery
    ? auctions.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.auction_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : auctions

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Discover Unique Items,
              <br />
              Bid with Confidence
            </h1>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Join thousands of collectors and enthusiasts. Find rare items, place competitive bids, and win auctions from trusted sellers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search auctions..."
                  className="h-11 pl-10 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-11 gap-2">
                Browse Auctions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Live Auctions</h2>
            <p className="text-sm text-muted-foreground">Browse items from the database</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No auctions found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Check back later for new items"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAuctions.map((item) => (
              <AuctionCard key={item.auction_item_id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Shield className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">Secure Transactions</h3>
              <p className="text-sm text-muted-foreground">
                All payments are protected with bank-level encryption and buyer protection.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">Real-time Bidding</h3>
              <p className="text-sm text-muted-foreground">
                Get instant updates on your bids and never miss an opportunity to win.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Clock className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">24/7 Auctions</h3>
              <p className="text-sm text-muted-foreground">
                Browse and bid anytime, anywhere. New auctions start every hour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>&copy; 2026 Kogbucks Auction. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
