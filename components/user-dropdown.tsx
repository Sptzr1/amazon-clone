"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, User, LogOut, Package, BarChart2, Users, Settings, ChevronDown } from "lucide-react"
import { signOut } from "@/services/authService"

type UserDropdownProps = {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Manejar el cierre de sesión
  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-gray-800 transition-colors"
      >
        <span>{user.name || user.email}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
          <div className="py-1 text-sm text-gray-700">
            {/* Opciones comunes para todos los usuarios */}
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="mr-2" />
              <span>Mi perfil</span>
            </Link>

            <Link
              href="/dashboard/cart"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={16} className="mr-2" />
              <span>Mi carrito</span>
            </Link>

            <Link
              href="/dashboard/wishlist"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={16} className="mr-2" />
              <span>Mi lista de deseos</span>
            </Link>

            {/* Opciones para vendedores */}
            {(user.role === "seller" || user.role === "admin" || user.role === "superadmin") && (
              <>
                <hr className="my-1 border-gray-200" />

                <Link
                  href="/dashboard/seller/add-product"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Package size={16} className="mr-2" />
                  <span>Subir producto</span>
                </Link>

                <Link
                  href="/dashboard/seller/products"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Package size={16} className="mr-2" />
                  <span>Mis productos</span>
                </Link>

                <Link
                  href="/dashboard/seller/sales"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart2 size={16} className="mr-2" />
                  <span>Estadísticas de ventas</span>
                </Link>
              </>
            )}

            {/* Opciones para administradores */}
            {(user.role === "admin" || user.role === "superadmin") && (
              <>
                <hr className="my-1 border-gray-200" />

                <Link
                  href="/dashboard/admin/moderate"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={16} className="mr-2" />
                  <span>Moderar productos</span>
                </Link>

                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Users size={16} className="mr-2" />
                  <span>Gestionar usuarios</span>
                </Link>
              </>
            )}

            {/* Opciones para superadmins */}
            {user.role === "superadmin" && (
              <>
                <hr className="my-1 border-gray-200" />

                <Link
                  href="/dashboard/superadmin/advanced-stats"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart2 size={16} className="mr-2" />
                  <span>Estadísticas avanzadas</span>
                </Link>
              </>
            )}

            <hr className="my-1 border-gray-200" />

            <button onClick={handleSignOut} className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
              <LogOut size={16} className="mr-2" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
