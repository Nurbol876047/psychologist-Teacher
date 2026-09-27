"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { TOPICS } from "@/data/topics";
import CrisisBanner from "@/components/CrisisBanner";
import { useLang } from "@/lib/i18n";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "crisis";
  text?: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (message: string) => void;
}

// Браузердің дыбыс жазу мүмкіндігін тексеру (SpeechRecognition емес —
// оның орнына аудио жазып, серверде Whisper арқылы танимыз).
function isVoiceCaptureSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(navigator.mediaDevices && (window as any).MediaRecorder);
}

export default function ChatPanel({ messages, loading, onSend }: ChatPanelProps) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  // Жазу басталғанда өріс бос па еді — бос болса, танылған мәтінді бірден
  // жібереміз, толтырылған болса тек қосамыз (пайдаланушы құрастыруды жалғастырады).
  const voiceStartedEmptyRef = useRef(false);

  useEffect(() => {
    setVoiceSupported(isVoiceCaptureSupported());
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const handleRecordedAudio = async (blob: Blob) => {
    if (blob.size === 0) {
      setVoiceError(t("mic_error_no_speech"));
      return;
    }

    setTranscribing(true);
    try {
      const body = new FormData();
      body.append("audio", blob, "voice.webm");
      body.append("lang", lang);

      const res = await fetch("/api/transcribe", { method: "POST", body });
      const data = await res.json();

      if (!res.ok || !data.text) {
        setVoiceError(data.error === "no_speech" ? t("mic_error_no_speech") : t("mic_error_generic"));
        return;
      }

      if (voiceStartedEmptyRef.current) {
        onSend(data.text);
      } else {
        setInput((prev) => (prev ? `${prev} ${data.text}` : data.text));
      }
    } catch {
      setVoiceError(t("mic_error_generic"));
    } finally {
      setTranscribing(false);
    }
  };

  const startRecording = async () => {
    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        const blob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });
        audioChunksRef.current = [];
        void handleRecordedAudio(blob);
      };

      recorder.start();
      setListening(true);
    } catch (err: any) {
      setListening(false);
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        setVoiceError(t("mic_error_permission"));
      } else if (err?.name === "NotFoundError") {
        setVoiceError(t("mic_error_no_device"));
      } else {
        setVoiceError(t("mic_error_generic"));
      }
    }
  };

  const toggleVoice = () => {
    if (listening) {
      mediaRecorderRef.current?.stop();
      setListening(false);
      return;
    }
    voiceStartedEmptyRef.current = !input.trim();
    void startRecording();
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-card shadow-card overflow-hidden">
      <div ref={feedRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[320px] max-h-[55vh] lg:max-h-none">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center my-auto">{t("chat_empty")}</p>
        )}

        {messages.map((m) => {
          if (m.role === "crisis") {
            return (
              <div key={m.id} className="w-full">
                <CrisisBanner />
              </div>
            );
          }
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-card px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-white"
                    : "bg-panel text-primary-dark border border-slate-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-panel border border-slate-200 rounded-card px-3.5 py-2.5 text-sm text-slate-500 italic">
              {t("loading_answer")}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat_placeholder")}
            className="flex-1 rounded-card border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              disabled={transcribing}
              title={t("mic_start")}
              aria-label={t("mic_start")}
              className={`shrink-0 w-10 h-10 rounded-card flex items-center justify-center border transition-colors ${
                listening
                  ? "bg-red-500 border-red-500 text-white animate-pulse"
                  : transcribing
                  ? "bg-panel border-slate-300 text-slate-400 cursor-wait"
                  : "bg-white border-slate-300 text-primary hover:bg-panel"
              }`}
            >
              🎤
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={loading || !input.trim()}
            className="shrink-0 px-4 h-10 rounded-card bg-accent text-white text-sm font-medium hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("send")}
          </button>
        </div>
        {listening && <p className="text-xs text-accent-dark">{t("mic_listening")}</p>}
        {transcribing && <p className="text-xs text-accent-dark">{t("mic_transcribing")}</p>}
        {!listening && !transcribing && voiceError && (
          <p className="text-xs text-red-500">{voiceError}</p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSend(lang === "kk" ? topic.title_kk : topic.title_ru)}
              className="text-xs px-2.5 py-1.5 rounded-card bg-panel text-primary-dark hover:bg-accent hover:text-white transition-colors border border-slate-200"
            >
              {lang === "kk" ? topic.title_kk : topic.title_ru}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
