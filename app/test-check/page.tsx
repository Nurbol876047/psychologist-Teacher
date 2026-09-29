"use client";

import { useTranslation } from "@/lib/i18n";
import TestChecker from "@/components/TestChecker";

export default function TestCheckPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-[#FAF6EF] via-white to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true">
              <circle cx="50" cy="50" r="46" fill="#34C759" />
              <path
                d="M30 52 L44 66 L72 36"
                fill="none"
                stroke="white"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500">ZipGrade</span>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true">
              <rect x="4" y="4" width="92" height="92" rx="24" fill="#3B82F6" />
              <rect x="26" y="30" width="48" height="58" rx="8" fill="#93C5FD" />
              <rect x="18" y="22" width="48" height="58" rx="8" fill="white" />
              <path
                d="M30 50 L41 61 L58 38"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Plickers</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-primary">{t("test_check_title")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("test_check_subtitle")}</p>
          </div>
        </div>

        <TestChecker />
      </div>
    </div>
  );
}
