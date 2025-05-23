import { redirect } from "next/navigation"
import { WishlistItems } from "@/components/dashboard/wishlist-items"
import { getSession } from "@/lib/auth/session"
import { getUserWishlist } from "@/services/wishlist-service"

export default async function WishlistPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/wishlist")
  }

  const wishlist = await getUserWishlist(session.user.id)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
      <WishlistItems wishlist={wishlist} userId={session.user.id} />
    </div>
  )
}
