import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Heart, User, Package } from "lucide-react"
import Link from "next/link"

interface WelcomeProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function DashboardWelcome({ user }: WelcomeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user.name}</h1>
        <p className="text-muted-foreground">Aquí puedes gestionar tu perfil, carrito de compras y lista de deseos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/profile">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mi Perfil</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Edita tu información personal y preferencias</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/cart">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carrito de Compras</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Gestiona los productos en tu carrito</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/wishlist">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lista de Deseos</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Productos guardados para comprar más tarde</p>
            </CardContent>
          </Card>
        </Link>

        {(user.role === "seller" || user.role === "admin" || user.role === "superadmin") && (
          <Link href="/dashboard/seller/products">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Gestiona tus productos como vendedor</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}
