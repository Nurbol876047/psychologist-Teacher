"use client";

import { useTranslation } from "@/lib/i18n";
import TestChecker from "@/components/TestChecker";

export default function TestCheckPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-[#FAF6EF] via-white to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary">{t("test_check_title")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("test_check_subtitle")}</p>
        </div>

        <TestChecker />
      </div>
    </div>
  );
}
