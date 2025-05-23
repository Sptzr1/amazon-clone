"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { removeFromWishlist, moveToCart } from "@/services/wishlist-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface WishlistItem {
  id: string
  productId: string
  title: string
  price: number
  image: string
}

interface WishlistItemsProps {
  wishlist: {
    items: WishlistItem[]
  }
  userId: string
}

export function WishlistItems({ wishlist, userId }: WishlistItemsProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const router = useRouter()

  const handleRemoveItem = async (productId: string) => {
    setIsLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      await removeFromWishlist(userId, productId)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de tu lista de deseos.",
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

  const handleMoveToCart = async (productId: string) => {
    setIsLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      await moveToCart(userId, productId)
      toast({
        title: "Producto añadido al carrito",
        description: "El producto ha sido añadido a tu carrito de compras.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir el producto al carrito. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  if (wishlist.items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Tu lista de deseos está vacía.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Ir a Comprar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {wishlist.items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-md">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center"
                    onClick={() => handleMoveToCart(item.productId)}
                    disabled={isLoading[item.productId]}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span>Añadir al Carrito</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={isLoading[item.productId]}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
