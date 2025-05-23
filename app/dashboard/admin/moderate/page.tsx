import { redirect } from "next/navigation"
import { ProductModeration } from "@/components/dashboard/admin/product-moderation"
import { getSession } from "@/lib/auth/session"
import { getPendingProducts } from "@/services/product-service"

export default async function ModerateProductsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/moderate")
  }

  // Verificar si el usuario es admin o superadmin
  if (!["admin", "superadmin"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  const pendingProducts = await getPendingProducts()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Moderación de Productos</h1>
      <ProductModeration products={pendingProducts} />
    </div>
  )
}
