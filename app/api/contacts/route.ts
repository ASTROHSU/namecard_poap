import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") || "";

  const sql = getDb();

  let rows;
  if (search) {
    const pattern = `%${search}%`;
    rows = await sql`
      SELECT id, name_zh, name_en, company_zh, company_en,
             title_zh, title_en, email, poap_code, email_sent, created_at
      FROM contacts
      WHERE name_zh ILIKE ${pattern}
        OR name_en ILIKE ${pattern}
        OR company_zh ILIKE ${pattern}
        OR company_en ILIKE ${pattern}
        OR email ILIKE ${pattern}
      ORDER BY created_at DESC
      LIMIT 100
    `;
  } else {
    rows = await sql`
      SELECT id, name_zh, name_en, company_zh, company_en,
             title_zh, title_en, email, poap_code, email_sent, created_at
      FROM contacts
      ORDER BY created_at DESC
      LIMIT 100
    `;
  }

  return NextResponse.json(rows);
}
