"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface CameraCaptureProps {
  onCapture: (base64: string, mediaType: string) => void;
  disabled?: boolean;
}

function compressImage(file: File, maxWidth = 1600): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
        resolve({ base64, mediaType: "image/jpeg" });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Compress and convert to base64
    const { base64, mediaType } = await compressImage(file);
    onCapture(base64, mediaType);
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="名片預覽"
            className="w-full rounded-xl border border-gray-200 shadow-sm"
          />
          <button
            onClick={() => {
              setPreview(null);
              fileInputRef.current!.value = "";
              fileInputRef.current?.click();
            }}
            disabled={disabled}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm active:scale-95 transition-transform"
          >
            {t("camera.retake")}
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full aspect-[1.6/1] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white active:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          <span className="text-gray-500 font-medium">{t("camera.capture")}</span>
        </button>
      )}
    </div>
  );
}
