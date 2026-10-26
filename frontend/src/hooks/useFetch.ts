import { useEffect, useState } from "react"

const cache = new Map<string, unknown>()
const requests = new Map<string, Promise<unknown>>()

export interface FetchState<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  error: Error | undefined
}

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  enabled = true,
  cacheKey = JSON.stringify(deps),
): FetchState<T> {
  const [state, setState] = useState<FetchState<T> & { key: string }>(() => {
    const data = cache.get(cacheKey) as T | undefined
    return {
      key: cacheKey,
      data,
      isLoading: enabled && data === undefined,
      isError: false,
      error: undefined,
    }
  })

  useEffect(() => {
    if (!enabled) return

    const cached = cache.get(cacheKey) as T | undefined
    if (cached !== undefined) {
      setState({
        key: cacheKey,
        data: cached,
        isLoading: false,
        isError: false,
        error: undefined,
      })
      return
    }

    let cancelled = false
    setState({
      key: cacheKey,
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    })

    let request = requests.get(cacheKey) as Promise<T> | undefined
    if (!request) {
      request = fetcher(new AbortController().signal).then((data) => {
        cache.set(cacheKey, data)
        return data
      })
      requests.set(cacheKey, request)
      void request.then(
        () => requests.delete(cacheKey),
        () => requests.delete(cacheKey),
      )
    }

    request
      .then((data) => {
        if (!cancelled) {
          setState({
            key: cacheKey,
            data,
            isLoading: false,
            isError: false,
            error: undefined,
          })
        }
      })
      .catch((err: Error) => {
        if (!cancelled && err.name !== "AbortError") {
          setState({
            key: cacheKey,
            data: undefined,
            isLoading: false,
            isError: true,
            error: err,
          })
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled])

  if (state.key === cacheKey) return state
  const cached = cache.get(cacheKey) as T | undefined
  return {
    data: cached,
    isLoading: enabled && cached === undefined,
    isError: false,
    error: undefined,
  }
}