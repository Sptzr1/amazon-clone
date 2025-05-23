// Interfaz para el repositorio de productos
// Cualquier implementación de base de datos debe seguir esta interfaz

export class ProductRepository {
  // Métodos que deben implementar todas las bases de datos

  async getAllProducts() {
    throw new Error("Not implemented")
  }

  async getProductsByCategory(category) {
    throw new Error("Not implemented")
  }

  async getProductById(id) {
    throw new Error("Not implemented")
  }

  async searchProducts(query) {
    throw new Error("Not implemented")
  }

  async getSpecialOffers(limit = 8) {
    throw new Error("Not implemented")
  }

  async getFeaturedProducts(limit = 8) {
    throw new Error("Not implemented")
  }

  async initializeWithSampleData(data) {
    throw new Error("Not implemented")
  }
}
