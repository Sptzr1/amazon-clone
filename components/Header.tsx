import Link from "next/link"
import { getCurrentUser } from "@/services/authService"
import UserDropdown from "./user-dropdown"

export default async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-yellow-400">
            AmazonClone
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
