// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, hashToken, signAccessToken } from "@/lib/jwt";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("dingly_refresh")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token" },
        { status: 401 }
      );
    }

    // Verify signature
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Check DB: token must exist, not revoked, not expired
    const tokenHash = hashToken(refreshToken);
    const result = await db.query(
      `SELECT id, revoked, expires_at FROM refresh_tokens
       WHERE token_hash = $1 AND user_id = $2`,
      [tokenHash, payload.userId]
    );

    const stored = result.rows[0];
    if (!stored || stored.revoked || new Date(stored.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Refresh token is invalid or expired" },
        { status: 401 }
      );
    }

    // Issue new access token
    const accessToken = signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    await auditLog({
      userId: payload.userId,
      action: "token_refresh",
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ success: true, accessToken });
  } catch (err) {
    console.error("[refresh]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}