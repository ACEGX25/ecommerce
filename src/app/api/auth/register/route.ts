// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import {
  hashPassword,
  createUser,
  findUserByEmail,
  issueTokens,
  auditLog,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

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

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ name, email, passwordHash });

    const ip = req.headers.get("x-forwarded-for") ?? req.ip;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const { accessToken } = await issueTokens(user, {
      ip: ip ?? undefined,
      userAgent,
    });

    await auditLog({ userId: user.id, action: "register", ip: ip ?? undefined, userAgent });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}