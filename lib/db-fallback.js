// Datos dummy para productos
import { generateMoreProducts } from "./db/dummy/data"

// Generar más productos (al menos 100 en total)
const allProducts = generateMoreProducts()

// Obtener todos los productos
export async function getAllProducts() {
  return Object.values(allProducts).flat()
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  return allProducts[category] || []
}

// Obtener un producto por ID
export async function getProductById(id) {
  for (const category in allProducts) {
    const product = allProducts[category].find((p) => p.id === id)
    if (product) {
      return product
    }
  }
  throw new Error("Producto no encontrado")
}

// Buscar productos
export async function searchProducts(query) {
  const results = []
  for (const category in allProducts) {
    const matches = allProducts[category].filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()),
    )
    results.push(...matches)
  }
  return results
}

// Obtener ofertas especiales
export async function getSpecialOffers(limit = 8) {
  const offers = []
  for (const category in allProducts) {
    const categoryOffers = allProducts[category].filter((p) => p.oldPrice)
    offers.push(...categoryOffers)
  }
  return offers.slice(0, limit)
}
