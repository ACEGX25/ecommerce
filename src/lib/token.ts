// src/lib/tokenStorage.ts
// Thin wrapper around localStorage for the access token
// This runs ONLY in the browser (never on the server)

const KEY = "accessToken";

export const TokenStorage = {
  // Called after login / register — saves the JWT to localStorage
  set: (token: string): void => {
    localStorage.setItem(KEY, token);
  },

  // Called before every API request — reads token to put in Authorization header
  get: (): string | null => {
    return localStorage.getItem(KEY);
  },

  // Called on logout — removes token from localStorage
  remove: (): void => {
    localStorage.removeItem(KEY);
  },
};