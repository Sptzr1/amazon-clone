import { NextResponse } from "next/server"
import { generateMoreProducts } from "@/lib/db/dummy/data"
import { createClient } from "@supabase/supabase-js"

// Configuración para Next.js 15.3.2
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Create a Supabase client with the service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
    )

    // Check if we already have products
    const { count } = await supabase.from("products").select("*", { count: "exact", head: true })

    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already seeded with ${count} products.`,
      })
    }

    // Generate dummy products
    const allProducts = generateMoreProducts()
    const products = Object.values(allProducts).flat()

    // First, create categories
    const categories = {}
    for (const product of products) {
      if (!categories[product.category]) {
        // Insert the category
        const { data, error } = await supabase
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
      const { error } = await supabase.from("products").insert(batch)

      if (error) {
        console.error("Error inserting products batch:", error)
      } else {
        insertedCount += batch.length
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${insertedCount} products.`,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
