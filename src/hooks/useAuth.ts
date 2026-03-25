// src/hooks/useAuth.ts
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User } from "@/types/auth";
import {
  apiFetch,
  setAccessToken,
  getAccessToken,
} from "@/lib/apiClient";

// ─── Context shape ────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  accessToken: string | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ─── State initialiser (used inside AuthProvider) ─────────────
export function useAuthState(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: silently try to get a fresh access token from the
  // httpOnly refresh cookie the backend set at login time.
  const restoreSession = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        // Fetch user profile with the new access token
        const meRes = await apiFetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user ?? null);
        }
      }
    } catch {
      // No session — that's fine
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Proactive silent refresh every 12 minutes (access token lives 15 min)
  useEffect(() => {
    if (!getAccessToken()) return;
    const id = setInterval(async () => {
      const res = await apiFetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken ?? null);
      }
    }, 12 * 60 * 1000);
    return () => clearInterval(id);
  }, [user]); // re-register when user changes

  // ─── Actions ──────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setAccessToken(data.accessToken);
      setUser(data.user);
    }
    return { success: !!data.success, message: data.message };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setAccessToken(data.accessToken);
      setUser(data.user);
    }
    return { success: !!data.success, message: data.message };
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setAccessToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return {
    user,
    accessToken: getAccessToken(),
    isLoading,
    isAuthenticated: !!getAccessToken(),
    login,
    register,
    logout,
  };
}