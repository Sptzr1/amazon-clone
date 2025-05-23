import { redirect } from "next/navigation"
import { DashboardWelcome } from "@/components/dashboard/welcome"
import { getSession } from "@/lib/auth/session"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard")
  }

  // Redirigir a la sección correspondiente según el rol
  const role = session.user.role
  if (role === "seller") {
    redirect("/dashboard/seller")
  } else if (role === "admin") {
    redirect("/dashboard/admin")
  } else if (role === "superadmin") {
    redirect("/dashboard/superadmin")
  }

  // Para usuarios normales, mostrar la página de bienvenida
  return <DashboardWelcome user={session.user} />
}
