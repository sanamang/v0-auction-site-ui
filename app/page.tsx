import { Header } from "@/components/header"
import { AuctionCard } from "@/components/auction-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, TrendingUp, Shield, Clock } from "lucide-react"

const categories = [
  "All",
  "Electronics",
  "Art & Collectibles",
  "Jewelry",
  "Vehicles",
  "Fashion",
  "Home & Garden",
]

const featuredAuctions = [
  {
    id: "1",
    title: "Vintage Rolex Submariner 1968",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    currentBid: 12500,
    bidCount: 47,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
    category: "Jewelry",
  },
  {
    id: "2",
    title: "Original Oil Painting - Abstract Seascape",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop",
    currentBid: 3200,
    bidCount: 23,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
    category: "Art & Collectibles",
  },
  {
    id: "3",
    title: "MacBook Pro M3 Max 16\" - Sealed",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    currentBid: 2800,
    bidCount: 31,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    category: "Electronics",
  },
  {
    id: "4",
    title: "Hermès Birkin Bag 35cm - Black Togo",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop",
    currentBid: 18500,
    bidCount: 62,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
    category: "Fashion",
  },
  {
    id: "5",
    title: "1967 Ford Mustang Fastback",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop",
    currentBid: 45000,
    bidCount: 89,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    category: "Vehicles",
  },
  {
    id: "6",
    title: "Mid-Century Modern Eames Lounge Chair",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop",
    currentBid: 4200,
    bidCount: 18,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
    category: "Home & Garden",
  },
]

export default function HomePage() {
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

      {/* Stats Section */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">15K+</p>
            <p className="text-sm text-muted-foreground">Active Auctions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">$2.4M</p>
            <p className="text-sm text-muted-foreground">Items Sold</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">50K+</p>
            <p className="text-sm text-muted-foreground">Happy Bidders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">99.2%</p>
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category, index) => (
            <Badge
              key={category}
              variant={index === 0 ? "default" : "secondary"}
              className="cursor-pointer px-4 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured Auctions</h2>
            <p className="text-sm text-muted-foreground">Hot items ending soon</p>
          </div>
          <Button variant="ghost" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredAuctions.map((item) => (
            <AuctionCard key={item.id} item={item} />
          ))}
        </div>
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
