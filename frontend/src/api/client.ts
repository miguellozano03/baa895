const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type Params = Record<string, string | number | undefined>

export async function api<T>(
  path: string,
  params: Params = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(path, BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value))
  })

  const res = await fetch(url, { signal })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const detail = typeof body?.detail === "string" ? body.detail : res.statusText
    throw new ApiError(res.status, detail)
  }

  return res.json() as Promise<T>
}