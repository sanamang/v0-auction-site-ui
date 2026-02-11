import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(session.value)

    const items = await query<{ item_id: number }[]>(
      "SELECT item_id FROM favorites WHERE user_id = ?",
      [user.userId]
    )

    return NextResponse.json({ itemIds: items.map((i) => i.item_id) })
  } catch (error) {
    console.error("Favorites error:", error)
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
      "INSERT IGNORE INTO favorites (user_id, item_id) VALUES (?, ?)",
      [user.userId, itemId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Favorite add error:", error)
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
      "DELETE FROM favorites WHERE user_id = ? AND item_id = ?",
      [user.userId, itemId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Favorite remove error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
