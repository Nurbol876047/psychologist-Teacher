// Дағдарыс жағдайында көрсетілетін байланыстар.
// Мұнда нөмірлерді нақты, өзекті мәліметтерге ауыстырыңыз.
export interface HelpContact {
  label_kk: string;
  label_ru: string;
  phone: string;
}

export const CRISIS_CONTACTS: HelpContact[] = [
  {
    label_kk: "Сенім телефоны (тәулік бойы, тегін)",
    label_ru: "Телефон доверия (круглосуточно, бесплатно)",
    phone: "150",
  },
  {
    label_kk: "Психологиялық қолдау қызметі",
    label_ru: "Служба психологической поддержки",
    phone: "1414",
  },
  {
    label_kk: "Жедел жәрдем",
    label_ru: "Скорая помощь",
    phone: "103",
  },
];
