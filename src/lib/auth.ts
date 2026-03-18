import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  refreshTokenExpiresAt,
  verifyAccessToken,
} from "./jwt";
import { User, UserRole } from "@/types/auth";

const SALT_ROUNDS = 12;
const REFRESH_COOKIE = "dingly_refresh";

// ─── Password ────────────────────────────────────────────────
export const hashPassword = (plain: string) =>
  bcrypt.hash(plain, SALT_ROUNDS);

export const comparePassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

// ─── Issue tokens + set cookie ───────────────────────────────
export async function issueTokens(
  user: Pick<User, "id" | "email" | "role">,
  request: { ip?: string; userAgent?: string }
) {
  const payload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = refreshTokenExpiresAt();

  // Persist hashed refresh token
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [user.id, tokenHash, expiresAt, request.ip ?? null, request.userAgent ?? null]
  );

  // Set refresh token in HTTP-only cookie
  cookies().set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return { accessToken };
}

// ─── Revoke refresh token ────────────────────────────────────
export async function revokeRefreshToken(token: string) {
  const tokenHash = hashToken(token);
  await db.query(
    UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1,
    [tokenHash]
  );
}

// ─── Clear cookie ────────────────────────────────────────────
export function clearAuthCookie() {
  cookies().set(REFRESH_COOKIE, "", { maxAge: 0, path: "/" });
}

// ─── Get current user from access token (server-side) ────────
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    // Access token passed in Authorization header is handled at edge;
    // here we also support reading from a server-side cookie for SSR pages.
    const accessToken = cookieStore.get("dingly_access")?.value;
    if (!accessToken) return null;

    const payload = verifyAccessToken(accessToken);
    const result = await db.query<User>(
      `SELECT id, email, name, role, avatar_url, is_active, created_at, updated_at
       FROM users WHERE id = $1 AND is_active = TRUE`,
      [payload.userId]
    );
    return result.rows[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Audit logger ────────────────────────────────────────────
export async function auditLog(params: {
  userId?: string;
  action: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  await db.query(
    `INSERT INTO auth_audit_logs (user_id, action, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      params.userId ?? null,
      params.action,
      params.ip ?? null,
      params.userAgent ?? null,
      params.metadata ? JSON.stringify(params.metadata) : null,
    ]
  ).catch(console.error); // Non-blocking
}

// ─── User queries ────────────────────────────────────────────
export async function findUserByEmail(email: string) {
  const res = await db.query(
    `SELECT id, email, name, role, password_hash, is_active, created_at
     FROM users WHERE email = $1`,
    [email.toLowerCase().trim()]
  );
  return res.rows[0] ?? null;
}

export async function createUser(params: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}) {
  const res = await db.query<User>(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, is_active, created_at, updated_at`,
    [
      params.name.trim(),
      params.email.toLowerCase().trim(),
      params.passwordHash,
      params.role ?? "user",
    ]
  );
  return res.rows[0];
}