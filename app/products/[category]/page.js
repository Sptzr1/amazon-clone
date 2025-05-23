"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setCategory } from "@/redux/features/filterSlice"
import ProductCard from "@/components/ProductCard"
import FilterSidebar from "@/components/FilterSidebar"

// Mapeo de categorías para mostrar nombres amigables
const categoryNames = {
  electronics: "Electrónica",
  home: "Hogar",
  fashion: "Moda",
  books: "Libros",
  sports: "Deportes",
  toys: "Juguetes",
  beauty: "Belleza",
  grocery: "Alimentación",
  automotive: "Automotriz",
}

export default function CategoryPage({ params }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const category = params.category

  useEffect(() => {
    // Actualizar el estado global con la categoría actual
    dispatch(setCategory(category))

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
        console.error("Error fetching category products:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, dispatch])

  const categoryTitle = categoryNames[category] || category

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <FilterSidebar />
        </div>

        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold mb-6">{categoryTitle}</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">No hay productos disponibles</h2>
              <p className="text-gray-600">
                No hemos encontrado productos en esta categoría. Por favor, intenta más tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
