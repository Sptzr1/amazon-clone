"use client"

import { useSelector, useDispatch } from "react-redux"
import { setCategory, setPriceRange, setRating, setSortBy, resetFilters } from "@/redux/features/filterSlice"
import { Star } from "lucide-react"

export default function FilterSidebar() {
  const dispatch = useDispatch()
  const { category, priceRange, rating, sortBy } = useSelector((state) => state.filter)

  const handleCategoryChange = (e) => {
    dispatch(setCategory(e.target.value))
  }

  const handlePriceChange = (min, max) => {
    dispatch(setPriceRange({ min, max }))
  }

  const handleRatingChange = (value) => {
    dispatch(setRating(value))
  }

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value))
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Ordenar por</h3>
        <select value={sortBy} onChange={handleSortChange} className="w-full border rounded p-2">
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="rating">Mejor valorados</option>
          <option value="newest">Más recientes</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Categorías</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={category === ""}
              onChange={handleCategoryChange}
              className="mr-2"
            />
            Todas las categorías
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="electronics"
              checked={category === "electronics"}
              onChange={handleCategoryChange}
              className="mr-2"
            />
            Electrónica
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="home"
              checked={category === "home"}
              onChange={handleCategoryChange}
              className="mr-2"
            />
            Hogar
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="fashion"
              checked={category === "fashion"}
              onChange={handleCategoryChange}
              className="mr-2"
            />
            Moda
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Precio</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={priceRange.min === 0 && priceRange.max === 1000}
              onChange={() => handlePriceChange(0, 1000)}
              className="mr-2"
            />
            Todos los precios
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={priceRange.min === 0 && priceRange.max === 50}
              onChange={() => handlePriceChange(0, 50)}
              className="mr-2"
            />
            Menos de $50
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={priceRange.min === 50 && priceRange.max === 100}
              onChange={() => handlePriceChange(50, 100)}
              className="mr-2"
            />
            $50 - $100
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={priceRange.min === 100 && priceRange.max === 200}
              onChange={() => handlePriceChange(100, 200)}
              className="mr-2"
            />
            $100 - $200
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={priceRange.min === 200 && priceRange.max === 1000}
              onChange={() => handlePriceChange(200, 1000)}
              className="mr-2"
            />
            Más de $200
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Valoración</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((value) => (
            <label key={value} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={rating === value}
                onChange={() => handleRatingChange(value)}
                className="mr-2"
              />
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                ))}
                <span className="ml-1 text-sm">o más</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
