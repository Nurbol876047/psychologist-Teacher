import { normalize } from "@/lib/matchTopic";

// Дағдарыс емес, жай ғана шаршау/күйзеліс белгілері. Мақсаты — жанды демеу
// сөз бен фильм ұсынысын дер кезінде көрсету. Тізім толық емес.
const TIRED_PATTERNS: string[] = [
  "шаршадым",
  "шаршап",
  "шаршау",
  "күйіп кеттім",
  "күйіп кету",
  "күйзелдім",
  "күшім жоқ",
  "әл-дәрменім жоқ",
  "демалғым келеді",
  "жалығып",
  "титықтадым",

  "устал",
  "устала",
  "выгорел",
  "выгорела",
  "выгорание",
  "нет сил",
  "сил больше нет",
  "измотан",
  "измотана",
  "не могу больше",
  "тяжело на душе",
  "хочу отдохнуть",
  "опустошен",
  "опустошена",
];

export function isTiredMessage(message: string): boolean {
  const normalized = normalize(message);
  return TIRED_PATTERNS.some((pattern) => normalized.includes(normalize(pattern)));
}
