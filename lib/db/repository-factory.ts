// Este archivo solo debe ser importado en el servidor
import type { Repository } from "./repository"
import { MockRepository } from "./mock-repository"

// Importaciones condicionales para evitar cargar MongoDB en el cliente
let MongoDBRepository: any
let SupabaseRepository: any

// Solo importamos las implementaciones en el servidor
if (typeof window === "undefined") {
  const mongoModule = require("./mongodb-repository")
  MongoDBRepository = mongoModule.MongoDBRepository

  const supabaseModule = require("./supabase-repository")
  SupabaseRepository = supabaseModule.SupabaseRepository
}

// Función para obtener la instancia del repositorio según la configuración
export function getRepositoryInstance(): Repository {
  // Verificamos que estamos en el servidor
  if (typeof window !== "undefined") {
    throw new Error("Esta función solo debe ser llamada en el servidor")
  }

  // Determinamos qué implementación usar según las variables de entorno
  const implementation = process.env.DB_IMPLEMENTATION || "mock"

  switch (implementation.toLowerCase()) {
    case "mongodb":
      if (!MongoDBRepository) {
        throw new Error("MongoDB no está disponible")
      }
      return new MongoDBRepository()

    case "supabase":
      if (!SupabaseRepository) {
        throw new Error("Supabase no está disponible")
      }
      return new SupabaseRepository()

    case "mock":
    default:
      return new MockRepository()
  }
}
