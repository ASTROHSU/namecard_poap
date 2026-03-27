import { getDb } from "./db";

export async function assignPoapCode(
  contactId: string
): Promise<string | null> {
  const sql = getDb();

  // Pick an unassigned code and assign it atomically
  const rows = await sql`
    UPDATE poap_codes
    SET assigned_to = ${contactId}::uuid, assigned_at = NOW()
    WHERE id = (
      SELECT id FROM poap_codes
      WHERE assigned_to IS NULL
      ORDER BY id ASC
      LIMIT 1
    )
    RETURNING code
  `;

  if (rows.length === 0) return null;
  return rows[0].code as string;
}

export function getPoapClaimUrl(code: string): string {
  return `https://poap.xyz/mint/${code}`;
}
