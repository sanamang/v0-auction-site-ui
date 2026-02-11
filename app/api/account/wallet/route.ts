import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

interface WalletRow {
  available_balance: number
  held_balance: number
}

interface LedgerRow {
  ledger_id: number
  delta: number
  reason: string
  auction_id: number | null
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

    const wallets = await query<WalletRow[]>(
      "SELECT available_balance, held_balance FROM wallets WHERE user_id = ?",
      [user.userId]
    )

    const wallet = wallets.length > 0 ? wallets[0] : { available_balance: 0, held_balance: 0 }

    const ledger = await query<LedgerRow[]>(
      "SELECT ledger_id, delta, reason, auction_id, created_at FROM wallet_ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [user.userId]
    )

    return NextResponse.json({ wallet, ledger })
  } catch (error) {
    console.error("Wallet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
