"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Gavel,
  Package,
  Heart,
  Clock,
  TrendingUp,
  Users,
  Plus,
  DollarSign,
  LogOut,
  ListOrdered,
  Trophy,
  Loader2,
  AlertCircle,
} from "lucide-react"

interface AdminStats {
  totalAuctions: number
  activeAuctions: number
  totalUsers: number
  totalBidVolume: number
}

interface AdminItem {
  auction_item_id: number
  item_id: number
  title: string
  description: string | null
  starting_price: number
  status: string
  auction_id: number
  auction_name: string
  auction_status: string
  scheduled_ends_at: string
  bid_count: number
  highest_bid: number | null
}

interface AdminBid {
  bid_id: number
  amount: number
  status: string
  created_at: string
  display_name: string
  email: string
  item_title: string
  auction_name: string
  auction_item_id: number
}

interface WishlistUser {
  userId: number
  displayName: string
  email: string
  items: { itemId: number; title: string; addedAt: string }[]
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  })
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [items, setItems] = useState<AdminItem[]>([])
  const [allBids, setAllBids] = useState<AdminBid[]>([])
  const [wishlists, setWishlists] = useState<WishlistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [bidFilter, setBidFilter] = useState("")
  const [addError, setAddError] = useState("")
  const [addLoading, setAddLoading] = useState(false)

  // Add item form state
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newStartingBid, setNewStartingBid] = useState("")
  const [newEndDate, setNewEndDate] = useState("")
  const [newUsdValue, setNewUsdValue] = useState("")

  const fetchData = useCallback(async () => {
    try {
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()

      if (!sessionData.user || sessionData.user.role !== "ADMIN") {
        router.push("/login")
        return
      }

      const [statsRes, itemsRes, bidsRes, wishlistsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/items"),
        fetch("/api/admin/bids"),
        fetch("/api/admin/wishlists"),
      ])

      const [statsData, itemsData, bidsData, wishlistsData] = await Promise.all([
        statsRes.json(),
        itemsRes.json(),
        bidsRes.json(),
        wishlistsRes.json(),
      ])

      setStats(statsData.stats || { totalAuctions: 0, activeAuctions: 0, totalUsers: 0, totalBidVolume: 0 })
      setItems(itemsData.items || [])
      setAllBids(bidsData.bids || [])
      setWishlists(wishlistsData.wishlists || [])
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddItem = async () => {
    if (!newTitle || !newEndDate) {
      setAddError("Title and end date are required")
      return
    }

    setAddLoading(true)
    setAddError("")

    try {
      const res = await fetch("/api/admin/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          usdValue: Number.parseFloat(newUsdValue) || 0,
          startingBid: Math.round((Number.parseFloat(newStartingBid) || 0) * 100),
          auctionName: newTitle,
          endsAt: newEndDate,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setAddError(data.error || "Failed to add item")
        return
      }

      // Reset form and refresh
      setNewTitle("")
      setNewDescription("")
      setNewStartingBid("")
      setNewEndDate("")
      setNewUsdValue("")
      setShowAddForm(false)
      fetchData()
    } catch {
      setAddError("Network error")
    } finally {
      setAddLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const filteredBids = bidFilter
    ? allBids.filter(
        (b) =>
          b.item_title.toLowerCase().includes(bidFilter.toLowerCase()) ||
          b.display_name.toLowerCase().includes(bidFilter.toLowerCase())
      )
    : allBids

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Gavel className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Kogbucks Auction</span>
            </Link>
            <Badge className="bg-accent/20 text-accent">Admin</Badge>
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage auctions, review bids, and monitor user activity</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Package className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalAuctions}</p>
                  <p className="text-sm text-muted-foreground">Total Auctions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeAuctions}</p>
                  <p className="text-sm text-muted-foreground">Active Auctions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <DollarSign className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${(stats.totalBidVolume / 100).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Bid Volume</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="items" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Items</span>
            </TabsTrigger>
            <TabsTrigger value="bids" className="gap-2">
              <ListOrdered className="h-4 w-4" />
              <span className="hidden sm:inline">All Bids</span>
            </TabsTrigger>
            <TabsTrigger value="wishlists" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">User Wishlists</span>
            </TabsTrigger>
          </TabsList>

          {/* Manage Items Tab */}
          <TabsContent value="items">
            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Auction Items</CardTitle>
                      <CardDescription>Add and manage items in auctions</CardDescription>
                    </div>
                    <Button className="gap-2" onClick={() => setShowAddForm(!showAddForm)}>
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>

                {showAddForm && (
                  <CardContent className="border-t border-border pt-6">
                    {addError && (
                      <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{addError}</span>
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="itemTitle">Item Title</Label>
                        <Input
                          id="itemTitle"
                          placeholder="Enter item title..."
                          className="bg-secondary border-border"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startingBid">Starting Bid ($)</Label>
                        <Input
                          id="startingBid"
                          type="number"
                          placeholder="0.00"
                          className="bg-secondary border-border"
                          value={newStartingBid}
                          onChange={(e) => setNewStartingBid(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="usdValue">USD Value ($)</Label>
                        <Input
                          id="usdValue"
                          type="number"
                          placeholder="0.00"
                          className="bg-secondary border-border"
                          value={newUsdValue}
                          onChange={(e) => setNewUsdValue(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          className="bg-secondary border-border"
                          value={newEndDate}
                          onChange={(e) => setNewEndDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          rows={3}
                          placeholder="Describe the item..."
                          className="flex w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Button className="w-full" onClick={handleAddItem} disabled={addLoading}>
                          {addLoading ? "Adding..." : "Add Auction Item"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Item List */}
              {items.length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No auction items found. Add your first item above.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.auction_item_id} className="border-border bg-card">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                Start: ${(item.starting_price / 100).toLocaleString()}
                              </span>
                              {item.highest_bid && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3.5 w-3.5" />
                                  Highest: ${(item.highest_bid / 100).toLocaleString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {item.bid_count} bids
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Ends: {formatDateTime(item.scheduled_ends_at)}
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={
                              item.auction_status === "LIVE"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : item.auction_status === "CLOSED"
                                  ? "bg-secondary text-muted-foreground"
                                  : "bg-accent/20 text-accent"
                            }
                          >
                            {item.auction_status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* All Bids Tab - with timestamps for declaring winners */}
          <TabsContent value="bids">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">All Bids with Timestamps</CardTitle>
                    <CardDescription>Review bid timestamps to declare winners</CardDescription>
                  </div>
                  <Input
                    placeholder="Filter by item or bidder..."
                    className="bg-secondary border-border sm:max-w-xs"
                    value={bidFilter}
                    onChange={(e) => setBidFilter(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredBids.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No bids found.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredBids.map((bid) => (
                      <div
                        key={bid.bid_id}
                        className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bid.item_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {bid.display_name} ({bid.email})
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDateTime(bid.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-semibold">
                            ${(bid.amount / 100).toLocaleString()}
                          </p>
                          <Badge
                            className={
                              bid.status === "WINNING" || bid.status === "ACTIVE"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : bid.status === "OUTBID"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-secondary text-muted-foreground"
                            }
                          >
                            {bid.status}
                          </Badge>
                          {bid.status === "WINNING" && (
                            <Button size="sm" variant="outline" className="gap-1 border-accent text-accent bg-transparent">
                              <Trophy className="h-3.5 w-3.5" />
                              Declare Winner
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Wishlists Tab */}
          <TabsContent value="wishlists">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">User Wishlists</CardTitle>
                <CardDescription>Review what users want so you can add those items</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlists.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No wishlist data yet.</p>
                ) : (
                  <div className="space-y-6">
                    {wishlists.map((wl) => (
                      <div key={wl.userId} className="rounded-lg border border-border bg-secondary/50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{wl.displayName}</p>
                            <p className="text-sm text-muted-foreground">{wl.email}</p>
                          </div>
                          <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                            {wl.items.length} item{wl.items.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {wl.items.map((item) => (
                            <div
                              key={item.itemId}
                              className="flex items-center justify-between rounded-md bg-background/50 px-3 py-2 text-sm"
                            >
                              <span>{item.title}</span>
                              <span className="text-xs text-muted-foreground">
                                Added: {formatDateTime(item.addedAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
