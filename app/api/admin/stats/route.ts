import { NextResponse } from "next/server"
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
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [totalAuctions] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM auctions"
    )
    const [activeAuctions] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM auctions WHERE status = 'LIVE'"
    )
    const [totalUsers] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users WHERE is_active = 1"
    )
    const [totalBids] = await query<{ total: number }[]>(
      "SELECT COALESCE(SUM(amount), 0) as total FROM bids WHERE status IN ('ACTIVE', 'WINNING')"
    )

    return NextResponse.json({
      stats: {
        totalAuctions: totalAuctions?.count || 0,
        activeAuctions: activeAuctions?.count || 0,
        totalUsers: totalUsers?.count || 0,
        totalBidVolume: totalBids?.total || 0,
      },
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
