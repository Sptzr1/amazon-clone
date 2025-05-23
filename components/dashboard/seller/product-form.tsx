"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, updateProduct } from "@/services/product-service"
import { useToast } from "@/components/ui/use-toast"

const productFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  category: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  stock: z.coerce.number().int().nonnegative({
    message: "El stock debe ser un número entero no negativo.",
  }),
  image: z
    .string()
    .url({
      message: "Por favor ingresa una URL de imagen válida.",
    })
    .optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  userId: string
  product?: {
    id: string
    title: string
    description: string
    price: number
    category: string
    stock: number
    image?: string
  }
}

export function ProductForm({ userId, product }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!product

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      stock: product?.stock || 0,
      image: product?.image || "",
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)

    try {
      if (isEditing && product) {
        await updateProduct(product.id, {
          ...data,
          sellerId: userId,
        })
        toast({
          title: "Producto actualizado",
          description: "Tu producto ha sido actualizado y está pendiente de moderación.",
        })
      } else {
        await createProduct({
          ...data,
          sellerId: userId,
        })
        toast({
          title: "Producto creado",
          description: "Tu producto ha sido creado y está pendiente de moderación.",
        })
      }
      router.push("/dashboard/seller/products")
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing
          ? "No se pudo actualizar el producto. Inténtalo de nuevo."
          : "No se pudo crear el producto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormDescription>Un título descriptivo para tu producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe tu producto" className="resize-none min-h-32" {...field} />
                  </FormControl>
                  <FormDescription>Proporciona detalles sobre tu producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electrónica</SelectItem>
                      <SelectItem value="home">Hogar</SelectItem>
                      <SelectItem value="fashion">Moda</SelectItem>
                      <SelectItem value="books">Libros</SelectItem>
                      <SelectItem value="sports">Deportes</SelectItem>
                      <SelectItem value="toys">Juguetes</SelectItem>
                      <SelectItem value="beauty">Belleza</SelectItem>
                      <SelectItem value="grocery">Alimentación</SelectItem>
                      <SelectItem value="automotive">Automotriz</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Selecciona la categoría que mejor describe tu producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                  </FormControl>
                  <FormDescription>Proporciona una URL para la imagen de tu producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/seller/products")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditing
                    ? "Actualizar Producto"
                    : "Crear Producto"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
