"use client";

import { useLang } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center bg-panel rounded-card p-1 shrink-0">
      <button
        type="button"
        onClick={() => setLang("kk")}
        className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors ${
          lang === "kk" ? "bg-primary text-white" : "text-slate-600 hover:text-primary"
        }`}
      >
        ҚАЗ
      </button>
      <button
        type="button"
        onClick={() => setLang("ru")}
        className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors ${
          lang === "ru" ? "bg-primary text-white" : "text-slate-600 hover:text-primary"
        }`}
      >
        РУС
      </button>
    </div>
  );
}
