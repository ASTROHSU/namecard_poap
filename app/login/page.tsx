"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n, LanguageToggle } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useI18n();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError(t("login.error"));
      setPin("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("login.title")}</h1>
          <p className="text-gray-500 mt-1">{t("login.prompt")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t("login.placeholder")}
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>
        <div className="mt-6 text-center">
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
