import { getWishlist, updateWishlist } from "@/lib/db"
import { getProductById } from "./product-service"
import { addToCart } from "./cart-service"

// Obtener la lista de deseos de un usuario
export async function getUserWishlist(userId: string) {
  return getWishlist(userId)
}

// Añadir un producto a la lista de deseos
export async function addToWishlist(userId: string, productId: string) {
  // Obtener la lista de deseos actual
  const wishlist = await getWishlist(userId)

  // Obtener el producto
  const product = await getProductById(productId)
  if (!product) {
    throw new Error("Producto no encontrado")
  }

  // Verificar si el producto ya está en la lista de deseos
  const existingItemIndex = wishlist.items.findIndex((item) => item.productId === productId)

  if (existingItemIndex === -1) {
    // Añadir nuevo item si no existe
    wishlist.items.push({
      id: `wishlist-item-${Date.now()}`,
      productId,
      title: product.title,
      price: product.price,
      image: product.image,
    })
  }

  // Actualizar la lista de deseos
  return updateWishlist(userId, wishlist.items)
}

// Eliminar un producto de la lista de deseos
export async function removeFromWishlist(userId: string, productId: string) {
  // Obtener la lista de deseos actual
  const wishlist = await getWishlist(userId)

  // Filtrar el producto a eliminar
  const updatedItems = wishlist.items.filter((item) => item.productId !== productId)

  // Actualizar la lista de deseos
  return updateWishlist(userId, updatedItems)
}

// Mover un producto de la lista de deseos al carrito
export async function moveToCart(userId: string, productId: string) {
  // Añadir al carrito
  await addToCart(userId, productId, 1)

  // Eliminar de la lista de deseos
  return removeFromWishlist(userId, productId)
}
