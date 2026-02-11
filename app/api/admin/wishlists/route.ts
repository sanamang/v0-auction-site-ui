import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

interface WishlistRow {
  user_id: number
  display_name: string
  email: string
  item_id: number
  item_title: string
  created_at: string
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

    const rows = await query<WishlistRow[]>(
      `SELECT u.user_id, u.display_name, u.email,
              i.item_id, i.title AS item_title, w.created_at
       FROM wishlists w
       JOIN users u ON u.user_id = w.user_id
       JOIN items i ON i.item_id = w.item_id
       ORDER BY u.display_name, w.created_at DESC`
    )

    // Group by user
    const grouped: Record<string, { userId: number; displayName: string; email: string; items: { itemId: number; title: string; addedAt: string }[] }> = {}
    for (const row of rows) {
      const key = String(row.user_id)
      if (!grouped[key]) {
        grouped[key] = {
          userId: row.user_id,
          displayName: row.display_name,
          email: row.email,
          items: [],
        }
      }
      grouped[key].items.push({
        itemId: row.item_id,
        title: row.item_title,
        addedAt: row.created_at,
      })
    }

    return NextResponse.json({ wishlists: Object.values(grouped) })
  } catch (error) {
    console.error("Admin wishlists error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
