"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { setSearchQuery } from "@/redux/features/filterSlice"
import { useRouter } from "next/navigation"

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const { totalQuantity } = useSelector((state) => state.cart)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setSearchQuery(searchTerm))
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold mr-8">
              AmazonClone
            </Link>

            <button className="lg:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu size={24} />
            </button>

            <nav className="hidden lg:flex space-x-6 ml-6">
              <Link href="/products" className="hover:text-yellow-400">
                Todos los productos
              </Link>
              <Link href="/products/electronics" className="hover:text-yellow-400">
                Electrónica
              </Link>
              <Link href="/products/home" className="hover:text-yellow-400">
                Hogar
              </Link>
              <Link href="/products/fashion" className="hover:text-yellow-400">
                Moda
              </Link>
              <Link href="/products/books" className="hover:text-yellow-400">
                Libros
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="py-2 px-4 pr-10 rounded-lg text-black w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500">
                  <Search size={20} />
                </button>
              </div>
            </form>

            <Link href="/cart" className="relative">
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link href="/profile" className="flex items-center">
                <User size={24} className="mr-2" />
                <span className="hidden md:inline">{user?.name}</span>
              </Link>
            ) : (
              <Link href="/auth/login" className="hover:text-yellow-400">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <nav className="lg:hidden py-4 border-t border-gray-700">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="py-2 px-4 pr-10 rounded-lg text-black w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500">
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="flex flex-col space-y-3">
              <Link href="/products" className="hover:text-yellow-400">
                Todos los productos
              </Link>
              <Link href="/products/electronics" className="hover:text-yellow-400">
                Electrónica
              </Link>
              <Link href="/products/home" className="hover:text-yellow-400">
                Hogar
              </Link>
              <Link href="/products/fashion" className="hover:text-yellow-400">
                Moda
              </Link>
              <Link href="/products/books" className="hover:text-yellow-400">
                Libros
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
