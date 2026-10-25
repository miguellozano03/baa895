import { useEffect, useState } from "react"

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
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    isLoading: enabled,
    isError: false,
    error: undefined,
  })

  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()
    setState((s) => ({ ...s, isLoading: true, isError: false, error: undefined }))

    fetcher(controller.signal)
      .then((data) =>
        setState({ data, isLoading: false, isError: false, error: undefined }),
      )
      .catch((err: Error) => {
        if (err.name === "AbortError") return // petición cancelada: se ignora
        setState({ data: undefined, isLoading: false, isError: true, error: err })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])

  return state
}