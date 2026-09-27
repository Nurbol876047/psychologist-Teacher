"use client";

import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-panel">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500">
        {t("footer_disclaimer")}
      </div>
    </footer>
  );
}
