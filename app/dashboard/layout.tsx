import type React from "react"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { getSession } from "@/lib/auth/session"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  // Redirigir a login si no hay sesión
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={session.user} />
        <div className="flex flex-1">
          <DashboardSidebar user={session.user} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
