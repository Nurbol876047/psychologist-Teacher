"use client";

import { useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { MoodEntry, computeStreak } from "@/lib/moodStorage";

interface MoodStatsProps {
  rangeEntries: MoodEntry[];
  allEntries: MoodEntry[];
}

export default function MoodStats({ rangeEntries, allEntries }: MoodStatsProps) {
  const { t } = useTranslation();
  const streak = useMemo(() => computeStreak(allEntries), [allEntries]);
  const avg = rangeEntries.length
    ? rangeEntries.reduce((sum, e) => sum + e.level, 0) / rangeEntries.length
    : null;

  const tiles = [
    { label: t("mood_avg_label"), value: avg !== null ? `${avg.toFixed(1)} / 5` : "—", icon: "📊" },
    { label: t("mood_entries_label"), value: String(rangeEntries.length), icon: "🗓️" },
    { label: t("mood_streak_label"), value: `${streak} ${t("mood_streak_unit")}`, icon: "🔥" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="bg-white border border-slate-200 rounded-card shadow-card px-2.5 sm:px-4 py-3 sm:py-3.5 flex flex-col gap-1"
        >
          <span className="text-sm" aria-hidden>
            {tile.icon}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500 leading-tight">{tile.label}</span>
          <span className="text-base sm:text-lg font-semibold text-primary-dark leading-tight">{tile.value}</span>
        </div>
      ))}
    </div>
  );
}
