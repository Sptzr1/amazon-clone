import { NextResponse } from "next/server"

// Configuración para Next.js 15.3.2
export const runtime = "nodejs" // Usar el runtime de Node.js para MongoDB
export const dynamic = "force-dynamic" // No cachear esta ruta

export async function GET() {
  try {
    // Importamos la factory de repositorios
    const { getProductRepository } = await import("@/lib/repositories/repository-factory")

    // Obtenemos el repositorio adecuado
    const repository = await getProductRepository()

    // Obtenemos las ofertas especiales
    const offers = await repository.getSpecialOffers()

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
