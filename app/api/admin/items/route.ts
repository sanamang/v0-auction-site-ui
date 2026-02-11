import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

interface AdminItemRow {
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

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const items = await query<AdminItemRow[]>(
      `SELECT ai.auction_item_id, ai.item_id, i.title, i.description,
              ai.starting_price, ai.status,
              a.auction_id, a.name AS auction_name, a.status AS auction_status,
              a.scheduled_ends_at,
              (SELECT COUNT(*) FROM bids b WHERE b.auction_item_id = ai.auction_item_id) AS bid_count,
              (SELECT MAX(b.amount) FROM bids b WHERE b.auction_item_id = ai.auction_item_id) AS highest_bid
       FROM auction_items ai
       JOIN items i ON i.item_id = ai.item_id
       JOIN auctions a ON a.auction_id = ai.auction_id
       ORDER BY a.scheduled_ends_at DESC
       LIMIT 100`
    )

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Admin items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, description, usdValue, startingBid, auctionName, endsAt } = await request.json()

    // Create the item
    const itemResult = await query<{ insertId: number }>(
      "INSERT INTO items (title, description, usd_value) VALUES (?, ?, ?)",
      [title, description || null, usdValue || 0]
    )

    const itemId = (itemResult as unknown as { insertId: number }).insertId

    // Create an auction
    const auctionResult = await query<{ insertId: number }>(
      `INSERT INTO auctions (name, starts_at, scheduled_ends_at, status, created_by)
       VALUES (?, NOW(), ?, 'LIVE', ?)`,
      [auctionName || title, endsAt, user.userId]
    )

    const auctionId = (auctionResult as unknown as { insertId: number }).insertId

    // Link item to auction
    await query(
      `INSERT INTO auction_items (auction_id, item_id, starting_price, status)
       VALUES (?, ?, ?, 'OPEN')`,
      [auctionId, itemId, startingBid || 0]
    )

    return NextResponse.json({ success: true, itemId, auctionId })
  } catch (error) {
    console.error("Admin add item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
