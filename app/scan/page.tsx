"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CameraCapture from "@/components/CameraCapture";
import ContactForm from "@/components/ContactForm";
import type { CardData } from "@/lib/claude";

type Step = "capture" | "scanning" | "review" | "sending" | "done" | "error";

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("capture");
  const [imageData, setImageData] = useState<{ base64: string; mediaType: string } | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [error, setError] = useState("");

  async function handleCapture(base64: string, mediaType: string) {
    setImageData({ base64, mediaType });
    setStep("scanning");
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      });

      if (!res.ok) throw new Error("Scan failed");

      const data = await res.json();
      setCardData(data);
      setStep("review");
    } catch {
      setError("辨識失敗，請重試");
      setStep("error");
    }
  }

  async function handleSend(saveOnly: boolean = false) {
    if (!cardData || !imageData) return;
    setStep("sending");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cardData,
          image: imageData.base64,
          mediaType: imageData.mediaType,
          saveOnly,
        }),
      });

      if (!res.ok) throw new Error("Send failed");
      setStep("done");
    } catch {
      setError("送出失敗，請重試");
      setStep("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 mr-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">掃描名片</h1>
      </header>

      <main className="p-4 pb-32 max-w-lg mx-auto">
        {/* Capture / Preview */}
        <CameraCapture
          onCapture={handleCapture}
          disabled={step === "scanning" || step === "sending"}
        />

        {/* Scanning indicator */}
        {step === "scanning" && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200">
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700">AI 辨識中...</span>
            </div>
          </div>
        )}

        {/* Review form */}
        {step === "review" && cardData && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800">
              辨識完成，請確認資料
            </div>
            <ContactForm data={cardData} onChange={setCardData} />
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="mt-6 text-center space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-800">
              {error}
            </div>
            <button
              onClick={() => setStep("capture")}
              className="text-sm text-gray-600 underline"
            >
              重新開始
            </button>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="mt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">送出成功！</p>
            <p className="text-sm text-gray-500">名片已存檔，Email 已發送</p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setStep("capture");
                  setCardData(null);
                  setImageData(null);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium active:scale-95 transition-transform"
              >
                繼續掃描
              </button>
              <button
                onClick={() => router.push("/contacts")}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium active:scale-95 transition-transform"
              >
                查看聯絡人
              </button>
            </div>
          </div>
        )}

        {/* Sending indicator */}
        {step === "sending" && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200">
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700">處理中...</span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom actions */}
      {step === "review" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => handleSend(false)}
            disabled={!cardData?.email}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-40 active:scale-[0.98] transition-transform"
          >
            {cardData?.email ? "確認並送出" : "缺少 Email，無法送出"}
          </button>
          <button
            onClick={() => handleSend(true)}
            className="w-full py-2.5 text-gray-600 text-sm font-medium active:scale-[0.98] transition-transform"
          >
            僅存檔（不送 Email / POAP）
          </button>
        </div>
      )}
    </div>
  );
}
