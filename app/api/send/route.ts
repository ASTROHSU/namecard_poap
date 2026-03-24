import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getDb } from "@/lib/db";
import { assignPoapCode, getPoapClaimUrl } from "@/lib/poap";
import { sendCardEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name_zh, name_en, company_zh, company_en,
      title_zh, title_en, email, phone, mobile,
      address, website, social, notes,
      image, mediaType, saveOnly,
    } = body;

    const sql = getDb();

    // Upload card image to Vercel Blob
    let cardImageUrl: string | null = null;
    if (image) {
      const buffer = Buffer.from(image, "base64");
      const ext = mediaType === "image/png" ? "png" : "jpg";
      const filename = `cards/${Date.now()}.${ext}`;
      const blob = await put(filename, buffer, {
        access: "public",
        contentType: mediaType || "image/jpeg",
      });
      cardImageUrl = blob.url;
    }

    // Save contact to database
    const rows = await sql`
      INSERT INTO contacts (
        name_zh, name_en, company_zh, company_en,
        title_zh, title_en, email, phone, mobile,
        address, website, social, notes,
        card_image_url, email_sent
      ) VALUES (
        ${name_zh}, ${name_en}, ${company_zh}, ${company_en},
        ${title_zh}, ${title_en}, ${email}, ${phone}, ${mobile},
        ${address}, ${website}, ${JSON.stringify(social || {})}, ${notes},
        ${cardImageUrl}, ${false}
      )
      RETURNING id
    `;
    const contactId = rows[0].id as string;

    if (!saveOnly && email) {
      // Assign POAP code
      const poapCode = await assignPoapCode(contactId);
      const poapClaimUrl = poapCode ? getPoapClaimUrl(poapCode) : null;

      // Update contact with POAP code
      if (poapCode) {
        await sql`
          UPDATE contacts SET poap_code = ${poapCode} WHERE id = ${contactId}::uuid
        `;
      }

      // Send email
      const recipientName = name_zh || name_en || "你好";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://card.blocktrend.today";

      await sendCardEmail({
        to: email,
        recipientName,
        poapClaimUrl,
        landingPageUrl: `${appUrl}/card`,
      });

      // Mark email as sent
      await sql`
        UPDATE contacts SET email_sent = ${true} WHERE id = ${contactId}::uuid
      `;
    }

    return NextResponse.json({ id: contactId, success: true });
  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
