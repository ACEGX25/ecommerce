// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import {
  findUserByEmail,
  createUser,
  issueTokens,
  revokeToken,
  rotateRefreshToken,
  clearRefreshCookie,
  auditLog,
  getRequestMeta,
  comparePassword,
} from "./auth.service";
import { sendSuccess, sendError } from "../../utils/response";

const REFRESH_COOKIE = "dingly_refresh";

// ─── POST /api/auth/register ──────────────────────────────────
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const meta = getRequestMeta(req);

    const existing = await findUserByEmail(email);
    if (existing) {
      return sendError(res, "An account with this email already exists", 409);
    }

    const user = await createUser({ name, email, password });
    const accessToken = await issueTokens(user, meta, res);

    await auditLog({ userId: user.id, action: "register", ...meta });

    return sendSuccess(
      res,
      {
        message: "Account created successfully",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
      },
      201
    );
  } catch (err) {
    console.error("[register]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const meta = getRequestMeta(req);

    const user = await findUserByEmail(email);

    if (!user) {
      await auditLog({ action: "failed_login", ...meta, metadata: { reason: "user_not_found", email } });
      // Generic message prevents user enumeration
      return sendError(res, "Invalid email or password", 401);
    }

    if (!user.is_active) {
      return sendError(res, "Your account has been deactivated. Contact support.", 403);
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      await auditLog({ userId: user.id, action: "failed_login", ...meta, metadata: { reason: "wrong_password" } });
      return sendError(res, "Invalid email or password", 401);
    }

    const accessToken = await issueTokens(user, meta, res);
    await auditLog({ userId: user.id, action: "login", ...meta });

    return sendSuccess(res, {
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    console.error("[login]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── POST /api/auth/refresh ───────────────────────────────────
export async function refresh(req: Request, res: Response) {
  try {
    const rawToken = req.cookies?.[REFRESH_COOKIE];

    if (!rawToken) {
      return sendError(res, "No refresh token", 401);
    }

    const meta = getRequestMeta(req);
    const accessToken = await rotateRefreshToken(rawToken, meta, res);

    if (!accessToken) {
      clearRefreshCookie(res);
      return sendError(res, "Refresh token is invalid or expired", 401);
    }

    await auditLog({ action: "token_refresh", ...meta });

    return sendSuccess(res, { accessToken });
  } catch (err) {
    console.error("[refresh]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── POST /api/auth/logout ────────────────────────────────────
export async function logout(req: Request, res: Response) {
  try {
    const rawToken = req.cookies?.[REFRESH_COOKIE];
    const meta = getRequestMeta(req);

    if (rawToken) {
      try {
        await revokeToken(rawToken);
      } catch {
        // Token invalid — still clear the cookie
      }
    }

    clearRefreshCookie(res);
    await auditLog({ action: "logout", ...meta });

    return sendSuccess(res, { message: "Logged out successfully" });
  } catch (err) {
    console.error("[logout]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────
export async function me(req: Request, res: Response) {
  // req.user is set by requireAuth middleware
  const user = (req as any).user;
  return sendSuccess(res, { user });
}