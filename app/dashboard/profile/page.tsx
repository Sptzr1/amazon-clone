import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { getSession } from "@/lib/auth/session"
import { getUserProfile } from "@/services/user-service"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/profile")
  }

  const userProfile = await getUserProfile(session.user.id)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <ProfileForm user={userProfile} />
    </div>
  )
}
