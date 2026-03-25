import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    const res = await db.query(`
      SELECT
        COUNT(*)                                                          AS total,
        COUNT(*) FILTER (WHERE is_active = TRUE)                         AS active,
        COUNT(*) FILTER (WHERE role = 'admin')                           AS admins,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())) AS new_this_month
      FROM users
    `);

    const row = res.rows[0] as Record<string, string>;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers:   parseInt(row.total),
        activeUsers:  parseInt(row.active),
        adminCount:   parseInt(row.admins),
        newThisMonth: parseInt(row.new_this_month),
      },
    });
  } catch (err) {
    console.error("[DASHBOARD_GET]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}