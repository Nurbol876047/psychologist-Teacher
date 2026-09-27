"use client";

import { useTranslation, useLang } from "@/lib/i18n";
import { ABOUT_FEATURES, ABOUT_STEPS } from "@/data/aboutContent";

export default function AboutPage() {
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-primary">{t("about_title")}</h1>

      <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-2">
        <h2 className="text-base font-semibold text-primary-dark">{t("about_goal_title")}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{t("about_goal_text")}</p>
      </section>

      <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-primary-dark">{t("about_features_title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ABOUT_FEATURES.map((f) => (
            <div key={f.title.kk} className="flex items-start gap-3">
              <span className="text-2xl shrink-0" aria-hidden>
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-primary-dark">
                  {lang === "kk" ? f.title.kk : f.title.ru}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                  {lang === "kk" ? f.text.kk : f.text.ru}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-primary-dark">{t("about_steps_title")}</h2>
        <ol className="flex flex-col gap-4">
          {ABOUT_STEPS.map((s, i) => (
            <li key={s.title.kk} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-primary-dark">
                  {lang === "kk" ? s.title.kk : s.title.ru}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                  {lang === "kk" ? s.text.kk : s.text.ru}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-2">
        <h2 className="text-base font-semibold text-primary-dark">{t("about_audience_title")}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{t("about_audience_text")}</p>
      </section>

      <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-2">
        <h2 className="text-base font-semibold text-primary-dark">{t("about_privacy_title")}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{t("about_privacy_text")}</p>
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
