"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { approveProduct, rejectProduct } from "@/services/product-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  sellerId: string
  sellerName: string
  createdAt: string
}

interface ProductModerationProps {
  products: Product[]
}

export function ProductModeration({ products }: ProductModerationProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleApproveProduct = async (productId: string) => {
    setIsLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      await approveProduct(productId)
      toast({
        title: "Producto aprobado",
        description: "El producto ha sido aprobado y publicado.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleRejectProduct = async () => {
    if (!selectedProduct) return

    setIsLoading((prev) => ({ ...prev, [selectedProduct.id]: true }))

    try {
      await rejectProduct(selectedProduct.id, rejectionReason)
      toast({
        title: "Producto rechazado",
        description: "El producto ha sido rechazado.",
      })
      setIsRejectDialogOpen(false)
      setRejectionReason("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [selectedProduct.id]: false }))
    }
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No hay productos pendientes de moderación.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-48 md:h-auto md:w-48 overflow-hidden">
                <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <p className="font-medium mt-2">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Vendedor: {product.sellerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Fecha: {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsRejectDialogOpen(true)
                    }}
                    disabled={isLoading[product.id]}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    <span>Rechazar</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                    onClick={() => handleApproveProduct(product.id)}
                    disabled={isLoading[product.id]}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Aprobar</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Producto</DialogTitle>
            <DialogDescription>
              Por favor, proporciona un motivo para el rechazo. Esta información será enviada al vendedor.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo del rechazo"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-32"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectProduct}
              disabled={isLoading[selectedProduct?.id || ""] || !rejectionReason.trim()}
            >
              {isLoading[selectedProduct?.id || ""] ? "Rechazando..." : "Rechazar Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
