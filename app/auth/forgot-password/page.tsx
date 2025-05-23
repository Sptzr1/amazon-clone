import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { getCurrentUser } from "@/services/authService"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage() {
  // Verificar si el usuario ya está autenticado
  const user = await getCurrentUser()

  // Si ya está autenticado, redirigir a la página principal
  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperar contraseña</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
