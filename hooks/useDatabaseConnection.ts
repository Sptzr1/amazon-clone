"use client"

import { useState, useEffect } from "react"
import { getRepository, type Repository } from "@/lib/db/repository"

interface UseDatabaseConnectionResult {
  repository: Repository | null
  loading: boolean
  error: Error | null
}

export function useDatabaseConnection(): UseDatabaseConnectionResult {
  const [repository, setRepository] = useState<Repository | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function initRepository() {
      try {
        const repo = await getRepository()
        setRepository(repo)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    initRepository()
  }, [])

  return { repository, loading, error }
}
