"use client";

import { useTranslation, useLang } from "@/lib/i18n";
import { CRISIS_CONTACTS } from "@/config/help";

export default function CrisisBanner() {
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <div className="border-2 border-red-400 bg-red-50 rounded-card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="text-xl leading-none" aria-hidden>
          ⚠️
        </span>
        <div>
          <p className="font-semibold text-red-700">{t("crisis_title")}</p>
          <p className="text-sm text-red-700 mt-1">{t("crisis_text")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {CRISIS_CONTACTS.map((contact) => (
          <a
            key={contact.phone}
            href={`tel:${contact.phone}`}
            className="flex items-center justify-between bg-white border border-red-200 rounded-card px-3 py-2 text-sm hover:border-red-400 transition-colors"
          >
            <span className="text-red-800">
              {lang === "kk" ? contact.label_kk : contact.label_ru}
            </span>
            <span className="font-semibold text-red-700 shrink-0 ml-3">{contact.phone}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
