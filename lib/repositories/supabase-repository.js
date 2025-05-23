import { ProductRepository } from "./product-repository"
import { createClient } from "@supabase/supabase-js"

export class SupabaseRepository extends ProductRepository {
  constructor() {
    super()
    // Create a Supabase client with the service role key for admin operations
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
    )
  }

  async getAllProducts() {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all products:", error)
      return []
    }

    return this.mapProducts(data)
  }

  async getProductsByCategory(category) {
    const { data: categoryData, error: categoryError } = await this.supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single()

    if (categoryError || !categoryData) {
      console.error("Error fetching category:", categoryError)
      return []
    }

    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("category_id", categoryData.id)

    if (error) {
      console.error(`Error fetching products by category ${category}:`, error)
      return []
    }

    return this.mapProducts(data)
  }

  async getProductById(id) {
    // First try to find by external_id (string ID from the original app)
    let { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("external_id", id)
      .single()

    // If not found, try to find by numeric ID
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

    if (error) {
      console.error(`Error fetching product by ID ${id}:`, error)
      return null
    }

    return this.mapProduct(data)
  }

  async searchProducts(query) {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

    if (error) {
      console.error(`Error searching products with query "${query}":`, error)
      return []
    }

    return this.mapProducts(data)
  }

  async filterProducts(filters) {
    let query = this.supabase.from("products").select("*, categories(name, slug)")

    // Filter by category
    if (filters.category) {
      const { data: categoryData } = await this.supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.category)
        .single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    // Filter by price range
    if (filters.priceRange) {
      query = query.gte("price", filters.priceRange.min).lte("price", filters.priceRange.max)
    }

    // Filter by rating
    if (filters.rating) {
      query = query.gte("rating", filters.rating)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error filtering products:", error)
      return []
    }

    const products = this.mapProducts(data)

    // Apply sorting
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
      }
    }

    return products
  }

  async getSpecialOffers(limit = 8) {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .not("old_price", "is", null)
      .limit(limit)

    if (error) {
      console.error("Error fetching special offers:", error)
      return []
    }

    return this.mapProducts(data)
  }

  async getFeaturedProducts(limit = 8) {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("featured", true)
      .limit(limit)

    if (error) {
      console.error("Error fetching featured products:", error)
      return []
    }

    return this.mapProducts(data)
  }

  async initializeWithSampleData(products) {
    if (!products || products.length === 0) {
      return { success: true, count: 0 }
    }

    // First check if we already have products
    const { count } = await this.supabase.from("products").select("*", { count: "exact", head: true })

    if (count > 0) {
      return { success: true, count }
    }

    // First, ensure we have categories
    const categories = {}
    for (const product of products) {
      if (!categories[product.category]) {
        // Insert the category
        const { data, error } = await this.supabase
          .from("categories")
          .insert({
            name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            slug: product.category,
            image_url: `https://placehold.co/300x300/CCCCCC/333333?text=${product.category}`,
          })
          .select()

        if (error) {
          console.error(`Error creating category ${product.category}:`, error)
          continue
        }

        categories[product.category] = data[0].id
      }
    }

    // Now insert products
    const productsToInsert = products.map((product) => ({
      external_id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      old_price: product.oldPrice || null,
      image_url: product.image,
      category_id: categories[product.category],
      subcategory: product.subcategory,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      free_shipping: product.freeShipping,
      featured: product.featured,
    }))

    // Insert in batches of 50 to avoid payload size limits
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize)
      const { data, error } = await this.supabase.from("products").insert(batch)

      if (error) {
        console.error("Error inserting products batch:", error)
      } else {
        insertedCount += batch.length
      }
    }

    return { success: true, count: insertedCount }
  }

  // Helper method to map Supabase product data to the format expected by the app
  mapProduct(product) {
    if (!product) return null

    return {
      id: product.external_id || product.id.toString(),
      title: product.title,
      description: product.description,
      price: Number.parseFloat(product.price),
      oldPrice: product.old_price ? Number.parseFloat(product.old_price) : null,
      image: product.image_url,
      category: product.categories?.slug || "",
      subcategory: product.subcategory,
      rating: Number.parseFloat(product.rating),
      reviews: product.reviews,
      stock: product.stock,
      freeShipping: product.free_shipping,
      featured: product.featured,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }
  }

  mapProducts(products) {
    return products.map((product) => this.mapProduct(product))
  }
}
