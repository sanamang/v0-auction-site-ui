import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

interface AdminBidRow {
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

    const bids = await query<AdminBidRow[]>(
      `SELECT b.bid_id, b.amount, b.status, b.created_at,
              u.display_name, u.email,
              i.title AS item_title, a.name AS auction_name,
              b.auction_item_id
       FROM bids b
       JOIN users u ON u.user_id = b.user_id
       JOIN auctions a ON a.auction_id = b.auction_id
       JOIN auction_items ai ON ai.auction_item_id = b.auction_item_id
       JOIN items i ON i.item_id = ai.item_id
       ORDER BY b.created_at DESC
       LIMIT 200`
    )

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Admin bids error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
