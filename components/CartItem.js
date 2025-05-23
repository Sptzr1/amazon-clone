"use client"

import { useDispatch } from "react-redux"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { updateQuantity, removeFromCart } from "@/redux/features/cartSlice"

export default function CartItem({ item }) {
  const dispatch = useDispatch()

  const handleQuantityChange = (e) => {
    const newQuantity = Number.parseInt(e.target.value)
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }))
    }
  }

  const handleRemove = () => {
    dispatch(removeFromCart(item.id))
  }

  return (
    <div className="p-4 border-b flex flex-col sm:flex-row items-center gap-4">
      <div className="w-24 h-24 relative flex-shrink-0">
        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill style={{ objectFit: "contain" }} />
      </div>

      <div className="flex-grow">
        <Link href={`/product/${item.id}`} className="font-medium hover:text-yellow-600 transition-colors">
          {item.title}
        </Link>

        {item.freeShipping && <p className="text-sm text-green-600 mt-1">Envío gratis</p>}

        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm">
              Cantidad:
            </label>
            <select
              id={`quantity-${item.id}`}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="border rounded p-1"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRemove}
            className="text-red-500 flex items-center text-sm hover:text-red-700 transition-colors"
          >
            <Trash2 size={16} className="mr-1" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="font-bold text-lg">${item.totalPrice.toFixed(2)}</div>
    </div>
  )
}
