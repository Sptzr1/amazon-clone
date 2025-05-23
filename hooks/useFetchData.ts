"use client"

import { useState, useEffect, useCallback } from "react"

interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

interface UseFetchDataOptions<T> {
  url: string
  initialData?: T
  fetchOnMount?: boolean
  options?: FetchOptions
  dependencies?: any[]
}

interface UseFetchDataResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  mutate: (newData: T) => void
}

export function useFetchData<T>({
  url,
  initialData = null,
  fetchOnMount = true,
  options = {},
  dependencies = [],
}: UseFetchDataOptions<T>): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
      }

      const response = await fetch(url, fetchOptions)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [url, options.method, options.headers, options.body])

  useEffect(() => {
    if (fetchOnMount) {
      fetchData()
    }
  }, [fetchData, fetchOnMount, ...dependencies])

  const mutate = (newData: T) => {
    setData(newData)
  }

  return { data, loading, error, refetch: fetchData, mutate }
}
