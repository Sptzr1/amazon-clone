/* import { NextResponse } from "next/server"
import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard"]
// Rutas que requieren roles específicos
const roleRoutes = {
  "/": ["user"],
  "/dashboard/seller": ["seller", "admin", "superadmin"],
  "/dashboard/admin": ["admin", "superadmin"],
  "/dashboard/superadmin": ["superadmin"],
}

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Verificar si la ruta requiere autenticación
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Si no hay sesión, redirigir al login
    if (!sessionCookie) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }

    // Verificar roles para rutas específicas
    try {
      const session = JSON.parse(sessionCookie.value)
      const userRole = session.role

      // Verificar si la ruta requiere un rol específico
      for (const [route, roles] of Object.entries(roleRoutes)) {
        if (pathname.startsWith(route) && !roles.includes(userRole)) {
          // Redirigir a la página principal si no tiene el rol adecuado
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    } catch (error) {
      console.error("Error al parsear la cookie de sesión:", error)
      // Si hay un error al parsear la cookie, redirigir al login
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }
  return await auth0.middleware(request);
}

*/

import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth/auth0";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
