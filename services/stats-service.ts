import { getStats } from "@/lib/db"

// Obtener estadísticas de ventas para un vendedor
export async function getSellerSalesStats(sellerId: string) {
  return getStats({ userId: sellerId })
}

// Obtener estadísticas globales para administradores
export async function getGlobalStats() {
  return getStats({})
}

// Obtener estadísticas avanzadas para superadmins
export async function getAdvancedStats() {
  return getStats({ advanced: true })
}
