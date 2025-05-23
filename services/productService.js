// Importar la capa de base de datos
import db from "@/lib/db"

// Función para obtener productos por categoría (compatible con el código anterior)
export async function getDummyProducts(category) {
  try {
    return await db.getProductsByCategory(category)
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${category}:`, error)
    return []
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(category) {
  try {
    return await db.getProductsByCategory(category)
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${category}:`, error)
    return []
  }
}

// Función para obtener un producto por ID
export async function getProductById(id) {
  try {
    const product = await db.getProductById(id)
    if (!product) {
      throw new Error("Producto no encontrado")
    }
    return product
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error)
    throw error
  }
}

// Función para obtener ofertas especiales
export async function getSpecialOffers() {
  try {
    return await db.getSpecialOffers()
  } catch (error) {
    console.error("Error al obtener ofertas especiales:", error)
    return []
  }
}

// Función para buscar productos
export async function searchProducts(query) {
  try {
    return await db.searchProducts(query)
  } catch (error) {
    console.error(`Error al buscar productos con la consulta "${query}":`, error)
    return []
  }
}

// Función para filtrar productos
export async function filterProducts(filters) {
  try {
    return await db.filterProducts(filters)
  } catch (error) {
    console.error("Error al filtrar productos:", error)
    return []
  }
}

// Función para obtener productos destacados
export async function getFeaturedProducts() {
  try {
    return await db.getFeaturedProducts()
  } catch (error) {
    console.error("Error al obtener productos destacados:", error)
    return []
  }
}

// Función para inicializar la base de datos con datos de prueba
export async function initializeDatabase() {
  try {
    // Inicializar la base de datos
    if (db.initializeWithSampleData) {
      await db.initializeWithSampleData()
    }

    return { success: true }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return { success: false, error: error.message }
  }
}

// Función para obtener todos los productos
export async function getAllProducts() {
  try {
    return await db.getAllProducts()
  } catch (error) {
    console.error("Error al obtener todos los productos:", error)
    return []
  }
}
