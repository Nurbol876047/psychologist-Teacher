import { Topic, TOPICS } from "@/data/topics";

// Қазақ әріптерін (ә, ғ, қ, ң, ө, ұ, ү, һ, і) дұрыс өңдеу үшін JS toLowerCase
// кириллицаны толық қолдайды, сондықтан қосымша карта қажет емес.
export function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function findTopicByKeywords(message: string): Topic | null {
  const normalized = normalize(message);

  for (const topic of TOPICS) {
    const allKeywords = [...topic.keywords_kk, ...topic.keywords_ru];
    for (const keyword of allKeywords) {
      if (normalized.includes(normalize(keyword))) {
        return topic;
      }
    }
  }

  return null;
}

export function findTopicById(id: number | null | undefined): Topic | null {
  if (id == null) return null;
  return TOPICS.find((t) => t.id === id) ?? null;
}
