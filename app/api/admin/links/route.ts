import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const rows = await sql`
    SELECT pc.*, c.name_zh, c.name_en, c.email AS contact_email
    FROM poap_codes pc
    LEFT JOIN contacts c ON pc.assigned_to = c.id
    ORDER BY pc.id DESC
    LIMIT 200
  `;
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { codes, eventName } = await request.json();

  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    return NextResponse.json({ error: "No codes provided" }, { status: 400 });
  }

  const sql = getDb();

  // Filter out empty strings and duplicates
  const uniqueCodes = [...new Set(codes.map((c: string) => c.trim()).filter(Boolean))];

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
}
