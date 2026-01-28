"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Settings,
  Package,
  Heart,
  CreditCard,
  Bell,
  LogOut,
  Camera,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react"

const userStats = {
  totalBids: 127,
  auctionsWon: 23,
  watchlist: 14,
  memberSince: "March 2024",
}

const recentBids = [
  {
    id: "1",
    item: "Vintage Rolex Submariner 1968",
    bidAmount: 12500,
    status: "winning",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    endsIn: "4h 23m",
  },
  {
    id: "2",
    item: "Original Oil Painting - Abstract Seascape",
    bidAmount: 3000,
    status: "outbid",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100&h=100&fit=crop",
    endsIn: "12h 45m",
  },
  {
    id: "3",
    item: "1967 Ford Mustang Fastback",
    bidAmount: 42000,
    status: "won",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&h=100&fit=crop",
    endsIn: "Ended",
  },
]

const wonAuctions = [
  {
    id: "1",
    item: "1967 Ford Mustang Fastback",
    finalPrice: 45000,
    date: "Jan 15, 2026",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&h=100&fit=crop",
    status: "Payment Pending",
  },
  {
    id: "2",
    item: "Antique Victorian Writing Desk",
    finalPrice: 2800,
    date: "Jan 10, 2026",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100&h=100&fit=crop",
    status: "Shipped",
  },
]

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
                <AvatarFallback className="bg-secondary text-foreground text-xl">JD</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                <Camera className="h-3.5 w-3.5" />
                <span className="sr-only">Change avatar</span>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">John Doe</h1>
              <p className="text-muted-foreground">john.doe@example.com</p>
              <p className="mt-1 text-sm text-muted-foreground">Member since {userStats.memberSince}</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 border-border bg-transparent">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.totalBids}</p>
                <p className="text-sm text-muted-foreground">Total Bids</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Award className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.auctionsWon}</p>
                <p className="text-sm text-muted-foreground">Auctions Won</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Heart className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.watchlist}</p>
                <p className="text-sm text-muted-foreground">Watchlist Items</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Clock className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Active Bids</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="bids" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="bids" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">My Bids</span>
            </TabsTrigger>
            <TabsTrigger value="won" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Won Auctions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bids">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Bids</CardTitle>
                <CardDescription>Track your active and past bids</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                    >
                      <img
                        src={bid.image || "/placeholder.svg"}
                        alt={bid.item}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{bid.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Your bid: ${bid.bidAmount.toLocaleString()}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{bid.endsIn}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          bid.status === "winning"
                            ? "default"
                            : bid.status === "won"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          bid.status === "winning"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : bid.status === "won"
                              ? "bg-secondary text-foreground"
                              : "bg-destructive/20 text-destructive"
                        }
                      >
                        {bid.status === "winning" ? "Winning" : bid.status === "won" ? "Won" : "Outbid"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="won">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Won Auctions</CardTitle>
                <CardDescription>Items you've successfully won</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wonAuctions.map((auction) => (
                    <div
                      key={auction.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                    >
                      <img
                        src={auction.image || "/placeholder.svg"}
                        alt={auction.item}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{auction.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Final price: ${auction.finalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Won on {auction.date}</p>
                      </div>
                      <Badge variant="outline" className="border-border whitespace-nowrap">
                        {auction.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="John"
                        className="bg-secondary border-border"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="Doe"
                        className="bg-secondary border-border"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="bg-secondary border-border"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="bg-secondary border-border"
                      disabled={!isEditing}
                    />
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "default" : "outline"}
                    className="w-full border-border"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-background">
                        <span className="text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/27</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-secondary text-foreground">Default</Badge>
                  </div>
                  <Button variant="outline" className="w-full border-border gap-2 bg-transparent">
                    <CreditCard className="h-4 w-4" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what updates you receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Outbid notifications", description: "Get notified when someone outbids you" },
                      { label: "Auction ending soon", description: "Reminder before auctions you're watching end" },
                      { label: "Won auction updates", description: "Payment and shipping notifications" },
                      { label: "New items in categories", description: "When new items match your interests" },
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{pref.label}</p>
                          <p className="text-sm text-muted-foreground">{pref.description}</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-border bg-transparent">
                          Enabled
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
