export interface MoodLevel {
  level: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  label_kk: string;
  label_ru: string;
  color: string;
}

export const MOOD_LEVELS: MoodLevel[] = [
  { level: 1, emoji: "😞", label_kk: "Өте нашар", label_ru: "Очень плохо", color: "#94A3B8" },
  { level: 2, emoji: "🙁", label_kk: "Нашар", label_ru: "Плохо", color: "#2C5182" },
  { level: 3, emoji: "😐", label_kk: "Қалыпты", label_ru: "Нормально", color: "#2FA6A6" },
  { level: 4, emoji: "🙂", label_kk: "Жақсы", label_ru: "Хорошо", color: "#4FC2C2" },
  { level: 5, emoji: "😄", label_kk: "Өте жақсы", label_ru: "Отлично", color: "#C9A96E" },
];

export function getMoodLevel(level: number): MoodLevel {
  return MOOD_LEVELS.find((m) => m.level === level) ?? MOOD_LEVELS[2];
}
