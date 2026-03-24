"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Contact {
  id: string;
  name_zh: string | null;
  name_en: string | null;
  company_zh: string | null;
  company_en: string | null;
  title_zh: string | null;
  email: string | null;
  poap_code: string | null;
  email_sent: boolean;
  created_at: string;
}

export default function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => {
        setContacts(data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">POAP 名片</h1>
          <Link
            href="/admin/links"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            管理
          </Link>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Scan button */}
        <Link
          href="/scan"
          className="flex items-center justify-center gap-3 w-full py-6 bg-gray-900 text-white rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition-transform"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          掃描名片
        </Link>

        {/* Recent contacts */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              最近聯絡人
            </h2>
            <Link href="/contacts" className="text-sm text-gray-500 hover:text-gray-700">
              查看全部
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              <p>尚無聯絡人</p>
              <p className="text-sm mt-1">掃描第一張名片開始吧！</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((c) => (
                <Link
                  key={c.id}
                  href={`/contacts/${c.id}`}
                  className="block bg-white rounded-xl p-4 active:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {c.name_zh || c.name_en || "未知"}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {[c.company_zh || c.company_en, c.title_zh].filter(Boolean).join(" · ") || c.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {c.email_sent && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          已寄
                        </span>
                      )}
                      {c.poap_code && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          POAP
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(c.created_at).toLocaleDateString("zh-TW")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
