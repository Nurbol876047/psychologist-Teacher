export type MoodLang = "kk" | "ru";

// Intl-дің kk-KZ үшін толық CLDR деректері жоқ (ай атаулары "M09" болып шығады),
// сондықтан ай атауларын қолмен анықтаймыз — браузерге тәуелді болмау үшін.
const MONTHS_KK = [
  "қаңтар",
  "ақпан",
  "наурыз",
  "сәуір",
  "мамыр",
  "маусым",
  "шілде",
  "тамыз",
  "қыркүйек",
  "қазан",
  "қараша",
  "желтоқсан",
];

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export function formatShortDate(dateKey: string): string {
  const [, m, d] = dateKey.split("-");
  return `${d}.${m}`;
}

export function formatLongDate(dateKey: string, lang: MoodLang): string {
  const [y, m, d] = dateKey.split("-");
  const months = lang === "kk" ? MONTHS_KK : MONTHS_RU;
  const month = months[Number(m) - 1];
  const day = String(Number(d));
  return lang === "kk" ? `${day} ${month}, ${y} ж.` : `${day} ${month} ${y} г.`;
}
