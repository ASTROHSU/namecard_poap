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
      try {
        const buffer = Buffer.from(image, "base64");
        const ext = mediaType === "image/png" ? "png" : "jpg";
        const filename = `cards/${Date.now()}.${ext}`;
        const blob = await put(filename, buffer, {
          access: "public",
          contentType: mediaType || "image/jpeg",
        });
        cardImageUrl = blob.url;
      } catch (blobError) {
        console.error("Blob upload error (continuing without image):", blobError);
      }
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

    const result: {
      id: string;
      success: true;
      emailSent?: boolean;
      poapAssigned?: boolean;
      warnings?: string[];
    } = { id: contactId, success: true };
    const warnings: string[] = [];

    if (!saveOnly && email) {
      // Assign POAP code
      const poapCode = await assignPoapCode(contactId);
      const poapClaimUrl = poapCode ? getPoapClaimUrl(poapCode) : null;
      result.poapAssigned = !!poapCode;

      if (!poapCode) {
        warnings.push("POAP codes 已用完，Email 將不含 POAP 連結");
      }

      // Update contact with POAP code
      if (poapCode) {
        await sql`
          UPDATE contacts SET poap_code = ${poapCode} WHERE id = ${contactId}::uuid
        `;
      }

      // Send email
      try {
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
        result.emailSent = true;
      } catch (emailError) {
        console.error("Email send error:", emailError);
        warnings.push("Email 發送失敗，聯絡人已存檔但信件未寄出");
        result.emailSent = false;
      }
    }

    if (warnings.length > 0) {
      result.warnings = warnings;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
