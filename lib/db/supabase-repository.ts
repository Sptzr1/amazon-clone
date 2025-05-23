import { createClient } from "@supabase/supabase-js"
import type { Repository } from "./repository"

export class SupabaseRepository implements Repository {
  private supabase: any = null

  constructor() {
    this.initialize()
  }

  private initialize() {
    if (!this.supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL o Key no están configurados")
      }

      this.supabase = createClient(supabaseUrl, supabaseKey)
    }
  }

  async getProducts() {
    const { data, error } = await this.supabase.from("products").select("*, categories(name, slug)")

    if (error) throw error
    return data
  }

  async getProductById(id: string) {
    // Primero intentar buscar por external_id
    let { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("external_id", id)
      .single()

    // Si no se encuentra, intentar buscar por id numérico
    if (!data && !error) {
      const numericId = Number.parseInt(id, 10)
      if (!isNaN(numericId)) {
        const result = await this.supabase
          .from("products")
          .select("*, categories(name, slug)")
          .eq("id", numericId)
          .single()

        data = result.data
        error = result.error
      }
    }

    if (error) throw error
    return data
  }

  async createProduct(data: any) {
    const { data: product, error } = await this.supabase
      .from("products")
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        old_price: data.oldPrice,
        image_url: data.image,
        category_id: data.categoryId,
        subcategory: data.subcategory,
        stock: data.stock,
        seller_id: data.sellerId,
        status: "pending",
        free_shipping: data.freeShipping || false,
        featured: data.featured || false,
      })
      .select()
      .single()

    if (error) throw error
    return product
  }

  async updateProduct(id: string, data: any) {
    const { data: product, error } = await this.supabase
      .from("products")
      .update({
        title: data.title,
        description: data.description,
        price: data.price,
        old_price: data.oldPrice,
        image_url: data.image,
        category_id: data.categoryId,
        subcategory: data.subcategory,
        stock: data.stock,
        status: data.status || "pending",
        free_shipping: data.freeShipping,
        featured: data.featured,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return product
  }

  async deleteProduct(id: string) {
    const { error } = await this.supabase.from("products").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  }

  async getUsers() {
    const { data, error } = await this.supabase.from("user_profiles").select("*, auth.users(email)")

    if (error) throw error

    // Formatear los datos para que coincidan con la estructura esperada
    return data.map((user: any) => ({
      id: user.id,
      name: user.full_name,
      email: user.auth?.users?.email,
      role: user.role,
      createdAt: user.created_at,
    }))
  }

  async getUserById(id: string) {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .select("*, auth.users(email)")
      .eq("id", id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.full_name,
      email: data.auth?.users?.email,
      role: data.role,
      bio: data.bio,
      address: data.address,
      phone: data.phone,
      createdAt: data.created_at,
    }
  }

  async updateUser(id: string, data: any) {
    const { data: user, error } = await this.supabase
      .from("user_profiles")
      .update({
        full_name: data.name,
        bio: data.bio,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        phone: data.phone,
        role: data.role,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return user
  }

  async deleteUser(id: string) {
    // Primero eliminar el perfil de usuario
    const { error: profileError } = await this.supabase.from("user_profiles").delete().eq("id", id)

    if (profileError) throw profileError

    // Luego eliminar el usuario de auth (requiere permisos de admin)
    const { error: authError } = await this.supabase.auth.admin.deleteUser(id)

    if (authError) throw authError

    return { success: true }
  }

  async getCart(userId: string) {
    // Primero, encontrar o crear un carrito para el usuario
    let { data: cart } = await this.supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      // Crear un nuevo carrito
      const { data: newCart, error } = await this.supabase.from("carts").insert({ user_id: userId }).select().single()

      if (error) throw error
      cart = newCart
    }

    // Obtener los items del carrito con detalles del producto
    const { data: cartItems, error } = await this.supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        products (
          id,
          external_id,
          title,
          price,
          old_price,
          image_url,
          free_shipping
        )
      `)
      .eq("cart_id", cart.id)

    if (error) throw error

    // Formatear los items para que coincidan con la estructura esperada
    const formattedItems = cartItems.map((item: any) => ({
      id: item.id,
      productId: item.products.external_id || item.products.id.toString(),
      title: item.products.title,
      price: Number.parseFloat(item.products.price),
      image: item.products.image_url,
      quantity: item.quantity,
    }))

    // Calcular totales
    const totalQuantity = formattedItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const totalAmount = formattedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    return {
      items: formattedItems,
      totalQuantity,
      totalAmount,
    }
  }

  async updateCart(userId: string, items: any[]) {
    // Primero, encontrar o crear un carrito para el usuario
    let { data: cart } = await this.supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      // Crear un nuevo carrito
      const { data: newCart, error } = await this.supabase.from("carts").insert({ user_id: userId }).select().single()

      if (error) throw error
      cart = newCart
    }

    // Eliminar todos los items actuales
    await this.supabase.from("cart_items").delete().eq("cart_id", cart.id)

    // Insertar los nuevos items
    for (const item of items) {
      // Encontrar el ID del producto
      const { data: productData } = await this.supabase
        .from("products")
        .select("id")
        .eq("external_id", item.productId)
        .single()

      const productId = productData?.id || Number.parseInt(item.productId, 10)

      await this.supabase.from("cart_items").insert({
        cart_id: cart.id,
        product_id: productId,
        quantity: item.quantity,
      })
    }

    // Devolver el carrito actualizado
    return this.getCart(userId)
  }

  async getWishlist(userId: string) {
    // Implementación similar a getCart pero para wishlist
    // ...

    // Ejemplo simplificado para demostración
    return { items: [] }
  }

  async updateWishlist(userId: string, items: any[]) {
    // Implementación similar a updateCart pero para wishlist
    // ...

    // Ejemplo simplificado para demostración
    return { items }
  }

  async getStats(params: any) {
    // Implementar lógica para obtener estadísticas según los parámetros
    // Esto podría incluir consultas complejas a Supabase

    // Ejemplo simple para demostración
    const { count: totalUsers } = await this.supabase.from("user_profiles").select("*", { count: "exact", head: true })

    const { count: totalProducts } = await this.supabase.from("products").select("*", { count: "exact", head: true })

    return {
      totalUsers,
      totalProducts,
      // Otras estadísticas...
    }
  }
}
