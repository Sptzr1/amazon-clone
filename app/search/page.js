"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useSearchParams } from "next/navigation"
import { setSearchQuery, resetFilters } from "@/redux/features/filterSlice"
import ProductCard from "@/components/ProductCard"
import FilterSidebar from "@/components/FilterSidebar"
import { Search } from "lucide-react"

export default function SearchPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { searchQuery } = useSelector((state) => state.filter)

  useEffect(() => {
    if (query && query !== searchQuery) {
      dispatch(setSearchQuery(query))
    }
  }, [query, searchQuery, dispatch])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        if (!searchQuery) {
          setProducts([])
          return
        }

        const response = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error searching products:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      dispatch(resetFilters())
    }
  }, [searchQuery, dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <FilterSidebar />
        </div>

        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold mb-6">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Todos los productos"}
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <Search size={64} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold mb-4">No se encontraron resultados</h2>
              <p className="text-gray-600">
                No hemos encontrado productos que coincidan con tu búsqueda. Intenta con otros términos.
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
