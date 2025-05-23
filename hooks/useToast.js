"use client"

import { useState, useCallback, useEffect } from "react"

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ message, type, id: Date.now() })

    setTimeout(() => {
      setToast(null)
    }, duration)
  }, [])

  useEffect(() => {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container")

    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed bottom-4 right-4 z-50"
      document.body.appendChild(toastContainer)
    }

    if (toast) {
      const toastElement = document.createElement("div")
      toastElement.className = `p-4 mb-3 rounded-lg shadow-lg max-w-xs ${
        toast.type === "success"
          ? "bg-green-500"
          : toast.type === "error"
            ? "bg-red-500"
            : toast.type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
      } text-white`
      toastElement.textContent = toast.message

      toastContainer.appendChild(toastElement)

      setTimeout(() => {
        toastElement.classList.add("opacity-0", "transition-opacity", "duration-300")
        setTimeout(() => {
          toastContainer.removeChild(toastElement)
        }, 300)
      }, 2700)
    }
  }, [toast])

  return { showToast }
}
