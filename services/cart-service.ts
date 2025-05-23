import { getCart, updateCart } from "@/lib/db"
import { getProductById } from "./product-service"

// Obtener el carrito de un usuario
export async function getUserCart(userId: string) {
  return getCart(userId)
}

// Añadir un producto al carrito
export async function addToCart(userId: string, productId: string, quantity = 1) {
  // Obtener el carrito actual
  const cart = await getCart(userId)

  // Obtener el producto
  const product = await getProductById(productId)
  if (!product) {
    throw new Error("Producto no encontrado")
  }

  // Verificar si el producto ya está en el carrito
  const existingItemIndex = cart.items.findIndex((item) => item.productId === productId)

  if (existingItemIndex !== -1) {
    // Actualizar cantidad si ya existe
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Añadir nuevo item si no existe
    cart.items.push({
      id: `cart-item-${Date.now()}`,
      productId,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    })
  }

  // Actualizar el carrito
  return updateCart(userId, cart.items)
}

// Eliminar un producto del carrito
export async function removeFromCart(userId: string, productId: string) {
  // Obtener el carrito actual
  const cart = await getCart(userId)

  // Filtrar el producto a eliminar
  const updatedItems = cart.items.filter((item) => item.productId !== productId)

  // Actualizar el carrito
  return updateCart(userId, updatedItems)
}

// Actualizar la cantidad de un producto en el carrito
export async function updateCartItemQuantity(userId: string, productId: string, quantity: number) {
  // Obtener el carrito actual
  const cart = await getCart(userId)

  // Encontrar el producto a actualizar
  const updatedItems = cart.items.map((item) => {
    if (item.productId === productId) {
      return { ...item, quantity }
    }
    return item
  })

  // Actualizar el carrito
  return updateCart(userId, updatedItems)
}
