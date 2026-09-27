"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { getMoodEntries, MoodEntry } from "@/lib/moodStorage";
import MoodPicker from "@/components/MoodPicker";
import MoodChart from "@/components/MoodChart";
import MoodJournal from "@/components/MoodJournal";

export default function MoodPage() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getMoodEntries());
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#FAF6EF] via-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary">{t("mood_title")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("mood_subtitle")}</p>
          <p className="text-xs text-slate-400 mt-1">{t("mood_privacy_note")}</p>
        </div>

        {loaded && (
          <>
            <MoodPicker entries={entries} onChange={setEntries} />
            <MoodChart entries={entries} />
            <MoodJournal entries={entries} onChange={setEntries} />
          </>
        )}
      </div>
    </div>
  );
}
