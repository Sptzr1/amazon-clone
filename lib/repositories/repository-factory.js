// This file provides a function to get the appropriate repository

let repository = null

export async function getProductRepository() {
  // If we already have a repository, reuse it
  if (repository) {
    return repository
  }

  // Check if we're on the client
  if (typeof window !== "undefined") {
    // On the client, use the dummy repository
    const { DummyRepository } = await import("./dummy-repository")
    repository = new DummyRepository()
    return repository
  }

  // On the server, try to use Supabase first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const { SupabaseRepository } = await import("./supabase-repository")
      repository = new SupabaseRepository()
      return repository
    } catch (error) {
      console.error("Error loading Supabase repository:", error)
    }
  }

  // If Supabase fails or isn't configured, try MongoDB
  if (process.env.MONGODB_URI) {
    try {
      const { MongoDBRepository } = await import("./mongodb-repository")
      repository = new MongoDBRepository()
      return repository
    } catch (error) {
      console.error("Error loading MongoDB repository:", error)
    }
  }

  // If all else fails, use the dummy repository
  const { DummyRepository } = await import("./dummy-repository")
  repository = new DummyRepository()
  return repository
}
