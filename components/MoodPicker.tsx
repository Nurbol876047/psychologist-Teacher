"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { getMoodLevel, MOOD_LEVELS } from "@/data/moodLevels";
import { MoodEntry, saveMoodEntry, todayKey } from "@/lib/moodStorage";
import MoodOrb from "@/components/MoodOrb";

interface MoodPickerProps {
  entries: MoodEntry[];
  onChange: (entries: MoodEntry[]) => void;
}

export default function MoodPicker({ entries, onChange }: MoodPickerProps) {
  const { t, lang } = useTranslation();
  const today = todayKey();
  const existing = entries.find((e) => e.date === today);

  const [level, setLevel] = useState<number | null>(existing?.level ?? null);
  const [note, setNote] = useState(existing?.note ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLevel(existing?.level ?? null);
    setNote(existing?.note ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, existing]);

  const handleSave = () => {
    if (level === null) return;
    const updated = saveMoodEntry(today, level, note);
    onChange(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeLevel = level !== null ? getMoodLevel(level) : null;

  return (
    <section className="bg-white border border-slate-200 rounded-card shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div
          className="relative sm:w-52 h-44 sm:h-auto shrink-0 overflow-hidden bg-[#FAF6EF]"
          style={{
            backgroundImage: "radial-gradient(rgba(30,58,95,0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <MoodOrb level={level} />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center gap-0.5">
            <span className="text-xl" aria-hidden>
              {activeLevel?.emoji ?? "✨"}
            </span>
            <span className="text-[11px] font-medium text-primary-dark/70 tracking-wide">
              {activeLevel ? (lang === "kk" ? activeLevel.label_kk : activeLevel.label_ru) : t("mood_orb_idle")}
            </span>
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-semibold text-primary-dark">{t("mood_today_label")}</h2>
            <p className="text-sm text-slate-500">{t("mood_pick_prompt")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {MOOD_LEVELS.map((m) => {
              const active = level === m.level;
              return (
                <button
                  key={m.level}
                  type="button"
                  onClick={() => setLevel(m.level)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-card border text-xs font-medium transition-colors min-w-[64px] ${
                    active
                      ? "border-accent bg-accent/10 text-accent-dark"
                      : "border-slate-200 text-slate-500 hover:border-accent/50 hover:bg-panel"
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {m.emoji}
                  </span>
                  {lang === "kk" ? m.label_kk : m.label_ru}
                </button>
              );
            })}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("mood_note_placeholder")}
            rows={2}
            className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={level === null}
              className="px-5 py-2.5 rounded-card bg-accent text-white text-sm font-medium hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t("mood_save")}
            </button>
            {saved && <span className="text-xs text-accent-dark">{t("mood_saved_today")}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
