// src/lib/apiClient.ts
// Central HTTP client — attaches access token, sends refresh cookie,
// and transparently refreshes the token on 401.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

let accessToken: string | null = null;
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string | null) => void;
}> = [];

export function setAccessToken(token: string | null) {
  accessToken = token; // keep in-memory for the current session

  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

export function getAccessToken() {
  if (typeof window === "undefined") return;
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken || null;
}

// Drain the pending request queue after a token refresh
function drainQueue(newToken: string | null) {
  pendingQueue.forEach(({ resolve }) => resolve(newToken));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends the httpOnly refresh cookie
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  // If 401 and not the refresh endpoint itself, try to refresh
  if (res.status === 401 && !path.includes("/auth/refresh")) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      setAccessToken(newToken);
      drainQueue(newToken);
      isRefreshing = false;
    } else {
      // Queue this request until the current refresh finishes
      await new Promise<string | null>((resolve) =>
        pendingQueue.push({ resolve })
      );
    }

    // Retry the original request with the new token
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    res = await fetch(`${BASE}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });
  }

  return res;
}

// ─── Typed convenience wrappers ───────────────────────────────
export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: "DELETE" });
  return res.json();
}