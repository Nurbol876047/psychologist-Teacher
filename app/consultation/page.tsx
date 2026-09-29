"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLang, useTranslation } from "@/lib/i18n";
import { findTopicByKeywords, findTopicById } from "@/lib/matchTopic";
import { isCrisisMessage } from "@/lib/crisisDetect";
import { isTiredMessage } from "@/lib/tiredDetect";
import { Topic } from "@/data/topics";
import { SCHOOL_MOVIES, SchoolMovie } from "@/data/schoolMovies";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel, { ChatMessage } from "@/components/ChatPanel";

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const TIRED_MOVIE_INDEX_KEY = "tiredMovieIndex";

function getNextTiredMovie(): SchoolMovie {
  let index = 0;
  try {
    index = Number(window.localStorage.getItem(TIRED_MOVIE_INDEX_KEY)) || 0;
  } catch {
    index = 0;
  }
  const movie = SCHOOL_MOVIES[index % SCHOOL_MOVIES.length];
  try {
    window.localStorage.setItem(TIRED_MOVIE_INDEX_KEY, String(index + 1));
  } catch {
    // localStorage болмаса (жеке шолу режимі), тек ретсіз таңдаумен жалғастырамыз
  }
  return movie;
}

function ConsultationInner() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const initialTopicHandled = useRef(false);

  const addMessage = (role: ChatMessage["role"], text?: string, movie?: SchoolMovie) => {
    setMessages((prev) => [...prev, { id: nextId(), role, text, movie }]);
  };

  // Мұғалімнің нақты хабарламасын жібермейміз — тек анонимді оқиға логы,
  // бұл сайттың құпиялылық уәдесін бұзбайды. Енді нақты сөздерге емес,
  // чаттағы КЕЗ КЕЛГЕН хабарламаға іске қосылады.
  const notifyTelegram = (kind: "message" | "tired" | "crisis", movieTitle?: string) => {
    let text: string;
    if (kind === "crisis") {
      text =
        lang === "kk"
          ? "Бір мұғалімнің хабарламасында дағдарыс белгілері байқалды. Сайт оған маман байланыстарын дереу көрсетті."
          : "В сообщении одного из учителей обнаружены признаки кризиса. Сайт сразу показал ему контакты специалистов.";
    } else if (kind === "tired") {
      text =
        lang === "kk"
          ? `Бір мұғалім қолдау бетінде шаршағанын білдірді. Ұсынылған фильм: «${movieTitle}».`
          : `Один из учителей выразил усталость на странице поддержки. Рекомендован фильм: «${movieTitle}».`;
    } else {
      text =
        lang === "kk"
          ? "Бір мұғалім қолдау чатына жаңа хабарлама жазды."
          : "Один из учителей написал новое сообщение в чат поддержки.";
    }
    fetch("/api/telegram-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).catch(() => {});
  };

  const fetchGeneralAnswer = async (message: string): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.text) return data.text as string;
      return data.error ?? "Қате пайда болды.";
    } catch {
      return "Жауап алу кезінде қате пайда болды. Кейінірек қайталап көріңіз.";
    }
  };

  const respondWithTopic = async (topic: Topic, originalMessage: string) => {
    setActiveVideo(topic.video);
    const preset = lang === "kk" ? topic.response_kk : topic.response_ru;
    if (preset && preset.trim()) {
      addMessage("assistant", preset);
    } else {
      const generated = await fetchGeneralAnswer(originalMessage);
      addMessage("assistant", generated);
    }
  };

  const handleSend = async (message: string) => {
    addMessage("user", message);

    if (isCrisisMessage(message)) {
      setActiveVideo(null);
      addMessage("crisis");
      notifyTelegram("crisis");
      return;
    }

    if (isTiredMessage(message)) {
      const movie = getNextTiredMovie();
      addMessage("tired", undefined, movie);
      notifyTelegram("tired", movie.title);
    } else {
      notifyTelegram("message");
    }

    setLoading(true);
    try {
      const keywordTopic = findTopicByKeywords(message);
      if (keywordTopic) {
        await respondWithTopic(keywordTopic, message);
        return;
      }

      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const classifiedTopic = findTopicById(data.topicId);

      if (classifiedTopic) {
        await respondWithTopic(classifiedTopic, message);
      } else {
        setActiveVideo(null);
        const generated = await fetchGeneralAnswer(message);
        addMessage("assistant", generated);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTopicHandled.current) return;
    initialTopicHandled.current = true;

    const topicParam = searchParams.get("topic");
    if (!topicParam) return;
    const topic = findTopicById(Number(topicParam));
    if (!topic) return;

    const title = lang === "kk" ? topic.title_kk : topic.title_ru;
    void handleSend(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-primary mb-5">
        {t("consultation_title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
        <VideoPlayer videoSrc={activeVideo} onEnded={() => setActiveVideo(null)} />
        <div className="h-full lg:h-[70vh]">
          <ChatPanel messages={messages} loading={loading} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={null}>
      <ConsultationInner />
    </Suspense>
  );
}
