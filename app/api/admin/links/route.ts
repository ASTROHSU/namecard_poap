import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT pc.*, c.name_zh, c.name_en, c.email AS contact_email
      FROM poap_codes pc
      LEFT JOIN contacts c ON pc.assigned_to = c.id
      ORDER BY pc.id DESC
      LIMIT 200
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin links list error:", error);
    return NextResponse.json(
      { error: "Failed to load POAP codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { codes, eventName } = await request.json();

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json({ error: "No codes provided" }, { status: 400 });
    }

    const sql = getDb();

    // Extract code from URL if full URL is provided, filter out empty strings and duplicates
    const uniqueCodes = [...new Set(
      codes
        .map((c: string) => {
          const trimmed = c.trim();
          // Support full URLs like https://poap.xyz/mint/abc123
          const match = trimmed.match(/poap\.xyz\/mint\/([a-zA-Z0-9]+)/);
          return match ? match[1] : trimmed;
        })
        .filter(Boolean)
    )];

    let inserted = 0;
    for (const code of uniqueCodes) {
      try {
        await sql`
          INSERT INTO poap_codes (code, event_name)
          VALUES (${code}, ${eventName || null})
          ON CONFLICT (code) DO NOTHING
        `;
        inserted++;
      } catch {
        // Skip duplicates
      }
    }

    return NextResponse.json({ inserted, total: uniqueCodes.length });
  } catch (error) {
    console.error("Admin links POST error:", error);
    return NextResponse.json(
      { error: "Failed to add POAP codes" },
      { status: 500 }
    );
  }
}
