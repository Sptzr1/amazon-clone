"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, Trash2, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { deleteProduct } from "@/services/product-service"
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
  status: "pending" | "approved" | "rejected"
  rejectionReason?: string
}

interface SellerProductsProps {
  products: Product[]
  userId: string
}

export function SellerProducts({ products, userId }: SellerProductsProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setIsLoading((prev) => ({ ...prev, [selectedProduct.id]: true }))

    try {
      await deleteProduct(selectedProduct.id)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente.",
      })
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [selectedProduct.id]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Aprobado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Rechazado
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No tienes productos publicados.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/seller/add-product")}>
            Añadir Producto
          </Button>
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
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                    <p className="font-medium mt-2">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">{getStatusBadge(product.status)}</div>
                </div>

                {product.status === "rejected" && product.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-50 text-red-800 rounded-md text-sm flex items-start">
                    <XCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Motivo de rechazo: {product.rejectionReason}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {getStatusIcon(product.status)}
                    <span className="ml-1">
                      {product.status === "pending" && "En revisión por moderadores"}
                      {product.status === "approved" && "Publicado y visible para compradores"}
                      {product.status === "rejected" && "Rechazado por moderadores"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/seller/edit-product/${product.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      <span>Editar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedProduct(product)
                        setIsDeleteDialogOpen(true)
                      }}
                      disabled={isLoading[product.id]}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span>Eliminar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isLoading[selectedProduct?.id || ""]}>
              {isLoading[selectedProduct?.id || ""] ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
