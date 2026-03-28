import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();

    // Add clicked_at column if not exists
    await sql`
      ALTER TABLE poap_codes
      ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ
    `;

    return NextResponse.json({ success: true, message: "Migration completed" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", details: String(error) },
      { status: 500 }
    );
  }
}
