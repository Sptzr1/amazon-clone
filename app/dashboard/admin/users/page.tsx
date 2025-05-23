import { redirect } from "next/navigation"
import { UserManagement } from "@/components/dashboard/admin/user-management"
import { getSession } from "@/lib/auth/session"
import { getAllUsers } from "@/services/user-service"

export default async function UsersManagementPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/users")
  }

  // Verificar si el usuario es admin o superadmin
  if (!["admin", "superadmin"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  const users = await getAllUsers()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      <UserManagement users={users} currentUserId={session.user.id} />
    </div>
  )
}
