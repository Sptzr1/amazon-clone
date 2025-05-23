"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"

export default function SpecialOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/offers")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setOffers(data)
      } catch (error) {
        console.error("Error fetching offers:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-8">Cargando ofertas...</div>
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>
  }

  if (offers.length === 0) {
    return <div className="py-4">No hay ofertas disponibles actualmente.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {offers.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
