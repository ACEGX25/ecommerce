import { db } from "../../config/db";
import { hashPassword, comparePassword } from "./password";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  refreshExpiresAt,
  verifyRefreshToken,
} from "./jwt";
import { User, UserRole } from "../types/auth.types";
import { Request, Response } from "express";

const REFRESH_COOKIE = "dingly_refresh";
const IS_PROD = process.env.NODE_ENV === "production";

interface UserWithHash extends User {
  password_hash: string;
}

// ─── User queries ─────────────────────────────────────────────
export async function findUserByEmail(email: string): Promise<UserWithHash | null> {
  const res = await db.query(
    `SELECT id, name, email, role, password_hash, is_active,
            email_verified, avatar_url, created_at, updated_at
     FROM users WHERE email = $1`,
    [email.toLowerCase().trim()]
  );
  return (res.rows[0] as unknown as UserWithHash) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const res = await db.query(
    `SELECT id, name, email, role, is_active, avatar_url, created_at, updated_at
     FROM users WHERE id = $1 AND is_active = TRUE`,
    [id]
  );
  return (res.rows[0] as unknown as User) ?? null;
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<User> {
  const passwordHash = await hashPassword(params.password);
  const res = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, is_active, avatar_url, created_at, updated_at`,
    [
      params.name.trim(),
      params.email.toLowerCase().trim(),
      passwordHash,
      params.role ?? "user",
    ]
  );
  return res.rows[0] as unknown as User;
}

// ─── Token management ─────────────────────────────────────────
export async function issueTokens(
  user: Pick<User, "id" | "email" | "role">,
  meta: { ip?: string; userAgent?: string },
  res: Response
): Promise<string> {
  const payload = { userId: user.id, email: user.email, role: user.role };

  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenHash    = hashToken(refreshToken);
  const expiresAt    = refreshExpiresAt();

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [user.id, tokenHash, expiresAt, meta.ip ?? null, meta.userAgent ?? null]
  );

  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return accessToken;
}

export async function revokeToken(rawToken: string): Promise<void> {
  const tokenHash = hashToken(rawToken);
  await db.query(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`,
    [tokenHash]
  );
}

export async function rotateRefreshToken(
  rawToken: string,
  meta: { ip?: string; userAgent?: string },
  res: Response
): Promise<string | null> {
  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const result = await db.query(
    `SELECT id, revoked, expires_at FROM refresh_tokens
     WHERE token_hash = $1 AND user_id = $2`,
    [tokenHash, payload.userId]
  );

  const stored = result.rows[0] as unknown as {
    revoked: boolean;
    expires_at: string;
  } | undefined;

  if (!stored || stored.revoked || new Date(stored.expires_at) < new Date()) {
    return null;
  }

  await revokeToken(rawToken);

  const user = await findUserById(payload.userId);
  if (!user) return null;

  return issueTokens(user, meta, res);
}

export function clearRefreshCookie(res: Response): void {
  res.cookie(REFRESH_COOKIE, "", { maxAge: 0, path: "/" });
}

// ─── Audit logging ────────────────────────────────────────────
export async function auditLog(params: {
  userId?: string;
  action: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await db
    .query(
      `INSERT INTO auth_audit_logs (user_id, action, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.userId ?? null,
        params.action,
        params.ip ?? null,
        params.userAgent ?? null,
        params.metadata ? JSON.stringify(params.metadata) : null,
      ]
    )
    .catch(console.error);
}

export function getRequestMeta(req: Request) {
  return {
    ip: (req.headers["x-forwarded-for"] as string) ?? req.ip,
    userAgent: req.headers["user-agent"],
  };
}

export { comparePassword };