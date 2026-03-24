import { NextResponse } from "next/server";

export async function GET() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:許明恩 Astro Hsu
ORG:區塊勢 Blocktrend
TITLE:Founder
EMAIL:astro@blocktrend.today
URL:https://blocktrend.substack.com
X-SOCIALPROFILE;type=twitter:https://x.com/aspect_astro
NOTE:區塊勢創辦人，台灣最大繁體中文 Web3 訂閱媒體
END:VCARD`;

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Astro_Hsu_Blocktrend.vcf"',
    },
  });
}
