import { redirect } from "next/navigation"
import { SellerProducts } from "@/components/dashboard/seller/products"
import { getSession } from "@/lib/auth/session"
import { getSellerProducts } from "@/services/product-service"

export default async function SellerProductsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/seller/products")
  }

  // Verificar si el usuario es vendedor, admin o superadmin
  if (!["seller", "admin", "superadmin"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  const products = await getSellerProducts(session.user.id)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Productos</h1>
        <a
          href="/dashboard/seller/add-product"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md"
        >
          Añadir Producto
        </a>
      </div>
      <SellerProducts products={products} userId={session.user.id} />
    </div>
  )
}
