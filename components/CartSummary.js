"use client"

import { useSelector } from "react-redux"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function CartSummary() {
  const { totalAmount, items } = useSelector((state) => state.cart)
  const { isAuthenticated } = useAuth()

  const shippingCost = totalAmount > 50 ? 0 : 5.99
  const tax = totalAmount * 0.16 // 16% de impuesto
  const totalWithTaxAndShipping = totalAmount + shippingCost + tax

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} productos)</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Envío</span>
          {shippingCost === 0 ? (
            <span className="text-green-600">Gratis</span>
          ) : (
            <span>${shippingCost.toFixed(2)}</span>
          )}
        </div>

        <div className="flex justify-between">
          <span>Impuestos</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${totalWithTaxAndShipping.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {isAuthenticated ? (
          <Link
            href="/checkout"
            className="bg-yellow-400 text-black w-full py-2 rounded-full font-medium text-center block hover:bg-yellow-500 transition-colors"
          >
            Proceder al pago
          </Link>
        ) : (
          <Link
            href="/auth/login?redirect=/checkout"
            className="bg-yellow-400 text-black w-full py-2 rounded-full font-medium text-center block hover:bg-yellow-500 transition-colors"
          >
            Iniciar sesión para continuar
          </Link>
        )}

        <Link
          href="/products"
          className="mt-3 text-center block w-full text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
