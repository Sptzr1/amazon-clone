"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { requestPasswordReset } from "@/services/authService"

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData(event.currentTarget)
      const result = await requestPasswordReset(formData)

      if (result.success) {
        setSuccess(result.message || "Se ha enviado un correo para restablecer tu contraseña")
        // Limpiar el formulario
        ;(event.target as HTMLFormElement).reset()
      } else {
        setError(result.error || "Error al solicitar cambio de contraseña")
      }
    } catch (error) {
      setError("Ocurrió un error inesperado")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}

      {success && <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">{success}</div>}

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Enviar instrucciones"}
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          <Link href="/auth/login" className="text-yellow-600 hover:text-yellow-500">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </form>
  )
}
