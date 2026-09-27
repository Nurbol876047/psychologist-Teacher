"use client";

import { useTranslation } from "@/lib/i18n";
import { getMoodLevel } from "@/data/moodLevels";
import { MoodEntry, deleteMoodEntry } from "@/lib/moodStorage";
import { formatLongDate } from "@/lib/dateFormat";

interface MoodJournalProps {
  entries: MoodEntry[];
  onChange: (entries: MoodEntry[]) => void;
}

export default function MoodJournal({ entries, onChange }: MoodJournalProps) {
  const { t, lang } = useTranslation();
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = (date: string) => {
    onChange(deleteMoodEntry(date));
  };

  if (sorted.length === 0) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-3">
      <h2 className="text-base font-semibold text-primary-dark">{t("mood_journal_title")}</h2>
      <ul className="flex flex-col divide-y divide-slate-100">
        {sorted.map((e) => {
          const m = getMoodLevel(e.level);
          return (
            <li key={e.date} className="flex items-start gap-3 py-3">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${m.color}1A` }}
                aria-hidden
              >
                {m.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-dark">
                  {formatLongDate(e.date, lang)}
                  <span className="text-slate-400 font-normal"> · {lang === "kk" ? m.label_kk : m.label_ru}</span>
                </p>
                {e.note && <p className="text-sm text-slate-600 mt-0.5 break-words">{e.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(e.date)}
                aria-label={t("mood_delete")}
                title={t("mood_delete")}
                className="shrink-0 text-slate-300 hover:text-red-500 transition-colors text-sm px-1"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
