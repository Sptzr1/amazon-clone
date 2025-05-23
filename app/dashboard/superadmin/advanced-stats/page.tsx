import { redirect } from "next/navigation"
import { AdvancedStats } from "@/components/dashboard/superadmin/advanced-stats"
import { getSession } from "@/lib/auth/session"
import { getAdvancedStats } from "@/services/stats-service"

export default async function AdvancedStatsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/superadmin/advanced-stats")
  }

  // Verificar si el usuario es superadmin
  if (session.user.role !== "superadmin") {
    redirect("/dashboard")
  }

  const stats = await getAdvancedStats()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Estadísticas Avanzadas</h1>
      <AdvancedStats stats={stats} />
    </div>
  )
}
