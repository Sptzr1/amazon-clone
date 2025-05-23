import type { Repository } from "./repository"
import { mockProducts, mockUsers, mockCarts, mockWishlists, mockStats } from "./mock-data"

export class MockRepository implements Repository {
  async getProducts() {
    return mockProducts
  }

  async getProductById(id: string) {
    return mockProducts.find((product) => product.id === id)
  }

  async createProduct(data: any) {
    const newProduct = {
      id: `product-${mockProducts.length + 1}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending",
    }
    mockProducts.push(newProduct)
    return newProduct
  }

  async updateProduct(id: string, data: any) {
    const index = mockProducts.findIndex((product) => product.id === id)
    if (index !== -1) {
      mockProducts[index] = {
        ...mockProducts[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return mockProducts[index]
    }
    throw new Error("Producto no encontrado")
  }

  async deleteProduct(id: string) {
    const index = mockProducts.findIndex((product) => product.id === id)
    if (index !== -1) {
      mockProducts.splice(index, 1)
      return { success: true }
    }
    throw new Error("Producto no encontrado")
  }

  async getUsers() {
    return mockUsers
  }

  async getUserById(id: string) {
    return mockUsers.find((user) => user.id === id)
  }

  async updateUser(id: string, data: any) {
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return mockUsers[index]
    }
    throw new Error("Usuario no encontrado")
  }

  async deleteUser(id: string) {
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      mockUsers.splice(index, 1)
      return { success: true }
    }
    throw new Error("Usuario no encontrado")
  }

  async getCart(userId: string) {
    const cart = mockCarts.find((cart) => cart.userId === userId)
    if (!cart) {
      return { items: [], totalQuantity: 0, totalAmount: 0 }
    }
    return cart
  }

  async updateCart(userId: string, items: any[]) {
    const index = mockCarts.findIndex((cart) => cart.userId === userId)

    // Calcular totales
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const updatedCart = {
      userId,
      items,
      totalQuantity,
      totalAmount,
      updatedAt: new Date().toISOString(),
    }

    if (index !== -1) {
      mockCarts[index] = updatedCart
    } else {
      mockCarts.push(updatedCart)
    }

    return updatedCart
  }

  async getWishlist(userId: string) {
    const wishlist = mockWishlists.find((wishlist) => wishlist.userId === userId)
    if (!wishlist) {
      return { items: [] }
    }
    return wishlist
  }

  async updateWishlist(userId: string, items: any[]) {
    const index = mockWishlists.findIndex((wishlist) => wishlist.userId === userId)

    const updatedWishlist = {
      userId,
      items,
      updatedAt: new Date().toISOString(),
    }

    if (index !== -1) {
      mockWishlists[index] = updatedWishlist
    } else {
      mockWishlists.push(updatedWishlist)
    }

    return updatedWishlist
  }

  async getStats(params: any) {
    // Filtrar estadísticas según los parámetros
    if (params?.userId) {
      // Estadísticas para un vendedor específico
      return (
        mockStats.seller[params.userId] || {
          monthlySales: [],
          topProducts: [],
          totalSales: 0,
          totalOrders: 0,
          averageOrderValue: 0,
        }
      )
    }

    if (params?.advanced) {
      // Estadísticas avanzadas para superadmin
      return mockStats.advanced
    }

    // Estadísticas globales para admin
    return mockStats.global
  }
}
