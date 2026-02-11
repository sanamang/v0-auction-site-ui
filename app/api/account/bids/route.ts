import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

interface BidRow {
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

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)

    const bids = await query<BidRow[]>(
      `SELECT b.bid_id, b.amount, b.status, b.created_at,
              a.name AS auction_name, i.title AS item_title,
              b.auction_item_id, a.status AS auction_status,
              a.scheduled_ends_at
       FROM bids b
       JOIN auctions a ON a.auction_id = b.auction_id
       JOIN auction_items ai ON ai.auction_item_id = b.auction_item_id
       JOIN items i ON i.item_id = ai.item_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC
       LIMIT 50`,
      [user.userId]
    )

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Bids error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
