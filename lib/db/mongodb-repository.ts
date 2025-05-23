import { MongoClient, ObjectId } from "mongodb"
import type { Repository } from "./repository"

export class MongoDBRepository implements Repository {
  private client: MongoClient | null = null
  private db: any = null

  constructor() {
    this.initialize()
  }

  private async initialize() {
    if (!this.client) {
      const uri = process.env.MONGODB_URI
      if (!uri) {
        throw new Error("MONGODB_URI no está configurado")
      }

      this.client = new MongoClient(uri)
      await this.client.connect()
      this.db = this.client.db(process.env.DB_NAME || "amazon-clone")
    }
  }

  async getProducts() {
    await this.initialize()
    return this.db.collection("products").find().toArray()
  }

  async getProductById(id: string) {
    await this.initialize()
    return this.db.collection("products").findOne({
      $or: [{ _id: new ObjectId(id) }, { id: id }],
    })
  }

  async createProduct(data: any) {
    await this.initialize()
    const result = await this.db.collection("products").insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
    })
    return { id: result.insertedId, ...data }
  }

  async updateProduct(id: string, data: any) {
    await this.initialize()
    await this.db.collection("products").updateOne(
      {
        $or: [{ _id: new ObjectId(id) }, { id: id }],
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )
    return { id, ...data }
  }

  async deleteProduct(id: string) {
    await this.initialize()
    await this.db.collection("products").deleteOne({
      $or: [{ _id: new ObjectId(id) }, { id: id }],
    })
    return { success: true }
  }

  async getUsers() {
    await this.initialize()
    return this.db.collection("users").find().toArray()
  }

  async getUserById(id: string) {
    await this.initialize()
    return this.db.collection("users").findOne({
      $or: [{ _id: new ObjectId(id) }, { id: id }],
    })
  }

  async updateUser(id: string, data: any) {
    await this.initialize()
    await this.db.collection("users").updateOne(
      {
        $or: [{ _id: new ObjectId(id) }, { id: id }],
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )
    return { id, ...data }
  }

  async deleteUser(id: string) {
    await this.initialize()
    await this.db.collection("users").deleteOne({
      $or: [{ _id: new ObjectId(id) }, { id: id }],
    })
    return { success: true }
  }

  async getCart(userId: string) {
    await this.initialize()
    const cart = await this.db.collection("carts").findOne({ userId })
    if (!cart) {
      return { items: [], totalQuantity: 0, totalAmount: 0 }
    }
    return cart
  }

  async updateCart(userId: string, items: any[]) {
    await this.initialize()

    // Calcular totales
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Actualizar o crear el carrito
    await this.db.collection("carts").updateOne(
      { userId },
      {
        $set: {
          items,
          totalQuantity,
          totalAmount,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return { items, totalQuantity, totalAmount }
  }

  async getWishlist(userId: string) {
    await this.initialize()
    const wishlist = await this.db.collection("wishlists").findOne({ userId })
    if (!wishlist) {
      return { items: [] }
    }
    return wishlist
  }

  async updateWishlist(userId: string, items: any[]) {
    await this.initialize()

    // Actualizar o crear la lista de deseos
    await this.db.collection("wishlists").updateOne(
      { userId },
      {
        $set: {
          items,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return { items }
  }

  async getStats(params: any) {
    await this.initialize()

    // Implementar lógica para obtener estadísticas según los parámetros
    // Esto podría incluir agregaciones complejas de MongoDB

    // Ejemplo simple para demostración
    const totalUsers = await this.db.collection("users").countDocuments()
    const totalProducts = await this.db.collection("products").countDocuments()

    return {
      totalUsers,
      totalProducts,
      // Otras estadísticas...
    }
  }
}
