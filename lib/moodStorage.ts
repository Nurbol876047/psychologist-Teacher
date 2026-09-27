export interface MoodEntry {
  date: string; // YYYY-MM-DD (local)
  level: number; // 1-5
  note: string;
  updatedAt: number;
}

const STORAGE_KEY = "mp_mood_entries";

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function getMoodEntries(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is MoodEntry =>
          e && typeof e.date === "string" && typeof e.level === "number"
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

function persist(entries: MoodEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveMoodEntry(date: string, level: number, note: string): MoodEntry[] {
  const entries = getMoodEntries().filter((e) => e.date !== date);
  entries.push({ date, level, note: note.trim(), updatedAt: Date.now() });
  entries.sort((a, b) => a.date.localeCompare(b.date));
  persist(entries);
  return entries;
}

export function deleteMoodEntry(date: string): MoodEntry[] {
  const entries = getMoodEntries().filter((e) => e.date !== date);
  persist(entries);
  return entries;
}

export function getEntriesInRange(entries: MoodEntry[], days: number): MoodEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cutoffKey = toDateKey(cutoff);
  return entries.filter((e) => e.date >= cutoffKey);
}

// Бүгіннен (немесе кеше жазба болса, кешеден) кері санап, үзіліссіз
// белгіленген күндер тізбегінің ұзындығын қайтарады.
export function computeStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const dateSet = new Set(entries.map((e) => e.date));
  const cursor = new Date();
  if (!dateSet.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (dateSet.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
