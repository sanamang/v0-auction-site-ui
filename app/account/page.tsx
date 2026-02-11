"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  Settings,
  Package,
  Heart,
  LogOut,
  Clock,
  TrendingUp,
  Award,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  DollarSign,
  Plus,
  Minus,
  Loader2,
} from "lucide-react"

interface SessionUser {
  userId: number
  email: string
  displayName: string
  role: string
}

interface WalletData {
  available_balance: number
  held_balance: number
}

interface LedgerEntry {
  ledger_id: number
  delta: number
  reason: string
  auction_id: number | null
  created_at: string
}

interface BidEntry {
  bid_id: number
  amount: number
  status: string
  created_at: string
  auction_name: string
  item_title: string
  auction_item_id: number
  auction_status: string
  scheduled_ends_at: string
}

interface WishlistItem {
  item_id: number
  title: string
  description: string | null
  usd_value: number
  created_at: string
  image_url: string | null
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })
}

function formatDateTime(dateStr: string) {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`
}

function reasonLabel(reason: string) {
  const labels: Record<string, string> = {
    DEPOSIT: "Wallet Top-Up",
    HOLD_PLACED: "Bid Hold Placed",
    HOLD_RELEASED: "Bid Hold Released",
    BID_WON: "Auction Won - Payment",
    REFUND: "Refund",
    WITHDRAWAL: "Withdrawal",
  }
  return labels[reason] || reason.replace(/_/g, " ")
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [bids, setBids] = useState<BidEntry[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()

      if (!sessionData.user) {
        router.push("/login")
        return
      }

      setUser(sessionData.user)

      const [walletRes, bidsRes, wishlistRes] = await Promise.all([
        fetch("/api/account/wallet"),
        fetch("/api/account/bids"),
        fetch("/api/account/wishlist"),
      ])

      const [walletData, bidsData, wishlistData] = await Promise.all([
        walletRes.json(),
        bidsRes.json(),
        wishlistRes.json(),
      ])

      setWallet(walletData.wallet || { available_balance: 0, held_balance: 0 })
      setLedger(walletData.ledger || [])
      setBids(bidsData.bids || [])
      setWishlist(wishlistData.items || [])
    } catch (error) {
      console.error("Failed to fetch account data:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const handleRemoveWishlist = async (itemId: number) => {
    await fetch("/api/account/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    })
    setWishlist((prev) => prev.filter((i) => i.item_id !== itemId))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const balance = wallet ? wallet.available_balance / 100 : 0
  const heldBalance = wallet ? wallet.held_balance / 100 : 0
  const activeBids = bids.filter((b) => b.status === "ACTIVE" || b.status === "WINNING")
  const wonBids = bids.filter((b) => b.status === "WINNING" && b.auction_status === "CLOSED")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarFallback className="bg-secondary text-foreground text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{user.displayName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 border-border bg-transparent" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                  <Wallet className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold">
                    ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  {heldBalance > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ${heldBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} held in bids
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Funds
                </Button>
                <Button variant="outline" className="gap-2 border-border bg-transparent">
                  <Minus className="h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bids.length}</p>
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
                <p className="text-2xl font-bold">{wonBids.length}</p>
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
                <p className="text-2xl font-bold">{wishlist.length}</p>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Clock className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeBids.length}</p>
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
            <TabsTrigger value="transactions" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="won" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Won</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* My Bids Tab - with timestamps */}
          <TabsContent value="bids">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Bids</CardTitle>
                <CardDescription>Track your active and past bids with timestamps</CardDescription>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No bids yet. Start bidding on items!</p>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div
                        key={bid.bid_id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                          <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bid.item_title}</p>
                          <p className="text-sm text-muted-foreground">
                            Your bid: ${(bid.amount / 100).toLocaleString()}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground text-xs">
                                Ends: {formatDate(bid.scheduled_ends_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <History className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground text-xs">
                                Bid placed: {formatDateTime(bid.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            bid.status === "WINNING" || bid.status === "ACTIVE"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : bid.status === "OUTBID"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-accent/20 text-accent"
                          }
                        >
                          {bid.status === "WINNING"
                            ? "Winning"
                            : bid.status === "ACTIVE"
                              ? "Active"
                              : bid.status === "OUTBID"
                                ? "Outbid"
                                : bid.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactions">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Transaction History</CardTitle>
                    <CardDescription>All your deposits, payments, and refunds</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent">
                    <DollarSign className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ledger.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No transactions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {ledger.map((tx) => (
                      <div
                        key={tx.ledger_id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            tx.delta > 0 ? "bg-emerald-500/20" : tx.delta < 0 ? "bg-destructive/20" : "bg-secondary"
                          }`}
                        >
                          {tx.delta >= 0 ? (
                            <ArrowDownLeft
                              className={`h-5 w-5 ${tx.delta > 0 ? "text-emerald-400" : "text-muted-foreground"}`}
                            />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{reasonLabel(tx.reason)}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatDateTime(tx.created_at)}</span>
                            {tx.auction_id && (
                              <>
                                <span className="text-border">|</span>
                                <span>Auction #{tx.auction_id}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-lg font-semibold whitespace-nowrap ${
                            tx.delta > 0 ? "text-emerald-400" : tx.delta < 0 ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {tx.delta > 0 ? "+" : ""}
                          {tx.delta !== 0
                            ? `$${Math.abs(tx.delta / 100).toLocaleString()}`
                            : "--"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">My Wishlist</CardTitle>
                <CardDescription>Items you have favourited</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No wishlist items. Favourite items to track them here!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.item_id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-secondary">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Value: ${item.usd_value.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added: {formatDate(item.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveWishlist(item.item_id)}
                          >
                            <Heart className="h-4 w-4 fill-current" />
                            <span className="sr-only">Remove from wishlist</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Won Auctions Tab */}
          <TabsContent value="won">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Won Auctions</CardTitle>
                <CardDescription>{"Items you've successfully won"}</CardDescription>
              </CardHeader>
              <CardContent>
                {wonBids.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No won auctions yet. Keep bidding!</p>
                ) : (
                  <div className="space-y-4">
                    {wonBids.map((bid) => (
                      <div
                        key={bid.bid_id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                          <Award className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bid.item_title}</p>
                          <p className="text-sm text-muted-foreground">
                            Final price: ${(bid.amount / 100).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Won on {formatDate(bid.created_at)}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-accent text-accent whitespace-nowrap">
                          Won
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Display Name</p>
                      <p className="font-medium">{user.displayName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{user.role === "REP" ? "Participant" : "Admin"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-medium">#{user.userId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
