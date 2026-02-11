"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  LayoutDashboard,
  ListOrdered,
  Trash2,
  Eye,
  Calendar,
  Trophy,
  Monitor,
  Box,
  Layers,
} from "lucide-react"

// Mock data for admin
const dashboardStats = {
  totalAuctions: 342,
  activeAuctions: 48,
  totalUsers: 12450,
  totalRevenue: 2400000,
}

const auctionItems = [
  {
    id: "a1",
    title: "Vintage Rolex Submariner 1968",
    type: "physical",
    category: "Jewelry",
    startingBid: 8000,
    currentBid: 12500,
    bidCount: 47,
    status: "active",
    createdAt: "Feb 1, 2026",
    endsAt: "Feb 15, 2026 4:00 PM",
  },
  {
    id: "a2",
    title: "NFT Digital Art Collection - CyberPunk Series",
    type: "digital",
    category: "Art & Collectibles",
    startingBid: 500,
    currentBid: 3200,
    bidCount: 23,
    status: "active",
    createdAt: "Feb 3, 2026",
    endsAt: "Feb 18, 2026 12:00 PM",
  },
  {
    id: "a3",
    title: "Premium Gaming Bundle + Digital Game Codes",
    type: "hybrid",
    category: "Electronics",
    startingBid: 1200,
    currentBid: 2800,
    bidCount: 31,
    status: "active",
    createdAt: "Feb 5, 2026",
    endsAt: "Feb 14, 2026 8:00 PM",
  },
  {
    id: "a4",
    title: "1967 Ford Mustang Fastback",
    type: "physical",
    category: "Vehicles",
    startingBid: 30000,
    currentBid: 45000,
    bidCount: 89,
    status: "ended",
    createdAt: "Jan 20, 2026",
    endsAt: "Feb 8, 2026 6:00 PM",
  },
]

const allBids = [
  {
    id: "b1",
    auctionTitle: "Vintage Rolex Submariner 1968",
    bidder: "john.doe@example.com",
    bidderName: "John Doe",
    amount: 12500,
    timestamp: "Feb 10, 2026 at 3:42:18 PM",
    isWinning: true,
  },
  {
    id: "b2",
    auctionTitle: "Vintage Rolex Submariner 1968",
    bidder: "sarah.m@example.com",
    bidderName: "Sarah Miller",
    amount: 12000,
    timestamp: "Feb 10, 2026 at 2:15:44 PM",
    isWinning: false,
  },
  {
    id: "b3",
    auctionTitle: "NFT Digital Art Collection - CyberPunk Series",
    bidder: "mike.j@example.com",
    bidderName: "Mike Johnson",
    amount: 3200,
    timestamp: "Feb 10, 2026 at 1:30:22 PM",
    isWinning: true,
  },
  {
    id: "b4",
    auctionTitle: "Premium Gaming Bundle + Digital Game Codes",
    bidder: "emma.w@example.com",
    bidderName: "Emma Wilson",
    amount: 2800,
    timestamp: "Feb 10, 2026 at 12:05:11 PM",
    isWinning: true,
  },
  {
    id: "b5",
    auctionTitle: "1967 Ford Mustang Fastback",
    bidder: "john.doe@example.com",
    bidderName: "John Doe",
    amount: 45000,
    timestamp: "Feb 8, 2026 at 5:58:47 PM",
    isWinning: true,
  },
  {
    id: "b6",
    auctionTitle: "1967 Ford Mustang Fastback",
    bidder: "alex.k@example.com",
    bidderName: "Alex Kim",
    amount: 44500,
    timestamp: "Feb 8, 2026 at 5:45:30 PM",
    isWinning: false,
  },
  {
    id: "b7",
    auctionTitle: "Vintage Rolex Submariner 1968",
    bidder: "emma.w@example.com",
    bidderName: "Emma Wilson",
    amount: 11500,
    timestamp: "Feb 9, 2026 at 10:20:55 AM",
    isWinning: false,
  },
]

const userWishlists = [
  {
    userId: "u1",
    userName: "John Doe",
    email: "john.doe@example.com",
    items: [
      { title: "Vintage Leica M3 Camera", category: "Electronics" },
      { title: "First Edition Harry Potter Book Set", category: "Art & Collectibles" },
      { title: "Handcrafted Japanese Tea Set", category: "Home & Garden" },
    ],
  },
  {
    userId: "u2",
    userName: "Sarah Miller",
    email: "sarah.m@example.com",
    items: [
      { title: "Antique Persian Rug", category: "Home & Garden" },
      { title: "Signed Michael Jordan Jersey", category: "Art & Collectibles" },
    ],
  },
  {
    userId: "u3",
    userName: "Mike Johnson",
    email: "mike.j@example.com",
    items: [
      { title: "Limited Edition Nike Air Max", category: "Fashion" },
      { title: "Rare Pokemon Card Collection", category: "Art & Collectibles" },
      { title: "Vintage Gibson Les Paul Guitar", category: "Electronics" },
      { title: "Signed First Edition - The Great Gatsby", category: "Art & Collectibles" },
    ],
  },
  {
    userId: "u4",
    userName: "Emma Wilson",
    email: "emma.w@example.com",
    items: [
      { title: "Designer Chanel Handbag - Classic Flap", category: "Fashion" },
    ],
  },
]

const typeIcon = (type: string) => {
  switch (type) {
    case "physical":
      return <Box className="h-4 w-4" />
    case "digital":
      return <Monitor className="h-4 w-4" />
    case "hybrid":
      return <Layers className="h-4 w-4" />
    default:
      return <Box className="h-4 w-4" />
  }
}

