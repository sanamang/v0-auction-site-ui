import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

interface WishlistRow {
  item_id: number
  title: string
  description: string | null
  usd_value: number
  created_at: string
  image_url: string | null
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)

    const items = await query<WishlistRow[]>(
      `SELECT i.item_id, i.title, i.description, i.usd_value, w.created_at,
              (SELECT ii.image_url FROM item_images ii WHERE ii.item_id = i.item_id ORDER BY ii.sort_order LIMIT 1) AS image_url
       FROM wishlists w
       JOIN items i ON i.item_id = w.item_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [user.userId]
    )

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Wishlist error:", error)
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
    const { itemId } = await request.json()

    await query(
      "INSERT IGNORE INTO wishlists (user_id, item_id) VALUES (?, ?)",
      [user.userId, itemId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist add error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    const { itemId } = await request.json()

    await query(
      "DELETE FROM wishlists WHERE user_id = ? AND item_id = ?",
      [user.userId, itemId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist remove error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
