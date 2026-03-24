import { NextResponse } from "next/server";
import { scanCard } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const { image, mediaType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const cardData = await scanCard(image, mediaType || "image/jpeg");
    return NextResponse.json(cardData);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Failed to scan card" },
      { status: 500 }
    );
  }
}
