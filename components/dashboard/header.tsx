"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function DashboardHeader({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-yellow-400">
            AmazonClone
          </Link>
          <Badge variant="outline" className="ml-2 capitalize">
            {user.role}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>No hay notificaciones nuevas</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>{user.name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/profile">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/api/auth/logout">Cerrar Sesión</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
