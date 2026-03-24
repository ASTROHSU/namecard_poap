import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface CardData {
  name_zh: string | null;
  name_en: string | null;
  company_zh: string | null;
  company_en: string | null;
  title_zh: string | null;
  title_en: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  website: string | null;
  social: {
    linkedin: string | null;
    twitter: string | null;
    line: string | null;
    wechat: string | null;
    other: string | null;
  };
  notes: string | null;
}

export async function scanCard(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg"
): Promise<CardData> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `你是一個名片辨識助手。請從這張名片圖片中擷取以下資訊，以 JSON 格式回傳。
如果某個欄位在名片上找不到，該欄位設為 null。
請盡可能精準辨識中英文混排內容。

回傳格式（僅回傳 JSON，不要任何其他文字）：
{
  "name_zh": "中文姓名",
  "name_en": "英文姓名",
  "company_zh": "中文公司名稱",
  "company_en": "英文公司名稱",
  "title_zh": "中文職稱",
  "title_en": "英文職稱",
  "email": "Email 地址",
  "phone": "電話號碼（含國碼）",
  "mobile": "手機號碼",
  "address": "地址",
  "website": "網站",
  "social": {
    "linkedin": "LinkedIn URL 或帳號",
    "twitter": "Twitter/X 帳號",
    "line": "LINE ID",
    "wechat": "微信號",
    "other": "其他社群帳號"
  },
  "notes": "名片上其他值得記錄的資訊"
}`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from Claude response");
  }

  return JSON.parse(jsonMatch[0]) as CardData;
}
