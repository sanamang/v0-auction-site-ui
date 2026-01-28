"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"

interface AuctionItem {
  id: string
  title: string
  image: string
  currentBid: number
  bidCount: number
  endsAt: Date
  category: string
}

function getTimeRemaining(endsAt: Date) {
  const total = endsAt.getTime() - Date.now()
  if (total <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true }

  const hours = Math.floor(total / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, expired: false }
}

export function AuctionCard({ item }: { item: AuctionItem }) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(item.endsAt))

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
          <Button size="sm" disabled={timeRemaining.expired}>
            {timeRemaining.expired ? "Ended" : "Place Bid"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
