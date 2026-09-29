"use client";

import Link from "next/link";
import { useLang, useTranslation, WHY_MODULES } from "@/lib/i18n";
import { TOPICS } from "@/data/topics";
import {
  LECTURE_INTRO,
  LECTURE_QUOTE,
  LECTURE_MODULES_SECTION,
  LECTURE_MODULES,
  LECTURE_BENEFITS_SECTION,
  LECTURE_BENEFITS,
  LECTURE_HABITS_SECTION,
  LECTURE_HABITS,
  LECTURE_FINAL,
} from "@/data/lecture";
import FadeInSection from "@/components/FadeInSection";
import SideDecoration from "@/components/SideDecoration";
import ModulesShowcase3D from "@/components/ModulesShowcase3D";

export default function HomePage() {
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <div className="relative">
      <SideDecoration side="left" />
      <SideDecoration side="right" />

      <div className="relative z-10 flex flex-col">
        {/* Hero */}
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="bg-panel rounded-card border border-slate-200 shadow-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/psychologist.jpg"
              alt={t("psychologist_alt")}
              className="w-36 h-36 sm:w-48 sm:h-48 rounded-card object-cover border-4 border-white shadow-card shrink-0"
            />
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-semibold text-primary">
                {t("home_greeting_title")}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t("home_greeting_text")}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                <span className="font-semibold text-primary-dark">
                  {t("psychologist_name")}
                </span>
                {" — "}
                {t("psychologist_role")}
              </p>
              <div>
                <Link
                  href="/consultation"
                  className="inline-block bg-accent hover:bg-accent-dark text-white text-sm font-medium px-5 py-2.5 rounded-card transition-colors"
                >
                  {t("ask_question")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Цитата */}
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-10 sm:pt-14">
          <div className="border-2 border-[#C9A96E] bg-panel rounded-card px-6 py-8 sm:px-12 sm:py-10 text-center">
            <p className="text-xl sm:text-2xl font-medium italic text-primary leading-snug whitespace-pre-line">
              &laquo;{LECTURE_QUOTE[lang]}&raquo;
            </p>
          </div>
        </section>

        {/* ==================== ЛЕКЦИЯ ==================== */}

        {/* 1. Кіріспе */}
        <FadeInSection className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-14 sm:pt-20">
          <div className="max-w-3xl flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-widest text-[#C9A96E]">
              {LECTURE_INTRO.eyebrow[lang]}
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary leading-snug">
              {LECTURE_INTRO.title[lang]}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {LECTURE_INTRO.paragraph1[lang]}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {LECTURE_INTRO.paragraph2[lang]}
            </p>
          </div>
        </FadeInSection>

        {/* Почему это важно */}
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-14 sm:pt-20 flex flex-col gap-8">
          <div className="max-w-2xl flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-accent-dark">
              {t("why_eyebrow")}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary leading-snug">
              {t("why_title")}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t("why_intro")}
            </p>
          </div>

          <div className="bg-[#FAF6EF] px-6 py-10 sm:px-12 sm:py-14">
            <ol className="border-t border-primary/20">
              {WHY_MODULES.map((mod) => (
                <li
                  key={mod.id}
                  className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr] gap-x-5 sm:gap-x-10 border-b border-primary/20 py-8 sm:py-10"
                >
                  <span className="font-serif text-2xl sm:text-3xl leading-none text-primary/60 tabular-nums">
                    {String(mod.id).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-serif text-lg sm:text-xl text-slate-900">
                      {lang === "kk" ? mod.title_kk : mod.title_ru}
                    </h3>
                    <p className="font-plex-sans text-[15px] sm:text-base text-slate-700 leading-[1.6] max-w-2xl">
                      {lang === "kk" ? mod.text_kk : mod.text_ru}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <figure className="mt-14 sm:mt-16 flex flex-col items-center sm:items-end text-center sm:text-right">
              <blockquote className="font-serif text-lg sm:text-xl text-slate-900 leading-relaxed max-w-md">
                {t("why_quote")}
              </blockquote>
              <figcaption className="mt-3 font-plex-sans text-xs tracking-[0.08em] text-slate-500 uppercase">
                {t("why_quote_source")}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 2. Қолдау модульдері */}
        <FadeInSection className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-14 sm:pt-20 flex flex-col gap-8">
          <div className="max-w-2xl flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-[#C9A96E]">
              {LECTURE_MODULES_SECTION.eyebrow[lang]}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary leading-snug">
              {LECTURE_MODULES_SECTION.title[lang]}
            </h2>
          </div>

          {/* Мобильде: 3D-сахна орнына статикалық академиялық тізім */}
          <div className="md:hidden bg-[#FAF6EF] px-6 py-10">
            <ol>
              {LECTURE_MODULES.map((mod) => {
                const topic = TOPICS.find((tp) => tp.id === mod.topicId);
                if (!topic) return null;
                const title = lang === "kk" ? topic.title_kk : topic.title_ru;

                return (
                  <li
                    key={mod.topicId}
                    className="grid grid-cols-[2.5rem_1fr] gap-x-5 border-t border-primary/20 py-8"
                  >
                    <span className="font-serif text-2xl leading-none text-primary/60 tabular-nums">
                      {String(topic.id).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2.5">
                      <h3 className="font-serif text-lg text-slate-900">{title}</h3>
                      <p className="font-plex-sans text-[15px] text-slate-700 leading-[1.6]">
                        {mod.text[lang]}
                      </p>
                      <Link
                        href={`/consultation?topic=${topic.id}`}
                        className="font-plex-sans mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
                      >
                        {t("video_advice_cta")} <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </FadeInSection>

        {/* Десктопте: бекітілген (sticky) 3D-скроллинг витрина */}
        <ModulesShowcase3D />

        {/* 3. Қолдаудың пайдасы */}
        <FadeInSection className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-14 sm:pt-20">
          <div className="bg-panel rounded-card p-6 sm:p-10 flex flex-col gap-8">
            <div className="max-w-2xl flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-widest text-[#C9A96E]">
                {LECTURE_BENEFITS_SECTION.eyebrow[lang]}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-primary leading-snug">
                {LECTURE_BENEFITS_SECTION.title[lang]}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {LECTURE_BENEFITS.map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white shadow-card flex items-center justify-center text-2xl">
                    <span aria-hidden>{b.icon}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-primary-dark">{b.title[lang]}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.text[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* 4. Күнделікті 5 әдет */}
        <FadeInSection className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-14 sm:pt-20 flex flex-col gap-8">
          <div className="max-w-2xl flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-[#C9A96E]">
              {LECTURE_HABITS_SECTION.eyebrow[lang]}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary leading-snug">
              {LECTURE_HABITS_SECTION.title[lang]}
            </h2>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute top-7 left-[10%] right-[10%] border-t-2 border-dashed border-[#C9A96E]/40" />
            <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4">
              {LECTURE_HABITS.map((h, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#C9A96E] flex items-center justify-center text-xl shadow-card z-10">
                    <span aria-hidden>{h.icon}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-primary-dark">{h.title[lang]}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{h.text[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* 5. Финал */}
        <FadeInSection className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-14 sm:pt-20">
          <div className="bg-panel rounded-card p-8 sm:p-12 flex flex-col items-center text-center gap-4">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {LECTURE_FINAL.paragraph[lang]}
            </p>
            <Link
              href="/consultation"
              className="inline-block bg-accent hover:bg-accent-dark text-white text-sm font-medium px-6 py-2.5 rounded-card transition-colors"
            >
              {t("ask_question")}
            </Link>
            <p className="text-xs text-slate-400">{t("footer_disclaimer")}</p>
          </div>
        </FadeInSection>

        <div className="h-14 sm:h-20" />
      </div>
    </div>
  );
}
