import clientPromise from "../connection"
import { validateProduct } from "../models/product"

// Nombre de la colección en MongoDB
const COLLECTION_NAME = "products"

// Verificar si estamos en el servidor
const isServer = typeof window === "undefined"

// Obtener la colección de productos
async function getCollection() {
  if (!isServer) {
    console.warn("MongoDB operation attempted on client side")
    return null
  }

  const client = await clientPromise
  const db = client.db()
  return db.collection(COLLECTION_NAME)
}

// Obtener todos los productos
export async function getAllProducts() {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()
    return collection.find({}).toArray()
  } catch (error) {
    console.error("Error getting all products:", error)
    return []
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()
    return collection.find({ category }).toArray()
  } catch (error) {
    console.error(`Error getting products by category ${category}:`, error)
    return []
  }
}

// Obtener productos por subcategoría
export async function getProductsBySubcategory(subcategory) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()
    return collection.find({ subcategory }).toArray()
  } catch (error) {
    console.error(`Error getting products by subcategory ${subcategory}:`, error)
    return []
  }
}

// Obtener un producto por ID
export async function getProductById(id) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return null
  }

  try {
    const collection = await getCollection()
    return collection.findOne({ id })
  } catch (error) {
    console.error(`Error getting product by ID ${id}:`, error)
    return null
  }
}

// Buscar productos
export async function searchProducts(query) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()
    return collection
      .find({
        $or: [{ title: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }],
      })
      .toArray()
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error)
    return []
  }
}

// Filtrar productos
export async function filterProducts(filters) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()

    const query = {}

    // Filtrar por categoría
    if (filters.category) {
      query.category = filters.category
    }

    // Filtrar por rango de precio
    if (filters.priceRange) {
      query.price = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max,
      }
    }

    // Filtrar por valoración
    if (filters.rating) {
      query.rating = { $gte: filters.rating }
    }

    const products = await collection.find(query).toArray()

    // Aplicar ordenamiento
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          products.sort((a, b) => b.price - a.price)
          break
        case "rating":
          products.sort((a, b) => b.rating - a.rating)
          break
        case "newest":
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        default:
          // Por defecto, no hacer nada
          break
      }
    }

    return products
  } catch (error) {
    console.error("Error filtering products:", error)
    return []
  }
}

// Obtener ofertas especiales (productos con descuento)
export async function getSpecialOffers(limit = 8) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()
    return collection
      .find({ oldPrice: { $exists: true, $ne: null } })
      .limit(limit)
      .toArray()
  } catch (error) {
    console.error("Error getting special offers:", error)
    return []
  }
}

// Obtener productos destacados
export async function getFeaturedProducts(limit = 8) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return []
  }

  try {
    const collection = await getCollection()
    return collection.find({ featured: true }).limit(limit).toArray()
  } catch (error) {
    console.error("Error getting featured products:", error)
    return []
  }
}

// Crear un producto
export async function createProduct(product) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return null
  }

  try {
    if (!validateProduct(product)) {
      throw new Error("Producto inválido")
    }

    const collection = await getCollection()

    // Asignar ID si no tiene
    if (!product.id) {
      product.id = new Date().getTime().toString()
    }

    // Añadir fechas
    product.createdAt = new Date()
    product.updatedAt = new Date()

    await collection.insertOne(product)
    return product
  } catch (error) {
    console.error("Error creating product:", error)
    return null
  }
}

// Actualizar un producto
export async function updateProduct(id, updates) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return null
  }

  try {
    const collection = await getCollection()

    // Actualizar fecha
    updates.updatedAt = new Date()

    await collection.updateOne({ id }, { $set: updates })

    return getProductById(id)
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    return null
  }
}

// Eliminar un producto
export async function deleteProduct(id) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return { success: false }
  }

  try {
    const collection = await getCollection()
    await collection.deleteOne({ id })
    return { success: true }
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    return { success: false }
  }
}

// Inicializar la colección con datos de prueba
export async function initializeWithSampleData(sampleData) {
  if (!isServer) {
    // En el cliente, usar la implementación dummy
    return { success: false }
  }

  try {
    const collection = await getCollection()

    // Verificar si ya hay datos
    const count = await collection.countDocuments()

    if (count === 0 && sampleData && sampleData.length > 0) {
      // Añadir fechas a los datos de muestra
      const dataWithDates = sampleData.map((product) => ({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await collection.insertMany(dataWithDates)
      console.log(`Inicializada la colección con ${dataWithDates.length} productos`)
    }

    return { success: true, count }
  } catch (error) {
    console.error("Error initializing with sample data:", error)
    return { success: false, error: error.message }
  }
}
