// src/lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const getToken = (): string | undefined =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1]

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

export const api = {
  get:    <T>(endpoint: string) =>
            request<T>(endpoint),

  post:   <T>(endpoint: string, body: unknown) =>
            request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  patch:  <T>(endpoint: string, body: unknown) =>
            request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
            request<T>(endpoint, { method: "DELETE" }),
}