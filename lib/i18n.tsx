"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "zh" | "en";

const translations = {
  // Common
  "app.title": { zh: "POAP 名片", en: "POAP Namecard" },
  "app.admin": { zh: "管理", en: "Admin" },

  // Login
  "login.title": { zh: "POAP 名片", en: "POAP Namecard" },
  "login.prompt": { zh: "請輸入 PIN 碼", en: "Enter PIN" },
  "login.placeholder": { zh: "PIN", en: "PIN" },
  "login.submit": { zh: "進入", en: "Enter" },
  "login.loading": { zh: "驗證中...", en: "Verifying..." },
  "login.error": { zh: "PIN 碼錯誤", en: "Incorrect PIN" },

  // Home
  "home.scan": { zh: "掃描名片", en: "Scan Card" },
  "home.recent": { zh: "最近聯絡人", en: "Recent Contacts" },
  "home.viewAll": { zh: "查看全部", en: "View All" },
  "home.noContacts": { zh: "尚無聯絡人", en: "No contacts yet" },
  "home.startScan": { zh: "掃描第一張名片開始吧！", en: "Scan your first card to get started!" },
  "home.unknown": { zh: "未知", en: "Unknown" },
  "home.sent": { zh: "已寄", en: "Sent" },

  // Scan
  "scan.title": { zh: "掃描名片", en: "Scan Card" },
  "scan.scanning": { zh: "AI 辨識中...", en: "AI scanning..." },
  "scan.recognized": { zh: "辨識完成，請確認資料", en: "Scan complete, please verify" },
  "scan.sending": { zh: "處理中...", en: "Processing..." },
  "scan.sendSuccess": { zh: "送出成功！", en: "Sent successfully!" },
  "scan.saveSuccess": { zh: "存檔成功！", en: "Saved successfully!" },
  "scan.savedNote": { zh: "名片已存檔", en: "Card saved" },
  "scan.sentNote": { zh: "名片已存檔，Email 已發送", en: "Card saved, email sent" },
  "scan.continue": { zh: "繼續掃描", en: "Scan Another" },
  "scan.viewContacts": { zh: "查看聯絡人", en: "View Contacts" },
  "scan.retry": { zh: "重新開始", en: "Start Over" },
  "scan.scanFailed": { zh: "辨識失敗，請重試", en: "Scan failed, please retry" },
  "scan.sendFailed": { zh: "送出失敗，請重試", en: "Send failed, please retry" },
  "scan.confirmSend": { zh: "確認並送出", en: "Confirm & Send" },
  "scan.noEmail": { zh: "缺少 Email，無法送出", en: "No email, cannot send" },
  "scan.saveOnly": { zh: "僅存檔（不送 Email / POAP）", en: "Save only (no Email / POAP)" },
  "scan.confirmTitle": { zh: "確認寄出 Email", en: "Confirm Send Email" },
  "scan.confirmMsg": { zh: "即將寄送 POAP 給以下對象：", en: "About to send POAP to:" },
  "scan.noName": { zh: "（未提供姓名）", en: "(No name provided)" },
  "scan.confirmBtn": { zh: "確定寄出", en: "Send Now" },
  "scan.backEdit": { zh: "返回修改", en: "Go Back" },

  // Contacts
  "contacts.title": { zh: "聯絡人", en: "Contacts" },
  "contacts.count": { zh: "筆", en: "entries" },
  "contacts.search": { zh: "搜尋姓名、公司、Email...", en: "Search name, company, email..." },
  "contacts.notFound": { zh: "找不到符合的聯絡人", en: "No matching contacts" },
  "contacts.none": { zh: "尚無聯絡人", en: "No contacts yet" },

  // Contact Form
  "form.noEmail": { zh: "⚠ 未偵測到 Email，請手動輸入", en: "⚠ No email detected, please enter manually" },
  "form.nameZh": { zh: "中文姓名", en: "Chinese Name" },
  "form.nameEn": { zh: "英文姓名", en: "English Name" },
  "form.companyZh": { zh: "中文公司", en: "Company (Chinese)" },
  "form.companyEn": { zh: "英文公司", en: "Company (English)" },
  "form.titleZh": { zh: "中文職稱", en: "Title (Chinese)" },
  "form.titleEn": { zh: "英文職稱", en: "Title (English)" },
  "form.email": { zh: "Email", en: "Email" },
  "form.phone": { zh: "電話", en: "Phone" },
  "form.mobile": { zh: "手機", en: "Mobile" },
  "form.address": { zh: "地址", en: "Address" },
  "form.website": { zh: "網站", en: "Website" },
  "form.social": { zh: "社群帳號", en: "Social Accounts" },
  "form.other": { zh: "其他", en: "Other" },
  "form.notes": { zh: "備註", en: "Notes" },
  "form.manualInput": { zh: "請手動輸入", en: "Please enter manually" },

  // Camera
  "camera.retake": { zh: "重拍", en: "Retake" },
  "camera.capture": { zh: "拍照或選擇名片", en: "Take photo or choose card" },

  // Admin
  "admin.title": { zh: "POAP 管理", en: "POAP Admin" },
  "admin.total": { zh: "總數", en: "Total" },
  "admin.available": { zh: "可用", en: "Available" },
  "admin.assigned": { zh: "已分配", en: "Assigned" },
  "admin.addCodes": { zh: "新增 POAP Codes", en: "Add POAP Codes" },
  "admin.eventPlaceholder": { zh: "Event 名稱（選填，如 2026）", en: "Event name (optional, e.g. 2026)" },
  "admin.codesPlaceholder": { zh: "貼上 POAP claim codes，每行一個或用逗號分隔", en: "Paste POAP claim codes, one per line or comma-separated" },
  "admin.submit": { zh: "新增", en: "Add" },
  "admin.submitting": { zh: "處理中...", en: "Processing..." },
  "admin.enterCode": { zh: "請輸入至少一個 code", en: "Enter at least one code" },
  "admin.codesList": { zh: "Codes 列表", en: "Codes List" },
  "admin.loading": { zh: "載入中...", en: "Loading..." },
  "admin.noCodes": { zh: "尚未新增任何 POAP codes", en: "No POAP codes added yet" },

  // Card page
  "card.save": { zh: "儲存聯絡資訊", en: "Save Contact" },
  "card.footer1": { zh: "這張名片是一個 POAP，永久保存在區塊鏈上。", en: "This card is a POAP, permanently stored on the blockchain." },
  "card.footer2": { zh: "不需要錢包也可以查看所有資訊。", en: "No wallet needed to view all information." },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[key]?.[locale] || key;
    },
    [locale]
  );

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "zh" ? "en" : "zh"));
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, toggleLocale } = useI18n();
  return (
    <button
      onClick={toggleLocale}
      className={`text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors ${className}`}
      title={locale === "zh" ? "Switch to English" : "切換中文"}
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  );
}
