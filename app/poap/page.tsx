"use client";

import { useState } from "react";

export default function PoapClaimPage() {
  const [state, setState] = useState<"idle" | "loading" | "claimed" | "empty">("idle");
  const [mintUrl, setMintUrl] = useState("");
  const [code, setCode] = useState("");

  async function handleClaim() {
    setState("loading");
    try {
      const res = await fetch("/api/poap/claim");
      const data = await res.json();

      if (data.available) {
        setMintUrl(data.mintUrl);
        setCode(data.code);
        setState("claimed");
      } else {
        setState("empty");
      }
    } catch {
      setState("empty");
    }
  }

  // QR code via Google Charts API
  const qrUrl = mintUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(mintUrl)}`
    : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f0e8",
        fontFamily: "Georgia, 'Noto Serif TC', serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          background: "#fffdf9",
          borderRadius: 16,
          padding: "36px 28px",
          boxShadow: "0 2px 12px rgba(26,23,20,0.06)",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <img
          src="https://i.urusai.cc/RW2O0.jpg"
          alt="許明恩"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #fffdf9",
            display: "block",
            margin: "0 auto 14px",
          }}
        />
        <h1
          style={{
            margin: "0 0 4px",
            fontSize: 22,
            fontWeight: "bold",
            color: "#1a1714",
            letterSpacing: 3,
          }}
        >
          許明恩
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#7a7268" }}>
          區塊勢創辦人
        </p>

        {/* Idle state */}
        {state === "idle" && (
          <>
            <p
              style={{
                fontSize: 16,
                color: "#4a443c",
                lineHeight: 1.8,
                margin: "0 0 8px",
              }}
            >
              領取許明恩的鏈上紀念徽章
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#7a7268",
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}
            >
              這枚 POAP 數位徽章將永久保存在區塊鏈上，
              <br />
              作為我們交換名片的紀念。
            </p>
            <button
              onClick={handleClaim}
              style={{
                display: "inline-block",
                padding: "13px 36px",
                backgroundColor: "#6b5b3e",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              領取徽章
            </button>
          </>
        )}

        {/* Loading */}
        {state === "loading" && (
          <p style={{ fontSize: 16, color: "#7a7268", padding: "20px 0" }}>
            正在產生你的專屬連結⋯
          </p>
        )}

        {/* Claimed */}
        {state === "claimed" && (
          <>
            <p
              style={{
                fontSize: 16,
                color: "#4a443c",
                lineHeight: 1.8,
                margin: "0 0 20px",
              }}
            >
              這是你的專屬領取連結，
              <br />
              掃描 QR Code 或點擊下方按鈕即可領取。
            </p>
            <img
              src={qrUrl}
              alt="POAP QR Code"
              style={{
                width: 200,
                height: 200,
                display: "block",
                margin: "0 auto 20px",
                borderRadius: 8,
              }}
            />
            <a
              href={mintUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "13px 36px",
                backgroundColor: "#6b5b3e",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              前往領取
            </a>
            <p
              style={{
                fontSize: 12,
                color: "#b8b0a4",
                marginTop: 16,
              }}
            >
              此連結僅限使用一次
            </p>
          </>
        )}

        {/* Empty */}
        {state === "empty" && (
          <>
            <p
              style={{
                fontSize: 16,
                color: "#4a443c",
                lineHeight: 1.8,
                margin: "0 0 8px",
              }}
            >
              徽章已全數發放完畢
            </p>
            <p style={{ fontSize: 14, color: "#7a7268", lineHeight: 1.7 }}>
              感謝你的關注！歡迎到我的名片頁看看。
            </p>
            <a
              href="https://card.blocktrend.today"
              style={{
                display: "inline-block",
                marginTop: 16,
                padding: "12px 28px",
                backgroundColor: "#1a1714",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              查看名片
            </a>
          </>
        )}
      </div>
    </div>
  );
}
