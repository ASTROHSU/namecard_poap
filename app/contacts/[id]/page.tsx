"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ContactDetail {
  id: string;
  name_zh: string | null;
  name_en: string | null;
  company_zh: string | null;
  company_en: string | null;
  title_zh: string | null;
  title_en: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  website: string | null;
  social: Record<string, string | null>;
  notes: string | null;
  card_image_url: string | null;
  poap_code: string | null;
  email_sent: boolean;
  created_at: string;
}

function InfoRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 w-20 shrink-0">{label}</span>
      {href ? (
        <a href={href} className="text-sm text-blue-600 break-all" target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ) : (
        <span className="text-sm text-gray-900 break-all">{value}</span>
      )}
    </div>
  );
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contacts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setContact(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">聯絡人不存在</p>
      </div>
    );
  }

  const poapUrl = contact.poap_code
    ? `https://app.poap.xyz/claim/${contact.poap_code}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button onClick={() => router.back()} className="text-gray-600 mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">
          {contact.name_zh || contact.name_en || "聯絡人"}
        </h1>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Status badges */}
        <div className="flex gap-2">
          {contact.email_sent && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
              Email 已寄送
            </span>
          )}
          {contact.poap_code && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
              POAP 已分配
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {new Date(contact.created_at).toLocaleDateString("zh-TW")}
          </span>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <InfoRow label="中文姓名" value={contact.name_zh} />
          <InfoRow label="英文姓名" value={contact.name_en} />
          <InfoRow label="中文公司" value={contact.company_zh} />
          <InfoRow label="英文公司" value={contact.company_en} />
          <InfoRow label="中文職稱" value={contact.title_zh} />
          <InfoRow label="英文職稱" value={contact.title_en} />
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <InfoRow label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
          <InfoRow label="電話" value={contact.phone} href={contact.phone ? `tel:${contact.phone}` : undefined} />
          <InfoRow label="手機" value={contact.mobile} href={contact.mobile ? `tel:${contact.mobile}` : undefined} />
          <InfoRow label="地址" value={contact.address} />
          <InfoRow label="網站" value={contact.website} href={contact.website || undefined} />
        </div>

        {/* Social */}
        {contact.social && Object.values(contact.social).some(Boolean) && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <InfoRow label="LinkedIn" value={contact.social.linkedin} />
            <InfoRow label="Twitter" value={contact.social.twitter} />
            <InfoRow label="LINE" value={contact.social.line} />
            <InfoRow label="WeChat" value={contact.social.wechat} />
            <InfoRow label="其他" value={contact.social.other} />
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">備註</p>
            <p className="text-sm text-gray-900">{contact.notes}</p>
          </div>
        )}

        {/* POAP link */}
        {poapUrl && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-purple-800 mb-2">POAP Claim Link</p>
            <a
              href={poapUrl}
              className="text-sm text-purple-600 break-all underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {poapUrl}
            </a>
          </div>
        )}

        {/* Original card image */}
        {contact.card_image_url && (
          <div>
            <p className="text-sm text-gray-500 mb-2">原始名片</p>
            <img
              src={contact.card_image_url}
              alt="名片原圖"
              className="w-full rounded-xl border border-gray-200"
            />
          </div>
        )}
      </main>
    </div>
  );
}
