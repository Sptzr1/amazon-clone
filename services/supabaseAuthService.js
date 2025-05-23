import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for auth operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function signUp(userData) {
  const { email, password, name } = userData

  try {
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return {
        success: false,
        error: authError.message,
      }
    }

    // If registration was successful, create a user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: authData.user.id,
        full_name: name,
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }

      return {
        success: true,
        user: {
          id: authData.user.id,
          name,
          email,
          role: "customer",
        },
      }
    }

    return {
      success: false,
      error: "Error creating user",
    }
  } catch (error) {
    console.error("Error in signUp:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function signIn(credentials) {
  const { email, password } = credentials

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (data.user) {
      // Get the user profile
      const { data: profileData } = await supabase.from("user_profiles").select("*").eq("id", data.user.id).single()

      return {
        success: true,
        user: {
          id: data.user.id,
          name: profileData?.full_name || "User",
          email: data.user.email,
          role: profileData?.role || "customer",
        },
      }
    }

    return {
      success: false,
      error: "Invalid credentials",
    }
  } catch (error) {
    console.error("Error in signIn:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error in signOut:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      return null
    }

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.session.user.id)
      .single()

    return {
      id: data.session.user.id,
      name: profileData?.full_name || "User",
      email: data.session.user.email,
      role: profileData?.role || "customer",
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    const { error } = await supabase
      .from("user_profiles")
      .update({
        full_name: profileData.name,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        phone: profileData.phone,
        updated_at: new Date(),
      })
      .eq("id", userId)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
