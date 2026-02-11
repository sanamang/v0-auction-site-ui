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
import { Clock, Users, Heart, History, Package, AlertCircle } from "lucide-react"

export interface AuctionItem {
  auction_item_id: number
  auction_id: number
  item_id: number
  title: string
  description: string | null
  usd_value: number
  starting_price: number
  status: string
  auction_name: string
  auction_status: string
  scheduled_ends_at: string
  ends_at: string | null
  image_url: string | null
  bid_count: number
  highest_bid: number | null
}

interface BidRecord {
  bid_id: number
  amount: number
  status: string
  created_at: string
  display_name: string
}

function getTimeRemaining(endsAt: string) {
  const total = new Date(endsAt).getTime() - Date.now()
  if (total <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true }

  const hours = Math.floor(total / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, expired: false }
}

export function AuctionCard({ item }: { item: AuctionItem }) {
  const endTime = item.ends_at || item.scheduled_ends_at
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(endTime))
  const [isFavourited, setIsFavourited] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidHistory, setBidHistory] = useState<BidRecord[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [bidError, setBidError] = useState("")
  const [bidLoading, setBidLoading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(endTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const formatTime = () => {
    if (timeRemaining.expired) return "Ended"
    const { hours, minutes, seconds } = timeRemaining
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const currentBid = item.highest_bid ? item.highest_bid / 100 : item.starting_price / 100
  const minBid = currentBid + 1

  const fetchBidHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch(`/api/auctions/bids?auctionItemId=${item.auction_item_id}`)
      const data = await res.json()
      setBidHistory(data.bids || [])
    } catch {
      setBidHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFavourite = async () => {
    const newState = !isFavourited
    setIsFavourited(newState)
    try {
      if (newState) {
        await fetch("/api/account/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.item_id }),
        })
      } else {
        await fetch("/api/account/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.item_id }),
        })
      }
    } catch {
      setIsFavourited(!newState)
    }
  }

  const handlePlaceBid = async () => {
    const amount = Math.round(Number.parseFloat(bidAmount) * 100)
    if (!amount || amount < minBid * 100) {
      setBidError(`Minimum bid is $${minBid.toLocaleString()}`)
      return
    }

    setBidLoading(true)
    setBidError("")

    try {
      const res = await fetch("/api/auctions/place-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionItemId: item.auction_item_id,
          auctionId: item.auction_id,
          amount,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setBidError(data.error || "Failed to place bid")
        return
      }

      setBidAmount("")
      setBidError("")
    } catch {
      setBidError("Network error")
    } finally {
      setBidLoading(false)
    }
  }

  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.image_url ? (
          <img
            src={item.image_url || "/placeholder.svg"}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
          {item.auction_name}
        </Badge>
        <button
          onClick={handleFavourite}
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
            <span>{item.bid_count} bids</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Bid</p>
            <p className="text-lg font-semibold">${currentBid.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Bid History Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchBidHistory}>
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
                  {loadingHistory ? (
                    <p className="text-center text-sm text-muted-foreground py-4">Loading...</p>
                  ) : bidHistory.length > 0 ? (
                    bidHistory.map((bid) => (
                      <div
                        key={bid.bid_id}
                        className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{bid.display_name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(bid.created_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(bid.amount / 100).toLocaleString()}</p>
                          {bid.status === "WINNING" || bid.status === "ACTIVE" ? (
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Highest</Badge>
                          ) : null}
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
                  {bidError && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{bidError}</span>
                    </div>
                  )}
                  <div className="rounded-lg border border-border bg-secondary/50 p-3">
                    <p className="text-sm text-muted-foreground">Current highest bid</p>
                    <p className="text-2xl font-bold">${currentBid.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`bid-${item.auction_item_id}`} className="text-sm font-medium">
                      Your bid amount ($)
                    </label>
                    <Input
                      id={`bid-${item.auction_item_id}`}
                      type="number"
                      placeholder={`Min $${minBid.toLocaleString()}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="bg-secondary border-border"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: ${minBid.toLocaleString()}
                    </p>
                  </div>
                  <Button className="w-full" onClick={handlePlaceBid} disabled={bidLoading}>
                    {bidLoading ? "Placing bid..." : "Confirm Bid"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
