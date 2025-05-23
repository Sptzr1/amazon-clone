import { redirect } from "next/navigation"
import { SellerSalesStats } from "@/components/dashboard/seller/sales-stats"
import { getSession } from "@/lib/auth/session"
import { getSellerSalesStats } from "@/services/stats-service"

export default async function SellerSalesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/seller/sales")
  }

  // Verificar si el usuario es vendedor, admin o superadmin
  if (!["seller", "admin", "superadmin"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  const stats = await getSellerSalesStats(session.user.id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Estadísticas de Ventas</h1>
      <SellerSalesStats stats={stats} />
    </div>
  )
}
