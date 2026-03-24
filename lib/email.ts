import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface SendCardEmailParams {
  to: string;
  recipientName: string;
  poapClaimUrl: string | null;
  landingPageUrl: string;
}

export async function sendCardEmail({
  to,
  recipientName,
  poapClaimUrl,
  landingPageUrl,
}: SendCardEmailParams) {
  const poapSection = poapClaimUrl
    ? `
    <tr>
      <td style="padding: 16px 0 0;">
        <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
          另外，我也送你一份數位紀念徽章（POAP），<br>
          作為我們認識的紀念：
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 16px 0;">
        <a href="${poapClaimUrl}" style="display: inline-block; padding: 12px 28px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 500;">
          領取紀念徽章
        </a>
      </td>
    </tr>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td>
              <p style="margin: 0 0 8px; color: #374151; font-size: 15px; line-height: 1.6;">
                嗨 ${recipientName}，
              </p>
              <p style="margin: 0 0 8px; color: #374151; font-size: 15px; line-height: 1.6;">
                很高興認識你！
              </p>
              <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                這是我的數位名片，裡面有我的聯絡方式和更多資訊。<br>
                點擊下方按鈕就可以查看：
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 0;">
              <a href="${landingPageUrl}" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                查看名片
              </a>
            </td>
          </tr>
          ${poapSection}
          <tr>
            <td style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                明恩 Astro<br>
                區塊勢 Blocktrend 創辦人
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const result = await getResend().emails.send({
    from: "Astro Hsu <astro@blocktrend.today>",
    to: [to],
    subject: "很高興認識你！這是我的數位名片 — 許明恩 / 區塊勢",
    html,
  });

  return result;
}
