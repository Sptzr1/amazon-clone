import { type NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth/auth0"

export async function GET(req: NextRequest) {
  try {
    if (!auth0) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    return await auth0.handleLogin(req as any)
  } catch (error) {
    console.error("Error en login:", error)
    return new NextResponse("Error en login", { status: 500 })
  }
}
