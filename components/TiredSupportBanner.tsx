"use client";

import { useTranslation, useLang } from "@/lib/i18n";
import { SchoolMovie } from "@/data/schoolMovies";

export default function TiredSupportBanner({ movie }: { movie: SchoolMovie }) {
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <div className="border border-accent/30 bg-accent/5 rounded-card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="text-xl leading-none" aria-hidden>
          🌿
        </span>
        <div>
          <p className="font-semibold text-accent-dark">{t("tired_title")}</p>
          <p className="text-sm text-slate-600 mt-1">{t("tired_text")}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-card px-3.5 py-3 flex items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>
          🎬
        </span>
        <div>
          <p className="text-sm font-semibold text-primary-dark">
            {movie.title} <span className="text-slate-400 font-normal">({movie.year})</span>
          </p>
          <p className="text-xs text-slate-500">{lang === "kk" ? movie.country_kk : movie.country_ru}</p>
          <p className="text-sm text-slate-600 mt-1">{lang === "kk" ? movie.note_kk : movie.note_ru}</p>
        </div>
      </div>
    </div>
  );
}
