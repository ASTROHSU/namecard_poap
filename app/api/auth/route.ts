import { NextResponse } from "next/server";
import { verifyPin, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (await verifyPin(pin)) {
    await setAuthCookie();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
}
