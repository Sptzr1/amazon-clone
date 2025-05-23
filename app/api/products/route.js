import { NextResponse } from "next/server"

// Configuración para Next.js 15.3.2
export const runtime = "nodejs" // Usar el runtime de Node.js para MongoDB
export const dynamic = "force-dynamic" // No cachear esta ruta

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")
    const query = searchParams.get("query")

    // Importamos la factory de repositorios
    const { getProductRepository } = await import("@/lib/repositories/repository-factory")

    // Obtenemos el repositorio adecuado
    const repository = await getProductRepository()

    let result

    if (id) {
      // Buscar por ID
      try {
        result = await repository.getProductById(id)
      } catch (error) {
        result = {}
      }
    } else if (category) {
      // Filtrar por categoría
      result = await repository.getProductsByCategory(category)
    } else if (query) {
      // Buscar por término
      result = await repository.searchProducts(query)
    } else {
      // Obtener todos los productos
      result = await repository.getAllProducts()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
