import { MongoDBRepository } from "./mongodb-repository"
import { SupabaseRepository } from "./supabase-repository"
import { MockRepository } from "./mock-repository"

// Interfaz para el repositorio
export interface Repository {
  // Productos
  getProducts(): Promise<any[]>
  getProductById(id: string): Promise<any>
  createProduct(data: any): Promise<any>
  updateProduct(id: string, data: any): Promise<any>
  deleteProduct(id: string): Promise<any>

  // Usuarios
  getUsers(): Promise<any[]>
  getUserById(id: string): Promise<any>
  createUser(data: any): Promise<any>
  updateUser(id: string, data: any): Promise<any>
  deleteUser(id: string): Promise<any>

  // Carrito
  getCart(userId: string): Promise<any>
  updateCart(userId: string, items: any[]): Promise<any>

  // Lista de deseos
  getWishlist(userId: string): Promise<any>
  updateWishlist(userId: string, items: any[]): Promise<any>

  // Estadísticas
  getStats(params: any): Promise<any>
}

// Factory para obtener el repositorio adecuado
export async function getRepository(): Promise<Repository> {
  // Determinar qué repositorio usar según la configuración
  const dbImplementation = process.env.DB_IMPLEMENTATION || "mock"

  switch (dbImplementation) {
    case "mongodb":
      return new MongoDBRepository()
    case "supabase":
      return new SupabaseRepository()
    case "mock":
    default:
      return new MockRepository()
  }
}
