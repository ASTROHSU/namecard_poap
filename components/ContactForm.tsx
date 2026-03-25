"use client";

import type { CardData } from "@/lib/claude";
import { useI18n } from "@/lib/i18n";

interface ContactFormProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

function Field({
  label,
  value,
  field,
  onChange,
  type = "text",
  highlight = false,
  highlightPlaceholder = "",
}: {
  label: string;
  value: string | null;
  field: string;
  onChange: (field: string, value: string) => void;
  type?: string;
  highlight?: boolean;
  highlightPlaceholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 ${
          highlight && !value
            ? "border-amber-400 bg-amber-50"
            : "border-gray-200"
        }`}
        placeholder={highlight && !value ? highlightPlaceholder : ""}
      />
    </div>
  );
}

export default function ContactForm({ data, onChange }: ContactFormProps) {
  const { t } = useI18n();

  function handleChange(field: string, value: string) {
    if (field.startsWith("social.")) {
      const socialField = field.split(".")[1];
      onChange({
        ...data,
        social: { ...data.social, [socialField]: value || null },
      });
    } else {
      onChange({ ...data, [field]: value || null });
    }
  }

  return (
    <div className="space-y-3">
      {!data.email && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
          {t("form.noEmail")}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.nameZh")} value={data.name_zh} field="name_zh" onChange={handleChange} />
        <Field label={t("form.nameEn")} value={data.name_en} field="name_en" onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.companyZh")} value={data.company_zh} field="company_zh" onChange={handleChange} />
        <Field label={t("form.companyEn")} value={data.company_en} field="company_en" onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.titleZh")} value={data.title_zh} field="title_zh" onChange={handleChange} />
        <Field label={t("form.titleEn")} value={data.title_en} field="title_en" onChange={handleChange} />
      </div>

      <Field
        label={t("form.email")}
        value={data.email}
        field="email"
        onChange={handleChange}
        type="email"
        highlight
        highlightPlaceholder={t("form.manualInput")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.phone")} value={data.phone} field="phone" onChange={handleChange} type="tel" />
        <Field label={t("form.mobile")} value={data.mobile} field="mobile" onChange={handleChange} type="tel" />
      </div>

      <Field label={t("form.address")} value={data.address} field="address" onChange={handleChange} />
      <Field label={t("form.website")} value={data.website} field="website" onChange={handleChange} type="url" />

      <details className="pt-1">
        <summary className="text-sm font-medium text-gray-500 cursor-pointer">
          {t("form.social")}
        </summary>
        <div className="mt-2 space-y-3">
          <Field label="LinkedIn" value={data.social?.linkedin} field="social.linkedin" onChange={handleChange} />
          <Field label="Twitter / X" value={data.social?.twitter} field="social.twitter" onChange={handleChange} />
          <Field label="LINE" value={data.social?.line} field="social.line" onChange={handleChange} />
          <Field label="WeChat" value={data.social?.wechat} field="social.wechat" onChange={handleChange} />
          <Field label={t("form.other")} value={data.social?.other} field="social.other" onChange={handleChange} />
        </div>
      </details>

      <Field label={t("form.notes")} value={data.notes} field="notes" onChange={handleChange} />
    </div>
  );
}
