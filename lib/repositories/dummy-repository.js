import { ProductRepository } from "./product-repository"
import { generateMoreProducts } from "../db/dummy/data"

export class DummyRepository extends ProductRepository {
  constructor() {
    super()
    this.allProducts = generateMoreProducts()
    this.flattenedProducts = Object.values(this.allProducts).flat()
  }

  async getAllProducts() {
    return this.flattenedProducts
  }

  async getProductsByCategory(category) {
    return this.allProducts[category] || []
  }

  async getProductById(id) {
    const product = this.flattenedProducts.find((p) => p.id === id)
    if (!product) {
      throw new Error("Producto no encontrado")
    }
    return product
  }

  async searchProducts(query) {
    return this.flattenedProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  async getSpecialOffers(limit = 8) {
    return this.flattenedProducts.filter((p) => p.oldPrice).slice(0, limit)
  }

  async getFeaturedProducts(limit = 8) {
    return this.flattenedProducts.filter((p) => p.featured).slice(0, limit)
  }

  async initializeWithSampleData() {
    return { success: true, count: this.flattenedProducts.length }
  }
}
