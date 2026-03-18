import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    
    return NextResponse.json({
      success: true,
      message: "DB connected ",
      time: result.rows[0],
    });
    
  } catch (error) {
    console.error("DB Error:", error);

    return NextResponse.json({
      success: false,
      message: "DB connection failed ",
    });
  }
}