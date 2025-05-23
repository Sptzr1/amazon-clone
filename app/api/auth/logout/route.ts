import { type NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth/auth0-config"

export async function GET(req: NextRequest) {
  try {
    if (!auth0) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return await auth0.handleLogout(req as any)
  } catch (error) {
    console.error("Error en logout:", error)
    return new NextResponse("Error en logout", { status: 500 })
  }
}
