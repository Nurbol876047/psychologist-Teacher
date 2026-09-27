// 10 тақырып: видео, кілт сөздер (kk/ru) және дайын жауап мәтіндері.
// response_kk / response_ru өрістерін толтырыңыз (тақырып 1 үлгі ретінде толтырылған).
export interface Topic {
  id: number;
  title_kk: string;
  title_ru: string;
  keywords_kk: string[];
  keywords_ru: string[];
  video: string;
  response_kk: string;
  response_ru: string;
}

export const TOPICS: Topic[] = [
  {
    id: 1,
    title_kk: "Шаршау",
    title_ru: "Усталость",
    keywords_kk: ["шаршадым", "шаршау"],
    keywords_ru: ["устал", "усталость"],
    video: "01.mp4",
    response_kk:
      "Шаршағаныңыз түсінікті, сіз көп еңбек етесіз. Бүгін өзіңізге уақыт бөліп, демалыңыз. Сіздің денсаулығыңыз маңызды.",
    response_ru:
      "Ваша усталость понятна — вы вкладываете много сил в работу. Сегодня уделите время себе и отдохните. Ваше здоровье важно.",
  },
  {
    id: 2,
    title_kk: "Оқушылар тыңдамайды",
    title_ru: "Ученики не слушают",
    keywords_kk: ["тыңдамайды", "тәртіп"],
    keywords_ru: ["не слушают", "дисциплина"],
    video: "02.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 3,
    title_kk: "Ата-анамен түсініспеушілік",
    title_ru: "Конфликт с родителями",
    keywords_kk: ["ата-ана"],
    keywords_ru: ["родители", "жалоба"],
    video: "03.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 4,
    title_kk: "Ашық сабақ алдындағы толқу",
    title_ru: "Волнение перед открытым уроком",
    keywords_kk: ["толқу", "ашық сабақ"],
    keywords_ru: ["волнуюсь", "открытый урок"],
    video: "04.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 5,
    title_kk: "Шабыт жоқ",
    title_ru: "Нет мотивации",
    keywords_kk: ["шабыт"],
    keywords_ru: ["мотивация", "не хочу"],
    video: "05.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 6,
    title_kk: "Әріптестермен қарым-қатынас",
    title_ru: "Отношения с коллегами",
    keywords_kk: ["әріптес", "ұжым"],
    keywords_ru: ["коллеги"],
    video: "06.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 7,
    title_kk: "Уақыт жетпейді",
    title_ru: "Не хватает времени",
    keywords_kk: ["уақыт", "үлгермеймін"],
    keywords_ru: ["время", "не успеваю"],
    video: "07.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 8,
    title_kk: "Ашулану",
    title_ru: "Гнев",
    keywords_kk: ["ашу", "ашуланамын"],
    keywords_ru: ["злюсь", "раздражение"],
    video: "08.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 9,
    title_kk: "Кәсіби күйіп кету",
    title_ru: "Выгорание",
    keywords_kk: ["күйіп кету", "ештеңе қызық емес"],
    keywords_ru: ["выгорание"],
    video: "09.mp4",
    response_kk: "",
    response_ru: "",
  },
  {
    id: 10,
    title_kk: "Өзіме сенбеймін",
    title_ru: "Неуверенность",
    keywords_kk: ["сенбеймін"],
    keywords_ru: ["неуверенность", "не получается"],
    video: "10.mp4",
    response_kk: "",
    response_ru: "",
  },
];
