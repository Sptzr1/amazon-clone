"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Image from "next/image"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react"
import { addToCart } from "@/redux/features/cartSlice"
import { useToast } from "@/hooks/useToast"
import ProductCarousel from "@/components/ProductCarousel"

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const dispatch = useDispatch()
  const { showToast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?id=${params.id}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        if (!data || Object.keys(data).length === 0) {
          throw new Error("Producto no encontrado")
        }

        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }))
    showToast(`${product.title} añadido al carrito`, "success")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Producto no encontrado"}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative aspect-square">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews} reseñas)</span>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-500 line-through ml-3">${product.oldPrice.toFixed(2)}</span>
              )}
            </div>

            {product.freeShipping && (
              <div className="text-green-600 flex items-center mt-2">
                <Truck size={16} className="mr-1" />
                Envío gratis
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              className="border rounded p-2 w-20"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-medium flex items-center justify-center hover:bg-yellow-500 transition-colors flex-grow"
            >
              <ShoppingCart size={20} className="mr-2" />
              Añadir al carrito
            </button>

            <button className="border border-gray-300 px-6 py-3 rounded-full font-medium flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Heart size={20} className="mr-2" />
              Añadir a favoritos
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Truck size={20} className="text-gray-500 mr-2" />
              <span className="text-sm">Envío rápido</span>
            </div>
            <div className="flex items-center">
              <Shield size={20} className="text-gray-500 mr-2" />
              <span className="text-sm">Garantía de calidad</span>
            </div>
            <div className="flex items-center">
              <RotateCcw size={20} className="text-gray-500 mr-2" />
              <span className="text-sm">Devolución fácil</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
        <ProductCarousel category={product.category} />
      </div>
    </div>
  )
}
