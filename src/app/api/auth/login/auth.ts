// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import {
  findUserByEmail,
  comparePassword,
  issueTokens,
  auditLog,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") ?? req.ip;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const user = await findUserByEmail(email);

    if (!user) {
      await auditLog({
        action: "failed_login",
        ip: ip ?? undefined,
        userAgent,
        metadata: { reason: "user_not_found", email },
      });
      // Generic message to prevent user enumeration
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: "Your account has been deactivated. Contact support." },
        { status: 403 }
      );
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      await auditLog({
        userId: user.id,
        action: "failed_login",
        ip: ip ?? undefined,
        userAgent,
        metadata: { reason: "wrong_password" },
      });
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { accessToken } = await issueTokens(user, {
      ip: ip ?? undefined,
      userAgent,
    });

    await auditLog({
      userId: user.id,
      action: "login",
      ip: ip ?? undefined,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}