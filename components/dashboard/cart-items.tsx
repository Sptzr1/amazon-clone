"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateCartItemQuantity, removeFromCart } from "@/services/cart-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartItemsProps {
  cart: {
    items: CartItem[]
    totalAmount: number
  }
  userId: string
}

export function CartItems({ cart, userId }: CartItemsProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const router = useRouter()

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setIsLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      await updateCartItemQuantity(userId, productId, quantity)
      toast({
        title: "Carrito actualizado",
        description: "La cantidad ha sido actualizada correctamente.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setIsLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      await removeFromCart(userId, productId)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  if (cart.items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Tu carrito está vacío.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Ir a Comprar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Productos en tu carrito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    disabled={isLoading[item.productId]}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    disabled={isLoading[item.productId]}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-20 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={isLoading[item.productId]}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-lg font-bold">Total: ${cart.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Impuestos incluidos</p>
          </div>
          <Button>Proceder al Pago</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
