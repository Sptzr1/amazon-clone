import { ProductRepository } from "./product-repository"

export class MongoDBRepository extends ProductRepository {
  constructor() {
    super()
    this.client = null
    this.db = null
    this.collection = null
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Importación dinámica de mongodb
      // En Next.js 15.3.2, esto funciona mejor con la configuración serverComponentsExternalPackages
      const { MongoClient } = await import("mongodb")

      const uri = process.env.MONGODB_URI
      if (!uri) {
        throw new Error("MONGODB_URI no está configurada")
      }

      // Crear un nuevo cliente
      this.client = new MongoClient(uri, {
        maxPoolSize: 10, // Optimizado para Next.js 15.3.2 en entornos serverless
      })

      // Conectar al cliente
      await this.client.connect()

      // Obtener la base de datos
      this.db = this.client.db()

      // Obtener la colección
      this.collection = this.db.collection("products")

      this.initialized = true

      // Configurar el cierre limpio en desarrollo
      if (process.env.NODE_ENV === "development") {
        process.on("SIGTERM", async () => {
          await this.close()
        })
      }
    } catch (error) {
      console.error("Error al inicializar MongoDB:", error)
      throw error
    }
  }

  async close() {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      this.collection = null
      this.initialized = false
    }
  }

  async getAllProducts() {
    await this.initialize()
    return this.collection.find({}).limit(100).toArray()
  }

  async getProductsByCategory(category) {
    await this.initialize()
    return this.collection.find({ category }).toArray()
  }

  async getProductById(id) {
    await this.initialize()
    return this.collection.findOne({ id })
  }

  async searchProducts(query) {
    await this.initialize()
    return this.collection
      .find({
        $or: [{ title: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }],
      })
      .toArray()
  }

  async getSpecialOffers(limit = 8) {
    await this.initialize()
    return this.collection
      .find({
        oldPrice: { $exists: true, $ne: null },
      })
      .limit(limit)
      .toArray()
  }

  async getFeaturedProducts(limit = 8) {
    await this.initialize()
    return this.collection.find({ featured: true }).limit(limit).toArray()
  }

  async initializeWithSampleData(products) {
    await this.initialize()

    // Verificar si ya hay datos
    const count = await this.collection.countDocuments()

    if (count === 0 && products && products.length > 0) {
      // Añadir fechas a los datos
      const productsWithDates = products.map((product) => ({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await this.collection.insertMany(productsWithDates)
      return { success: true, count: productsWithDates.length }
    }

    return { success: true, count }
  }
}
