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
    const growthRes = await db.query(`
      SELECT
        TO_CHAR(DATE(created_at), 'Mon DD') AS date,
        COUNT(*) AS count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    return NextResponse.json({
      success: true,
      data: { userGrowth: growthRes.rows },
    });
  } catch (err) {
    console.error("[STATS_GET]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}