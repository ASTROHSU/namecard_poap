"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface PoapCode {
  id: number;
  code: string;
  event_name: string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  clicked_at: string | null;
  name_zh: string | null;
  name_en: string | null;
  contact_email: string | null;
}

export default function AdminLinksPage() {
  const { t } = useI18n();
  const [codes, setCodes] = useState<PoapCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [eventName, setEventName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function loadCodes() {
    fetch("/api/admin/links")
      .then((r) => r.json())
      .then((data) => {
        setCodes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadCodes();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Parse codes: one per line, or comma separated
    const parsed = input
      .split(/[\n,]/)
      .map((c) => c.trim())
      .filter(Boolean);

    if (parsed.length === 0) {
      setMessage(t("admin.enterCode"));
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: parsed, eventName: eventName || undefined }),
    });

    const data = await res.json();
    setMessage(`成功新增 ${data.inserted} / ${data.total} 個 codes`);
    setInput("");
    setSubmitting(false);
    loadCodes();
  }

  const available = codes.filter((c) => !c.assigned_to && !c.clicked_at).length;
  const clicked = codes.filter((c) => c.clicked_at && !c.assigned_to).length;
  const used = codes.filter((c) => c.assigned_to).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <Link href="/" className="text-gray-600 mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">{t("admin.title")}</h1>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{codes.length}</p>
            <p className="text-xs text-gray-500 mt-1">{t("admin.total")}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{available}</p>
            <p className="text-xs text-gray-500 mt-1">{t("admin.available")}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-amber-600">{clicked}</p>
            <p className="text-xs text-gray-500 mt-1">已領取</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{used}</p>
            <p className="text-xs text-gray-500 mt-1">{t("admin.assigned")}</p>
          </div>
        </div>

        {/* Add codes form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
          <h2 className="font-medium text-gray-900">{t("admin.addCodes")}</h2>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder={t("admin.eventPlaceholder")}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("admin.codesPlaceholder")}
            rows={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
          {message && (
            <p className="text-sm text-green-700">{message}</p>
          )}
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {submitting ? t("admin.submitting") : t("admin.submit")}
          </button>
        </form>

        {/* Codes list */}
        <div>
          <h2 className="font-medium text-gray-900 mb-3">{t("admin.codesList")}</h2>
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t("admin.loading")}</div>
          ) : codes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-gray-400">
              {t("admin.noCodes")}
            </div>
          ) : (
            <div className="space-y-2">
              {codes.map((c) => (
                <div
                  key={c.id}
                  className={`bg-white rounded-xl p-3 border text-sm ${
                    c.assigned_to ? "border-purple-100" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-gray-600 font-mono">
                      {c.code}
                    </code>
                    {c.assigned_to ? (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {t("admin.assigned")}
                      </span>
                    ) : c.clicked_at ? (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        已領取
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {t("admin.available")}
                      </span>
                    )}
                  </div>
                  {c.assigned_to && (
                    <p className="text-xs text-gray-500 mt-1">
                      → {c.name_zh || c.name_en || c.contact_email || t("home.unknown")}
                    </p>
                  )}
                  {c.clicked_at && !c.assigned_to && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(c.clicked_at).toLocaleString("zh-TW")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
