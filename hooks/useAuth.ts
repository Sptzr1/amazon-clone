"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { loginSuccess, logout } from "@/redux/features/authSlice"
import { useLocalStorage } from "./useLocalStorage"
import { signIn, signUp, signOut, getCurrentUser, requestPasswordReset } from "@/services/authService"

export function useAuth() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state: any) => state.auth)
  const [storedUser, setStoredUser] = useLocalStorage("user", null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkCurrentUser = async () => {
      setLoading(true)
      if (!isAuthenticated && !storedUser) {
        // Intentar obtener el usuario actual
        const currentUser = await getCurrentUser()
        if (currentUser) {
          dispatch(loginSuccess(currentUser))
          setStoredUser(currentUser)
        }
      } else if (storedUser && !isAuthenticated) {
        dispatch(loginSuccess(storedUser))
      }
      setLoading(false)
    }

    checkCurrentUser()
  }, [dispatch, isAuthenticated, storedUser, setStoredUser])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signIn(credentials)

      if (result.success) {
        if (result.redirectUrl) {
          // Si es Auth0, redirigir
          window.location.href = result.redirectUrl
          return { success: true }
        } else if (result.user) {
          // Si es mock, guardar usuario
          dispatch(loginSuccess(result.user))
          setStoredUser(result.user)
          return { success: true }
        }
      }
      return { success: false, error: result.error }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      const result = await signUp(userData)

      if (result.success) {
        if (result.redirectUrl) {
          // Si es Auth0, redirigir
          window.location.href = result.redirectUrl
          return { success: true }
        } else if (result.user) {
          // Si es mock, guardar usuario
          dispatch(loginSuccess(result.user))
          setStoredUser(result.user)
          return { success: true }
        }
      }
      return { success: false, error: result.error }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logoutUser = async () => {
    const result = await signOut()

    if (result.redirectUrl) {
      // Si es Auth0, redirigir
      window.location.href = result.redirectUrl
    } else {
      // Si es mock, limpiar estado
      dispatch(logout())
      setStoredUser(null)
      router.push("/")
    }
  }

  const forgotPassword = async (email: string) => {
    return await requestPasswordReset(email)
  }

  const hasRole = (requiredRole: string | string[]) => {
    if (!user) return false

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }

    return user.role === requiredRole
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout: logoutUser,
    forgotPassword,
    hasRole,
    isUser: () => hasRole("user"),
    isSeller: () => hasRole("seller"),
    isAdmin: () => hasRole("admin"),
    isSuperAdmin: () => hasRole("superadmin"),
    isAdminOrHigher: () => hasRole(["admin", "superadmin"]),
  }
}
