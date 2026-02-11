import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { cookies } from "next/headers"

interface UserRow {
  user_id: number
  external_auth_id: string
  email: string
  display_name: string
  role: "REP" | "ADMIN"
  is_active: number
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Look up the user by email
    const users = await query<UserRow[]>(
      "SELECT user_id, external_auth_id, email, display_name, role, is_active FROM users WHERE email = ? AND is_active = 1",
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // Check role matches what was selected on login form
    const expectedRole = role === "admin" ? "ADMIN" : "REP"
    if (user.role !== expectedRole) {
      return NextResponse.json(
        { error: `This account is not registered as ${role === "admin" ? "an admin" : "a participant"}` },
        { status: 403 }
      )
    }

    // Note: In production, verify password hash here with bcrypt.
    // For now, we check external_auth_id as a simple password proxy.
    // You should replace this with proper bcrypt password hashing.
    if (user.external_auth_id !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Set a session cookie with user info
    const sessionData = JSON.stringify({
      userId: user.user_id,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({
      user: {
        userId: user.user_id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