const typeColor = (type: string) => {
  switch (type) {
    case "physical":
      return "bg-accent/20 text-accent"
    case "digital":
      return "bg-emerald-500/20 text-emerald-400"
    case "hybrid":
      return "bg-chart-4/20 text-chart-4"
    default:
      return "bg-secondary text-muted-foreground"
  }
}

export default function AdminPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemType, setNewItemType] = useState("physical")
  const [bidFilter, setBidFilter] = useState("all")

  const filteredBids = bidFilter === "all"
    ? allBids
    : allBids.filter((b) => b.auctionTitle.toLowerCase().includes(bidFilter.toLowerCase()))

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
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage auctions, review bids, and monitor user activity</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Package className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.totalAuctions}</p>
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
                <p className="text-2xl font-bold">{dashboardStats.activeAuctions}</p>
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
                <p className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
              {/* Add Item Form */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Auction Items</CardTitle>
                      <CardDescription>Add and manage physical, digital, or hybrid items</CardDescription>
                    </div>
                    <Button
                      className="gap-2"
                      onClick={() => setShowAddForm(!showAddForm)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>

                {showAddForm && (
                  <CardContent className="border-t border-border pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="itemTitle">Item Title</Label>
                        <Input
                          id="itemTitle"
                          placeholder="Enter item title..."
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemType">Item Type</Label>
                        <Select value={newItemType} onValueChange={setNewItemType}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Physical</SelectItem>
                            <SelectItem value="digital">Digital</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemCategory">Category</Label>
                        <Select>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="art">Art & Collectibles</SelectItem>
                            <SelectItem value="jewelry">Jewelry</SelectItem>
                            <SelectItem value="vehicles">Vehicles</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startingBid">Starting Bid ($)</Label>
                        <Input
                          id="startingBid"
                          type="number"
                          placeholder="0.00"
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          rows={3}
                          placeholder="Describe the item..."
                          className="flex w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      {newItemType === "digital" || newItemType === "hybrid" ? (
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="digitalDelivery">Digital Delivery Details</Label>
                          <Input
                            id="digitalDelivery"
                            placeholder="e.g., Download link, license key, etc."
                            className="bg-secondary border-border"
                          />
                        </div>
                      ) : null}
                      {newItemType === "physical" || newItemType === "hybrid" ? (
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="shippingInfo">Shipping Information</Label>
                          <Input
                            id="shippingInfo"
                            placeholder="e.g., Weight, dimensions, shipping restrictions..."
                            className="bg-secondary border-border"
                          />
                        </div>
                      ) : null}
                      <div className="sm:col-span-2">
                        <Button className="w-full">Add Auction Item</Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Item List */}
              <div className="space-y-3">
                {auctionItems.map((item) => (
                  <Card key={item.id} className="border-border bg-card">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{item.title}</p>
                            <Badge className={`${typeColor(item.type)} gap-1`}>
                              {typeIcon(item.type)}
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{item.category}</span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              Start: ${item.startingBid.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5" />
                              Current: ${item.currentBid.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {item.bidCount} bids
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Ends: {item.endsAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              item.status === "active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-secondary text-muted-foreground"
                            }
                          >
                            {item.status === "active" ? "Active" : "Ended"}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View auction</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete auction</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  <Select value={bidFilter} onValueChange={setBidFilter}>
                    <SelectTrigger className="w-full bg-secondary border-border sm:w-64">
                      <SelectValue placeholder="Filter by auction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Auctions</SelectItem>
                      <SelectItem value="Vintage Rolex">Vintage Rolex Submariner 1968</SelectItem>
                      <SelectItem value="NFT Digital">NFT Digital Art Collection</SelectItem>
                      <SelectItem value="Gaming Bundle">Premium Gaming Bundle</SelectItem>
                      <SelectItem value="Mustang">1967 Ford Mustang Fastback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {/* Table Header */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 pb-3 text-sm font-medium text-muted-foreground border-b border-border mb-3">
                  <div className="col-span-3">Auction</div>
                  <div className="col-span-2">Bidder</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="space-y-2">
                  {filteredBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/50 p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                    >
                      <div className="col-span-3 min-w-0">
                        <p className="font-medium truncate text-sm">{bid.auctionTitle}</p>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <p className="text-sm truncate">{bid.bidderName}</p>
                        <p className="text-xs text-muted-foreground truncate">{bid.bidder}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="font-semibold">${bid.amount.toLocaleString()}</p>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{bid.timestamp}</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        {bid.isWinning ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 gap-1">
                            <Trophy className="h-3 w-3" />
                            Winner
                          </Badge>
                        ) : (
                          <Badge className="bg-secondary text-muted-foreground">
                            Outbid
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Wishlists Tab */}
          <TabsContent value="wishlists">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">User Wishlists & Favourites</CardTitle>
                <CardDescription>Review what items users want so you can add them to the auction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userWishlists.map((user) => (
                    <div key={user.userId} className="rounded-lg border border-border bg-secondary/50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.userName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant="secondary" className="bg-secondary text-foreground">
                          {user.items.length} {user.items.length === 1 ? "item" : "items"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {user.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-md bg-background/50 px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <Heart className="h-3.5 w-3.5 text-destructive" />
                              <span className="text-sm">{item.title}</span>
                            </div>
                            <Badge variant="outline" className="text-xs border-border">
                              {item.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
