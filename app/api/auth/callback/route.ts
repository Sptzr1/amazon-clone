import { type NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth/auth0"

export async function GET(req: NextRequest) {
  try {
    if (!auth0) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return await auth0.handleCallback(req as any)
  } catch (error) {
    console.error("Error en callback:", error)
    return new NextResponse("Error en callback", { status: 500 })
  }
}
