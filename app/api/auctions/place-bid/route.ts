import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    const { auctionItemId, auctionId, amount } = await request.json()

    if (!auctionItemId || !auctionId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // The database triggers will handle:
    // 1. Enforcing one active bid per user per auction
    // 2. Setting amount to available balance
    // 3. Creating hold and moving funds
    await query(
      `INSERT INTO bids (auction_id, auction_item_id, user_id, amount, status)
       VALUES (?, ?, ?, ?, 'ACTIVE')`,
      [auctionId, auctionItemId, user.userId, amount]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Place bid error:", message)

    if (message.includes("ACTIVE bid")) {
      return NextResponse.json({ error: "You already have an active bid in this auction" }, { status: 409 })
    }
    if (message.includes("Insufficient")) {
      return NextResponse.json({ error: "Insufficient balance to place bid" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
  }
}
