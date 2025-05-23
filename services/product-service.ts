"use server"

import { getRepository } from "@/lib/db/index"

// Función para obtener todos los productos
export async function getProducts() {
  try {
    const repository = await getRepository()
    return await repository.getProducts()
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return []
  }
}

// Función para obtener un producto por ID
export async function getProductById(id: string) {
  try {
    const repository = await getRepository()
    return await repository.getProductById(id)
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error)
    return null
  }
}

// Función para crear un producto
export async function createProduct(data: any) {
  try {
    const repository = await getRepository()
    return await repository.createProduct(data)
  } catch (error) {
    console.error("Error al crear producto:", error)
    throw error
  }
}

// Función para actualizar un producto
export async function updateProduct(id: string, data: any) {
  try {
    const repository = await getRepository()
    return await repository.updateProduct(id, data)
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error)
    throw error
  }
}

// Función para eliminar un producto
export async function deleteProduct(id: string) {
  try {
    const repository = await getRepository()
    return await repository.deleteProduct(id)
  } catch (error) {
    console.error(`Error al eliminar producto ${id}:`, error)
    throw error
  }
}
