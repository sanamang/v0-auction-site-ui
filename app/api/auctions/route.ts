import { NextResponse } from "next/server"
import { query } from "@/lib/db"

interface AuctionItemRow {
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

export async function GET() {
  try {
    const items = await query<AuctionItemRow[]>(
      `SELECT ai.auction_item_id, ai.auction_id, ai.item_id,
              i.title, i.description, i.usd_value,
              ai.starting_price, ai.status,
              a.name AS auction_name, a.status AS auction_status,
              a.scheduled_ends_at, a.ends_at,
              (SELECT ii.image_url FROM item_images ii WHERE ii.item_id = i.item_id ORDER BY ii.sort_order LIMIT 1) AS image_url,
              (SELECT COUNT(*) FROM bids b WHERE b.auction_item_id = ai.auction_item_id) AS bid_count,
              (SELECT MAX(b.amount) FROM bids b WHERE b.auction_item_id = ai.auction_item_id) AS highest_bid
       FROM auction_items ai
       JOIN items i ON i.item_id = ai.item_id
       JOIN auctions a ON a.auction_id = ai.auction_id
       WHERE ai.status = 'OPEN' AND a.status IN ('LIVE', 'DRAFT')
       ORDER BY a.scheduled_ends_at ASC
       LIMIT 50`
    )

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Auctions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
