import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface BidRow {
  bid_id: number
  amount: number
  status: string
  created_at: string
  display_name: string
}

export async function GET(request: NextRequest) {
  try {
    const auctionItemId = request.nextUrl.searchParams.get("auctionItemId")
    if (!auctionItemId) {
      return NextResponse.json({ error: "auctionItemId is required" }, { status: 400 })
    }

    const bids = await query<BidRow[]>(
      `SELECT b.bid_id, b.amount, b.status, b.created_at, u.display_name
       FROM bids b
       JOIN users u ON u.user_id = b.user_id
       WHERE b.auction_item_id = ?
       ORDER BY b.created_at DESC
       LIMIT 50`,
      [auctionItemId]
    )

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Bid history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
