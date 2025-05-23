// Datos dummy para productos
import { generateMoreProducts } from "./data"

// Generar más productos (al menos 100 en total)
const allProducts = generateMoreProducts()

// Obtener todos los productos
export async function getAllProducts() {
  return Promise.resolve(Object.values(allProducts).flat())
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  return Promise.resolve(allProducts[category] || [])
}

// Obtener un producto por ID
export async function getProductById(id) {
  for (const category in allProducts) {
    const product = allProducts[category].find((p) => p.id === id)
    if (product) {
      return Promise.resolve(product)
    }
  }
  return Promise.reject(new Error("Producto no encontrado"))
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
  return Promise.resolve(results)
}

// Filtrar productos
export async function filterProducts(filters) {
  let results = []

  // Si hay una categoría específica, usar solo esa
  if (filters.category) {
    results = [...(allProducts[filters.category] || [])]
  } else {
    // Si no, usar todos los productos
    for (const category in allProducts) {
      results.push(...allProducts[category])
    }
  }

  // Aplicar filtro de precio
  if (filters.priceRange) {
    results = results.filter((p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max)
  }

  // Aplicar filtro de valoración
  if (filters.rating) {
    results = results.filter((p) => p.rating >= filters.rating)
  }

  // Aplicar ordenamiento
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        results.sort((a, b) => b.price - a.price)
        break
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // En datos dummy, simplemente mezclar
        results.sort(() => Math.random() - 0.5)
        break
      default:
        // Por defecto, no hacer nada
        break
    }
  }

  return Promise.resolve(results)
}

// Obtener ofertas especiales
export async function getSpecialOffers(limit = 8) {
  const offers = []
  for (const category in allProducts) {
    const categoryOffers = allProducts[category].filter((p) => p.oldPrice)
    offers.push(...categoryOffers)
  }
  return Promise.resolve(offers.slice(0, limit))
}

// Obtener productos destacados
export async function getFeaturedProducts(limit = 8) {
  const featured = []
  for (const category in allProducts) {
    const categoryFeatured = allProducts[category].filter((p) => p.featured)
    featured.push(...categoryFeatured)
  }
  return Promise.resolve(featured.slice(0, limit))
}

// Inicializar la base de datos con datos de prueba (no hace nada en la implementación dummy)
export async function initializeWithSampleData() {
  return Promise.resolve({ success: true, count: Object.values(allProducts).flat().length })
}
