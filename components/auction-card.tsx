"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Users, Heart, History } from "lucide-react"

interface AuctionItem {
  id: string
  title: string
  image: string
  currentBid: number
  bidCount: number
  endsAt: Date
  category: string
}

interface BidRecord {
  bidder: string
  amount: number
  timestamp: string
}

function getTimeRemaining(endsAt: Date) {
  const total = endsAt.getTime() - Date.now()
  if (total <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true }

  const hours = Math.floor(total / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, expired: false }
}

// Mock bid history per auction
const mockBidHistory: Record<string, BidRecord[]> = {
  "1": [
    { bidder: "John D.", amount: 12500, timestamp: "Feb 10, 2026 3:42:18 PM" },
    { bidder: "Sarah M.", amount: 12000, timestamp: "Feb 10, 2026 2:15:44 PM" },
    { bidder: "Emma W.", amount: 11500, timestamp: "Feb 9, 2026 10:20:55 AM" },
  ],
  "2": [
    { bidder: "Mike J.", amount: 3200, timestamp: "Feb 10, 2026 1:30:22 PM" },
    { bidder: "Alex K.", amount: 2900, timestamp: "Feb 9, 2026 5:12:30 PM" },
  ],
  "3": [
    { bidder: "Emma W.", amount: 2800, timestamp: "Feb 10, 2026 12:05:11 PM" },
    { bidder: "John D.", amount: 2500, timestamp: "Feb 9, 2026 8:45:00 AM" },
  ],
  "4": [
    { bidder: "Sarah M.", amount: 18500, timestamp: "Feb 10, 2026 11:30:00 AM" },
    { bidder: "Mike J.", amount: 17800, timestamp: "Feb 9, 2026 3:22:15 PM" },
  ],
  "5": [
    { bidder: "John D.", amount: 45000, timestamp: "Feb 8, 2026 5:58:47 PM" },
    { bidder: "Alex K.", amount: 44500, timestamp: "Feb 8, 2026 5:45:30 PM" },
    { bidder: "Emma W.", amount: 43000, timestamp: "Feb 8, 2026 4:10:22 PM" },
  ],
  "6": [
    { bidder: "Mike J.", amount: 4200, timestamp: "Feb 10, 2026 9:15:00 AM" },
    { bidder: "Sarah M.", amount: 3800, timestamp: "Feb 9, 2026 7:00:00 PM" },
  ],
}

export function AuctionCard({ item }: { item: AuctionItem }) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(item.endsAt))
  const [isFavourited, setIsFavourited] = useState(false)
  const [bidAmount, setBidAmount] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(item.endsAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [item.endsAt])

  const formatTime = () => {
    if (timeRemaining.expired) return "Ended"
    const { hours, minutes, seconds } = timeRemaining
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const bidHistory = mockBidHistory[item.id] || []

  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
          {item.category}
        </Badge>
        <button
          onClick={() => setIsFavourited(!isFavourited)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background"
          aria-label={isFavourited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavourited ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-1 text-base font-medium">{item.title}</h3>

        <div className="mb-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className={timeRemaining.expired ? "text-destructive" : ""}>{formatTime()}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{item.bidCount} bids</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Bid</p>
            <p className="text-lg font-semibold">${item.currentBid.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Bid History Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <History className="h-4 w-4" />
                  <span className="sr-only">View bid history</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Bid History</DialogTitle>
                  <DialogDescription>{item.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bidHistory.length > 0 ? (
                    bidHistory.map((bid, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{bid.bidder}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{bid.timestamp}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${bid.amount.toLocaleString()}</p>
                          {idx === 0 && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Highest</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">No bids yet</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Place Bid Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" disabled={timeRemaining.expired}>
                  {timeRemaining.expired ? "Ended" : "Place Bid"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Place a Bid</DialogTitle>
                  <DialogDescription>{item.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-secondary/50 p-3">
                    <p className="text-sm text-muted-foreground">Current highest bid</p>
                    <p className="text-2xl font-bold">${item.currentBid.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`bid-${item.id}`} className="text-sm font-medium">
                      Your bid amount ($)
                    </label>
                    <Input
                      id={`bid-${item.id}`}
                      type="number"
                      placeholder={`Min $${(item.currentBid + 100).toLocaleString()}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="bg-secondary border-border"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: ${(item.currentBid + 100).toLocaleString()}
                    </p>
                  </div>
                  <Button className="w-full">Confirm Bid</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
