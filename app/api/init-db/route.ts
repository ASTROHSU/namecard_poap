import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST() {
    try {
          const sql = getDb();

          await sql`
            CREATE TABLE IF NOT EXISTS contacts (
                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      name_zh TEXT,
                      name_en TEXT,
                      company_zh TEXT,
                      company_en TEXT,
                      title_zh TEXT,
                      title_en TEXT,
                      email TEXT,
                      phone TEXT,
                      mobile TEXT,
                      address TEXT,
                      website TEXT,
                      social JSONB DEFAULT '{}',
                      notes TEXT,
                      card_image_url TEXT,
                      poap_code TEXT,
                      email_sent BOOLEAN DEFAULT FALSE,
                      created_at TIMESTAMPTZ DEFAULT NOW(),
                      updated_at TIMESTAMPTZ DEFAULT NOW()
                    )
          `;

          await sql`
            CREATE TABLE IF NOT EXISTS poap_codes (
                      id SERIAL PRIMARY KEY,
                      code TEXT UNIQUE NOT NULL,
                      event_name TEXT,
                      assigned_to UUID REFERENCES contacts(id),
                      assigned_at TIMESTAMPTZ,
                      created_at TIMESTAMPTZ DEFAULT NOW()
                    )
          `;

          await sql`CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)`;
          await sql`CREATE INDEX IF NOT EXISTS idx_poap_codes_unassigned ON poap_codes(assigned_to) WHERE assigned_to IS NULL`;

          return NextResponse.json({ success: true, message: "Database tables created successfully" });
        } catch (error) {
          console.error("DB init error:", error);
          return NextResponse.json({ error: "Failed to initialize database", details: String(error) }, { status: 500 });
        }
  }
