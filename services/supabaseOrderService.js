import { createClient } from "@supabase/supabase-js"
import { clearCart } from "./supabaseCartService"

// Create a Supabase client for order operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function createOrder(orderData) {
  try {
    const { userId, items, totalAmount, shippingInfo, paymentInfo } = orderData

    // Create the order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingInfo,
        payment_info: paymentInfo,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Add order items
    const orderItems = items.map((item) => {
      // Find the product ID from external_id
      let productId = Number.parseInt(item.id, 10)
      if (isNaN(productId)) {
        // This is an external_id, we'll need to look it up
        // For now, we'll just use it as is and handle it in a transaction
        productId = item.id
      }

      return {
        order_id: order.id,
        product_id: productId,
        quantity: item.quantity,
        price: item.price,
        total_price: item.totalPrice,
      }
    })

    // Insert order items
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Clear the cart
    await clearCart(userId)

    return {
      success: true,
      order: {
        id: order.id,
        ...orderData,
        createdAt: order.created_at,
      },
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function getOrdersByUser(userId) {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          total_price,
          products (
            id,
            external_id,
            title,
            image_url
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    // Format orders to match the app's expected format
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: Number.parseFloat(order.total_amount),
      createdAt: order.created_at,
      items: order.order_items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number.parseFloat(item.price),
        totalPrice: Number.parseFloat(item.total_price),
        product: {
          id: item.products.external_id || item.products.id.toString(),
          title: item.products.title,
          image: item.products.image_url,
        },
      })),
    }))

    return {
      success: true,
      orders: formattedOrders,
    }
  } catch (error) {
    console.error("Error getting orders:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function getOrderById(orderId) {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          total_price,
          products (
            id,
            external_id,
            title,
            image_url
          )
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      throw error
    }

    // Format order to match the app's expected format
    const formattedOrder = {
      id: order.id,
      userId: order.user_id,
      status: order.status,
      totalAmount: Number.parseFloat(order.total_amount),
      shippingInfo: order.shipping_address,
      paymentInfo: order.payment_info,
      createdAt: order.created_at,
      items: order.order_items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number.parseFloat(item.price),
        totalPrice: Number.parseFloat(item.total_price),
        product: {
          id: item.products.external_id || item.products.id.toString(),
          title: item.products.title,
          image: item.products.image_url,
        },
      })),
    }

    return {
      success: true,
      order: formattedOrder,
    }
  } catch (error) {
    console.error("Error getting order:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
