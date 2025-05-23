"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { getOrderById } from "@/services/orderService"

export default function OrderConfirmationPage({ params }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const result = await getOrderById(params.id)

        if (result.success) {
          setOrder(result.order)
        } else {
          setError(result.error)
        }
      } catch (error) {
        setError("Error al cargar la información del pedido")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Gracias por tu compra!</h1>
          <p className="text-gray-600">Tu pedido ha sido recibido y está siendo procesado.</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Detalles del pedido</h2>
            <span className="text-sm text-gray-500">Pedido #{params.id}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-center mb-4">
              <Package size={20} className="text-gray-500 mr-2" />
              <span className="font-medium">Estado del pedido:</span>
              <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pendiente</span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Recibirás un correo electrónico con la confirmación de tu pedido y los detalles de envío.
            </p>

            <p className="text-sm text-gray-600">
              Fecha estimada de entrega: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between">
            <Link href="/" className="text-yellow-600 hover:text-yellow-700 transition-colors">
              Volver a la tienda
            </Link>

            <Link
              href="/profile/orders"
              className="bg-yellow-400 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors"
            >
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
