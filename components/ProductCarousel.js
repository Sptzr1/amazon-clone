"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll"

export default function ProductCarousel({ category }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const scrollRef = useHorizontalScroll()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?category=${category}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (loading) {
    return <div className="flex justify-center py-8">Cargando productos...</div>
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>
  }

  if (products.length === 0) {
    return <div className="py-4">No hay productos disponibles en esta categoría.</div>
  }

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-56">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
