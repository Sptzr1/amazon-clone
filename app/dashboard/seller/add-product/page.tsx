import { redirect } from "next/navigation"
import { ProductForm } from "@/components/dashboard/seller/product-form"
import { getSession } from "@/lib/auth/session"

export default async function AddProductPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/seller/add-product")
  }

  // Verificar si el usuario es vendedor, admin o superadmin
  if (!["seller", "admin", "superadmin"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Añadir Nuevo Producto</h1>
      <ProductForm userId={session.user.id} />
    </div>
  )
}
