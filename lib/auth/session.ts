import { auth0 } from "./auth0"
import { mockUsers } from "../db/mock-data"

// Función para obtener la sesión del usuario
export async function getSession() {
  // Verificar si estamos en modo de desarrollo y usar mock
  if (process.env.NODE_ENV === "development" && process.env.USE_MOCK_AUTH === "true") {
    // Usar un usuario mock para desarrollo
    const mockUserId = process.env.MOCK_USER_ID || "user-1"
    const mockUser = mockUsers.find((user) => user.id === mockUserId)

    if (mockUser) {
      return {
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      }
    }

    return null
  }

  try {
    // Obtener la sesión de Auth0
    const session = await auth0.getSession()

    if (!session || !session.user) {
      return null
    }

    // Mapear los roles de Auth0 a los roles de la aplicación
    let role = "user"
    if (session.user[`${process.env.AUTH0_NAMESPACE}/roles`]) {
      const roles = session.user[`${process.env.AUTH0_NAMESPACE}/roles`]
      if (roles.includes("superadmin")) {
        role = "superadmin"
      } else if (roles.includes("admin")) {
        role = "admin"
      } else if (roles.includes("seller")) {
        role = "seller"
      }
    }

    return {
      user: {
        id: session.user.sub,
        name: session.user.name,
        email: session.user.email,
        role,
      },
    }
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    return null
  }
}
