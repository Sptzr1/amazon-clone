"use client"

import { useSelector } from "react-redux"
import Link from "next/link"
import CartItem from "@/components/CartItem"
import CartSummary from "@/components/CartSummary"
import { ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, totalQuantity } = useSelector((state) => state.cart)

  if (totalQuantity === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Parece que aún no has añadido ningún producto a tu carrito</p>
          <Link
            href="/products"
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium inline-block hover:bg-yellow-500 transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Productos ({totalQuantity})</h2>
            </div>

            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
