"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

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

export default function ContactsPage() {
  const { t } = useI18n();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = search ? `?q=${encodeURIComponent(search)}` : "";
      fetch(`/api/contacts${params}`)
        .then((r) => r.json())
        .then((data) => {
          setContacts(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <Link href="/" className="text-gray-600 mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">{t("contacts.title")}</h1>
        <span className="ml-auto text-sm text-gray-400">
          {!loading && `${contacts.length} ${t("contacts.count")}`}
        </span>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("contacts.search")}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        <div className="mt-4 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))
          ) : contacts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              {search ? t("contacts.notFound") : t("contacts.none")}
            </div>
          ) : (
            contacts.map((c) => (
              <Link
                key={c.id}
                href={`/contacts/${c.id}`}
                className="block bg-white rounded-xl p-4 active:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {c.name_zh || c.name_en || t("home.unknown")}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {[c.company_zh || c.company_en, c.title_zh].filter(Boolean).join(" · ") || c.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {c.email_sent && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {t("home.sent")}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
