import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../../config/env";
import { TokenPayload, UserRole } from "../types/auth.types";

export function signAccessToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES,
    issuer: "dingly",
    audience: "dingly-client",
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES,
    issuer: "dingly",
    audience: "dingly-refresh",
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ENV.JWT_SECRET, {
    issuer: "dingly",
    audience: "dingly-client",
  }) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET, {
    issuer: "dingly",
    audience: "dingly-refresh",
  }) as TokenPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}