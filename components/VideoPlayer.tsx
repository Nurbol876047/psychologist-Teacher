"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface VideoPlayerProps {
  videoSrc: string | null;
  onEnded?: () => void;
}

export default function VideoPlayer({ videoSrc, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setVideoError(false);
    const el = videoRef.current;
    if (videoSrc && el) {
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Автозапуск браузермен бұғатталуы мүмкін — мәтін жауап әрқашан көрсетіледі.
          setVideoError(true);
        });
      }
    }
  }, [videoSrc]);

  const showPhoto = !videoSrc || videoError;

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square bg-panel rounded-card overflow-hidden border border-slate-200 shadow-card">
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/psychologist.jpg"
          alt={t("psychologist_alt")}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          key={videoSrc}
          src={`/videos/${videoSrc}`}
          className="w-full h-full object-cover"
          playsInline
          controls={false}
          onEnded={onEnded}
          onError={() => setVideoError(true)}
        />
      )}

      {videoError && videoSrc && (
        <div className="absolute bottom-0 inset-x-0 bg-primary-dark/90 text-white text-xs px-3 py-2">
          {t("video_unavailable")}
        </div>
      )}
    </div>
  );
}
