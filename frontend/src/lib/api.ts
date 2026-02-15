const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api'

type TokenPair = {
  access: string
  refresh: string
}

type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const ACCESS_TOKEN_KEY = 'slos.access'
const REFRESH_TOKEN_KEY = 'slos.refresh'

const storageAvailable = () => typeof window !== 'undefined'

export const getAccessToken = () =>
  storageAvailable() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null

export const getRefreshToken = () =>
  storageAvailable() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null

export const setTokens = ({ access, refresh }: TokenPair) => {
  if (!storageAvailable()) return
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export const clearTokens = () => {
  if (!storageAvailable()) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const buildHeaders = (hasBody: boolean) => {
  const headers: Record<string, string> = {}
  if (hasBody) headers['Content-Type'] = 'application/json'
  const access = getAccessToken()
  if (access) headers.Authorization = `Bearer ${access}`
  return headers
}

const rawFetch = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }
  if (response.status === 204) return null
  return response.json()
}

const refreshAccessToken = async () => {
  const refresh = getRefreshToken()
  if (!refresh) return null
  try {
    const data = await rawFetch('/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (data?.access) {
      setTokens({ access: data.access, refresh })
      return data.access as string
    }
    return null
  } catch {
    return null
  }
}

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const hasBody = Boolean(options.body)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(hasBody),
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const retry = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          ...buildHeaders(hasBody),
          ...(options.headers ?? {}),
        },
      })
      if (!retry.ok) {
        const message = await retry.text()
        throw new Error(message || 'Request failed')
      }
      if (retry.status === 204) return null
      return retry.json()
    }
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204) return null
  return response.json()
}

export const apiList = async <T,>(path: string): Promise<T[]> => {
  const data = await apiFetch(path)
  if (!data) return []
  if ('results' in data) {
    return (data as PaginatedResponse<T>).results
  }
  return data as T[]
}

export const apiPost = async <T,>(path: string, body: unknown): Promise<T> =>
  apiFetch(path, { method: 'POST', body: JSON.stringify(body) })

export const apiPatch = async <T,>(path: string, body: unknown): Promise<T> =>
  apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) })

export const apiDelete = async (path: string) =>
  apiFetch(path, { method: 'DELETE' })
