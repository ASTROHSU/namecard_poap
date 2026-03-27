import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const sql = getDb();

    // Record the click timestamp
    await sql`
      UPDATE poap_codes
      SET clicked_at = NOW()
      WHERE code = ${code} AND clicked_at IS NULL
    `;
  } catch (error) {
    // Don't block redirect if DB update fails
    console.error("POAP click tracking error:", error);
  }

  // Always redirect to the actual POAP mint page
  return NextResponse.redirect(`https://poap.xyz/mint/${code}`, 302);
}
