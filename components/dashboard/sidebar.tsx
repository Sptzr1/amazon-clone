"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  ShoppingCart,
  Heart,
  Package,
  BarChart2,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface SidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true,
    seller: user.role === "seller" || user.role === "admin" || user.role === "superadmin",
    admin: user.role === "admin" || user.role === "superadmin",
    superadmin: user.role === "superadmin",
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>

        <nav className="space-y-1">
          {/* Sección de perfil - Todos los usuarios */}
          <Collapsible open={openSections.profile} onOpenChange={() => toggleSection("profile")} className="mb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium">Mi Perfil</span>
              </div>
              {openSections.profile ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-9 space-y-1 mt-1">
              <Link
                href="/dashboard/profile"
                className={cn(
                  "block py-2 px-2 text-sm rounded-md",
                  isActive("/dashboard/profile")
                    ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                Editar Perfil
              </Link>
              <Link
                href="/dashboard/cart"
                className={cn(
                  "block py-2 px-2 text-sm rounded-md",
                  isActive("/dashboard/cart")
                    ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span>Carrito</span>
                </div>
              </Link>
              <Link
                href="/dashboard/wishlist"
                className={cn(
                  "block py-2 px-2 text-sm rounded-md",
                  isActive("/dashboard/wishlist")
                    ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Lista de Deseos</span>
                </div>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Sección de vendedor */}
          {(user.role === "seller" || user.role === "admin" || user.role === "superadmin") && (
            <Collapsible open={openSections.seller} onOpenChange={() => toggleSection("seller")} className="mb-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Vendedor</span>
                </div>
                {openSections.seller ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-9 space-y-1 mt-1">
                <Link
                  href="/dashboard/seller/products"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/seller/products")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  Mis Productos
                </Link>
                <Link
                  href="/dashboard/seller/add-product"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/seller/add-product")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  Añadir Producto
                </Link>
                <Link
                  href="/dashboard/seller/sales"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/seller/sales")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>Estadísticas de Ventas</span>
                  </div>
                </Link>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Sección de administrador */}
          {(user.role === "admin" || user.role === "superadmin") && (
            <Collapsible open={openSections.admin} onOpenChange={() => toggleSection("admin")} className="mb-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Administrador</span>
                </div>
                {openSections.admin ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-9 space-y-1 mt-1">
                <Link
                  href="/dashboard/admin/products"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/admin/products")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  Gestionar Productos
                </Link>
                <Link
                  href="/dashboard/admin/moderate"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/admin/moderate")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  Moderar Productos
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/admin/users")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Gestionar Usuarios</span>
                  </div>
                </Link>
                <Link
                  href="/dashboard/admin/sales"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/admin/sales")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>Estadísticas Globales</span>
                  </div>
                </Link>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Sección de superadmin */}
          {user.role === "superadmin" && (
            <Collapsible
              open={openSections.superadmin}
              onOpenChange={() => toggleSection("superadmin")}
              className="mb-2"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Super Admin</span>
                </div>
                {openSections.superadmin ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-9 space-y-1 mt-1">
                <Link
                  href="/dashboard/superadmin/priority-queue"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/superadmin/priority-queue")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  Cola Prioritaria
                </Link>
                <Link
                  href="/dashboard/superadmin/advanced-stats"
                  className={cn(
                    "block py-2 px-2 text-sm rounded-md",
                    isActive("/dashboard/superadmin/advanced-stats")
                      ? "bg-yellow-50 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>Estadísticas Avanzadas</span>
                  </div>
                </Link>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Cerrar sesión */}
          <Link
            href="/api/auth/logout"
            className="flex items-center p-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span>Cerrar Sesión</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
