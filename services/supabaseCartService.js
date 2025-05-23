import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for cart operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function getCart(userId) {
  try {
    // First, find or create a cart for the user
    let { data: cart } = await supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      // Create a new cart
      const { data: newCart, error } = await supabase.from("carts").insert({ user_id: userId }).select().single()

      if (error) {
        throw error
      }

      cart = newCart
    }

    // Get cart items with product details
    const { data: cartItems, error } = await supabase
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

    if (error) {
      throw error
    }

    // Format cart items to match the app's expected format
    const formattedItems = cartItems.map((item) => ({
      id: item.products.external_id || item.products.id.toString(),
      title: item.products.title,
      price: Number.parseFloat(item.products.price),
      oldPrice: item.products.old_price ? Number.parseFloat(item.products.old_price) : null,
      image: item.products.image_url,
      quantity: item.quantity,
      totalPrice: Number.parseFloat(item.products.price) * item.quantity,
      freeShipping: item.products.free_shipping,
    }))

    // Calculate totals
    const totalQuantity = formattedItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0)

    return {
      items: formattedItems,
      totalQuantity,
      totalAmount,
    }
  } catch (error) {
    console.error("Error getting cart:", error)
    return { items: [], totalQuantity: 0, totalAmount: 0 }
  }
}

export async function addToCart(userId, product, quantity = 1) {
  try {
    // First, find or create a cart for the user
    let { data: cart } = await supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      // Create a new cart
      const { data: newCart, error } = await supabase.from("carts").insert({ user_id: userId }).select().single()

      if (error) {
        throw error
      }

      cart = newCart
    }

    // Find the product ID from external_id
    const { data: productData } = await supabase.from("products").select("id").eq("external_id", product.id).single()

    const productId = productData?.id || Number.parseInt(product.id, 10)

    // Check if the item is already in the cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)

      if (error) {
        throw error
      }
    } else {
      // Add new item
      const { error } = await supabase.from("cart_items").insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      })

      if (error) {
        throw error
      }
    }

    return await getCart(userId)
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export async function removeFromCart(userId, productId, quantity = 1) {
  try {
    // Get the user's cart
    const { data: cart } = await supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      throw new Error("Cart not found")
    }

    // Find the product ID from external_id
    const { data: productData } = await supabase.from("products").select("id").eq("external_id", productId).single()

    const dbProductId = productData?.id || Number.parseInt(productId, 10)

    // Get the cart item
    const { data: item } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", dbProductId)
      .single()

    if (!item) {
      throw new Error("Item not found in cart")
    }

    if (item.quantity <= quantity) {
      // Remove the item completely
      await supabase.from("cart_items").delete().eq("id", item.id)
    } else {
      // Decrease quantity
      await supabase
        .from("cart_items")
        .update({ quantity: item.quantity - quantity })
        .eq("id", item.id)
    }

    return await getCart(userId)
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export async function updateCartItemQuantity(userId, productId, quantity) {
  try {
    // Get the user's cart
    const { data: cart } = await supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      throw new Error("Cart not found")
    }

    // Find the product ID from external_id
    const { data: productData } = await supabase.from("products").select("id").eq("external_id", productId).single()

    const dbProductId = productData?.id || Number.parseInt(productId, 10)

    // Get the cart item
    const { data: item } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", dbProductId)
      .single()

    if (!item) {
      throw new Error("Item not found in cart")
    }

    if (quantity <= 0) {
      // Remove the item completely
      await supabase.from("cart_items").delete().eq("id", item.id)
    } else {
      // Update quantity
      await supabase.from("cart_items").update({ quantity }).eq("id", item.id)
    }

    return await getCart(userId)
  } catch (error) {
    console.error("Error updating cart item quantity:", error)
    throw error
  }
}

export async function clearCart(userId) {
  try {
    // Get the user's cart
    const { data: cart } = await supabase.from("carts").select("*").eq("user_id", userId).single()

    if (!cart) {
      return { items: [], totalQuantity: 0, totalAmount: 0 }
    }

    // Delete all cart items
    await supabase.from("cart_items").delete().eq("cart_id", cart.id)

    return { items: [], totalQuantity: 0, totalAmount: 0 }
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}
