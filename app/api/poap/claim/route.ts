import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET: Atomically pick a random unclaimed code, mark it as clicked, return the mint URL
export async function GET() {
  try {
    const sql = getDb();

    // Atomically claim a random available code
    const rows = await sql`
      UPDATE poap_codes
      SET clicked_at = NOW()
      WHERE id = (
        SELECT id FROM poap_codes
        WHERE assigned_to IS NULL AND clicked_at IS NULL
        ORDER BY RANDOM()
        LIMIT 1
      )
      RETURNING code
    `;

    if (rows.length === 0) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    const code = rows[0].code as string;
    return NextResponse.json({
      available: true,
      code,
      mintUrl: `https://poap.xyz/mint/${code}`,
    });
  } catch (error) {
    console.error("POAP claim error:", error);
    return NextResponse.json(
      { error: "Failed to claim POAP" },
      { status: 500 }
    );
  }
}
