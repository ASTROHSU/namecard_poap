"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PoapCode {
  id: number;
  code: string;
  event_name: string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  name_zh: string | null;
  name_en: string | null;
  contact_email: string | null;
}

export default function AdminLinksPage() {
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
      setMessage("請輸入至少一個 code");
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

  const available = codes.filter((c) => !c.assigned_to).length;
  const used = codes.filter((c) => c.assigned_to).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <Link href="/" className="text-gray-600 mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">POAP 管理</h1>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{codes.length}</p>
            <p className="text-xs text-gray-500 mt-1">總數</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{available}</p>
            <p className="text-xs text-gray-500 mt-1">可用</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{used}</p>
            <p className="text-xs text-gray-500 mt-1">已分配</p>
          </div>
        </div>

        {/* Add codes form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
          <h2 className="font-medium text-gray-900">新增 POAP Codes</h2>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event 名稱（選填，如 2026）"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="貼上 POAP claim codes，每行一個或用逗號分隔"
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
            {submitting ? "處理中..." : "新增"}
          </button>
        </form>

        {/* Codes list */}
        <div>
          <h2 className="font-medium text-gray-900 mb-3">Codes 列表</h2>
          {loading ? (
            <div className="text-center text-gray-400 py-8">載入中...</div>
          ) : codes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-gray-400">
              尚未新增任何 POAP codes
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
                        已分配
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        可用
                      </span>
                    )}
                  </div>
                  {c.assigned_to && (
                    <p className="text-xs text-gray-500 mt-1">
                      → {c.name_zh || c.name_en || c.contact_email || "未知"}
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
