import { redirect } from "next/navigation"
import { CartItems } from "@/components/dashboard/cart-items"
import { getSession } from "@/lib/auth/session"
import { getUserCart } from "@/services/cart-service"

export default async function CartPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/cart")
  }

  const cart = await getUserCart(session.user.id)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Carrito de Compras</h1>
      <CartItems cart={cart} userId={session.user.id} />
    </div>
  )
}
