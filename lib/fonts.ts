import { PT_Serif, IBM_Plex_Sans } from "next/font/google";

// Академическая вёрстка секции "Неге бұл маңызды": засечный шрифт для
// заголовков/номеров и гротеск для основного текста, оба с поддержкой кириллицы.
export const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  display: "swap",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});
