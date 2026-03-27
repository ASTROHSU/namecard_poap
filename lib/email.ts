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
  const poapLine = poapClaimUrl
    ? `<p style="margin:0; font-size:14px; color:#7a7268; line-height:1.7; text-align:center;">我也把這張名片做成了<a href="${poapClaimUrl}" style="color:#6b5b3e; text-decoration:underline;">鏈上紀念徽章</a>，<br>領取後會永久保存在區塊鏈上。</p>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f5f0e8; font-family:Georgia, 'Noto Serif TC', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8; padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- 頭像 + 名字 -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://i.urusai.cc/RW2O0.jpg" alt="許明恩" width="80" height="80" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid #fffdf9; display:block; margin:0 auto;">
              <p style="margin:14px 0 2px; font-size:22px; font-weight:bold; color:#1a1714; letter-spacing:3px;">許明恩</p>
              <p style="margin:0; font-size:14px; color:#7a7268; letter-spacing:0.5px;">區塊勢創辦人</p>
            </td>
          </tr>

          <!-- 主要內容卡片 -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffdf9; border-radius:14px; overflow:hidden; box-shadow:0 2px 12px rgba(26,23,20,0.06);">

                <!-- 區塊一：問候 + 名片 + 鏈上紀念徽章 -->
                <tr>
                  <td style="padding:28px 28px 0;">
                    <p style="margin:0 0 6px; font-size:16px; color:#1a1714; line-height:1.8;">嗨 ${recipientName}，</p>
                    <p style="margin:0; font-size:16px; color:#4a443c; line-height:1.8;">很高興認識你！這是我的數位名片，裡面有我的聯絡方式，歡迎隨時聯繫。</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:22px 28px 0;">
                    <a href="${landingPageUrl}" style="display:inline-block; padding:12px 32px; background-color:#6b5b3e; color:#ffffff; text-decoration:none; border-radius:8px; font-size:15px; font-weight:600; letter-spacing:0.5px;">查看我的名片</a>
                  </td>
                </tr>
                ${poapClaimUrl ? `<tr><td style="padding:16px 28px 24px;">${poapLine}</td></tr>` : '<tr><td style="padding:0 0 24px;"></td></tr>'}

                <!-- 分隔線 -->
                <tr><td style="padding:0 28px;"><div style="border-top:1px solid #ede6da;"></div></td></tr>

                <!-- 區塊二：交換名片專屬禮物 -->
                <tr>
                  <td style="padding:22px 28px 0;">
                    <p style="margin:0 0 8px; font-size:13px; font-weight:bold; color:#7a7268; letter-spacing:2px;">🎁 交換名片專屬</p>
                    <p style="margin:0; font-size:15px; color:#4a443c; line-height:1.8;">送你一個月的「區塊勢」免費訂閱。區塊勢是臺灣最多人訂閱的區塊鏈電子報，每週分析 Web3 產業的最新趨勢，希望你也會喜歡。</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:18px 28px 24px;">
                    <a href="https://www.blocktrend.today/be61386f" style="display:inline-block; padding:11px 28px; background-color:#1a1714; color:#ffffff; text-decoration:none; border-radius:8px; font-size:14px; font-weight:600;">免費試閱一個月</a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- 簽名 -->
          <tr>
            <td align="center" style="padding:24px 0 0;">
              <p style="margin:0; font-size:14px; color:#b8b0a4; line-height:1.6;">明恩<br>區塊勢創辦人</p>
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
