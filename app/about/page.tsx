"use client";

import { useTranslation } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-primary">{t("about_title")}</h1>

      <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-2">
        <h2 className="text-base font-semibold text-primary-dark">{t("about_goal_title")}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{t("about_goal_text")}</p>
      </section>

      <section className="bg-panel border border-slate-200 rounded-card p-5 flex flex-col gap-2">
        <h2 className="text-base font-semibold text-primary-dark">
          {t("about_disclaimer_title")}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">{t("about_disclaimer_text")}</p>
      </section>
    </div>
  );
}
