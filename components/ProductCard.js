"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { addToCart } from "@/redux/features/cartSlice"
import { useToast } from "@/hooks/useToast"

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(addToCart(product))
    showToast("Producto añadido al carrito", "success")
  }

  // Función para manejar errores de carga de imágenes
  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/300x300/CCCCCC/333333?text=${product.category || "Product"}`
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square">
        <img
          src={product.image || `https://placehold.co/300x300/CCCCCC/333333?text=${product.category || "Product"}`}
          alt={product.title}
          className="w-full h-full object-contain p-4"
          onError={handleImageError}
        />

        {isHovered && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-500 transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{product.title}</h3>

        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>

          {product.freeShipping && <span className="text-xs text-green-600">Envío gratis</span>}
        </div>
      </div>
    </Link>
  )
}
