"use client";

import { useI18n, LanguageToggle } from "@/lib/i18n";

export default function CardPage() {
  const { t } = useI18n();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="w-full max-w-md px-6 py-12">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Avatar / Visual */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-5 shadow-lg">
            A
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            許明恩 Astro Hsu
          </h1>
          <p className="text-gray-600 mt-1">
            Founder, 區塊勢 Blocktrend
          </p>
        </div>

        {/* Contact info */}
        <div className="space-y-3 mb-8">
          <a
            href="mailto:mn@blocktrend.today"
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">mn@blocktrend.today</p>
            </div>
          </a>

          <a
            href="https://blocktrend.today"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("form.website")}</p>
              <p className="text-sm font-medium text-gray-900">blocktrend.today</p>
            </div>
          </a>

          <a
            href="https://x.com/mnhsuTW"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 shrink-0 text-sm font-bold">
              𝕏
            </span>
            <div>
              <p className="text-sm text-gray-500">X (Twitter)</p>
              <p className="text-sm font-medium text-gray-900">@mnhsuTW</p>
            </div>
          </a>
        </div>

        {/* Bio */}
        <div className="mb-8 px-1">
          <p className="text-sm text-gray-600 leading-relaxed">
            區塊勢是台灣最大的繁體中文 Web3 訂閱媒體，自 2017
            年起持續發行，目前有超過 17,000 位付費訂戶。
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={`${appUrl}/api/vcard`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm shadow-sm active:scale-[0.98] transition-transform"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t("card.save")}
          </a>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("card.footer1")}
            <br />
            {t("card.footer2")}
          </p>
        </div>
      </main>
    </div>
  );
}
