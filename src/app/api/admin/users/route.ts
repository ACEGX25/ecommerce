import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Guard: only admin role (set by middleware via headers)
function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const offset = (page - 1) * limit;
  const search = searchParams.get("search") ?? "";
  const role = searchParams.get("role") ?? "";

  let whereClause = "WHERE 1=1";
  const params: unknown[] = [];

  if (search) {
    params.push(`%${search}%`);
    whereClause += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
  }

  if (role === "user" || role === "admin") {
    params.push(role);
    whereClause += ` AND role = $${params.length}`;
  }

  const countRes = await db.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params
  );
  const total = parseInt(countRes.rows[0].count);

  params.push(limit, offset);
  const usersRes = await db.query(
    `SELECT id, name, email, role, is_active, avatar_url, created_at, updated_at
     FROM users ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return NextResponse.json({
    success: true,
    users: usersRes.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function PATCH(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const body = await req.json();
  const { userId, is_active, role } = body;

  if (!userId) {
    return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });
  }

  const updates: string[] = [];
  const params: unknown[] = [];

  if (typeof is_active === "boolean") {
    params.push(is_active);
    updates.push(`is_active = $${params.length}`);
  }

  if (role === "user" || role === "admin") {
    params.push(role);
    updates.push(`role = $${params.length}`);
  }

  if (updates.length === 0) {
    return NextResponse.json({ success: false, message: "Nothing to update" }, { status: 400 });
  }

  params.push(userId);
  const res = await db.query(
    `UPDATE users SET ${updates.join(", ")} WHERE id = $${params.length}
     RETURNING id, name, email, role, is_active`,
    params
  );

  return NextResponse.json({ success: true, user: res.rows[0] });
}