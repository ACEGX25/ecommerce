
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthTokenPayload, UserRole } from "@/types/auth";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not configured in environment variables.");
}

// ─── Access Token ─────────────────────────────────────────────
export function signAccessToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
    issuer: "dingly",
    audience: "dingly-client",
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, ACCESS_SECRET, {
    issuer: "dingly",
    audience: "dingly-client",
  }) as AuthTokenPayload;
}

// ─── Refresh Token ────────────────────────────────────────────
export function signRefreshToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
    issuer: "dingly",
    audience: "dingly-refresh",
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  return jwt.verify(token, REFRESH_SECRET, {
    issuer: "dingly",
    audience: "dingly-refresh",
  }) as AuthTokenPayload;
}

// ─── Helpers ──────────────────────────────────────────────────
/** SHA-256 hash of the raw token — stored in DB instead of plain token */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Expiry date for the refresh token (7 days from now) */
export function refreshTokenExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}