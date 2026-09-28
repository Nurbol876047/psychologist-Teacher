"use client";

import { useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];
const MAX_BYTES = 15 * 1024 * 1024;

interface CheckItem {
  number: string;
  question: string;
  given_answer: string;
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
}

interface CheckSummary {
  total: number;
  correct: number;
  incorrect: number;
  score_percent: number;
  overall_comment: string;
}

interface CheckResult {
  summary: CheckSummary;
  items: CheckItem[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function scoreColor(percent: number): { ring: string; text: string } {
  if (percent >= 80) return { ring: "#2FA6A6", text: "text-accent-dark" };
  if (percent >= 50) return { ring: "#E0A82E", text: "text-amber-600" };
  return { ring: "#E15B5B", text: "text-red-600" };
}

export default function TestChecker() {
  const { t, lang } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);

  const isPdf = file?.type === "application/pdf";

  const handleFileSelect = (selected: File | null) => {
    setError(null);
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError(t("test_check_error_type"));
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError(t("test_check_error_size"));
      return;
    }
    setFile(selected);
    setPreviewUrl(ALLOWED_IMAGE_TYPES.includes(selected.type) ? URL.createObjectURL(selected) : null);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!file && !text.trim()) {
      setError(t("test_check_error_empty"));
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text.trim()) formData.append("text", text.trim());
      formData.append("lang", lang);

      const res = await fetch("/api/check-test", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(t("test_check_error_generic"));
        return;
      }

      setResult(data.result as CheckResult);
    } catch {
      setError(t("test_check_error_generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setText("");
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <section className="bg-white border border-slate-200 rounded-card shadow-card p-10 flex flex-col items-center gap-4 text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-panel" />
          <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-primary-dark">{t("test_check_checking")}</p>
        <p className="text-xs text-slate-400 max-w-xs">{t("test_check_checking_hint")}</p>
      </section>
    );
  }

  if (result) {
    const { summary, items } = result;
    const percent = Math.max(0, Math.min(100, summary?.score_percent ?? 0));
    const colors = scoreColor(percent);

    return (
      <section className="flex flex-col gap-5">
        <div className="bg-white border border-slate-200 rounded-card shadow-card p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `conic-gradient(${colors.ring} ${percent}%, #E9EDF2 0)` }}
          >
            <div className="absolute inset-[7px] bg-white rounded-full flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${colors.text}`}>{percent}%</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-base font-semibold text-primary-dark">{t("test_check_results_title")}</h2>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-card bg-accent/10 text-accent-dark text-xs font-medium">
                <span aria-hidden>✓</span> {summary?.correct ?? 0} {t("test_check_correct_plural")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-card bg-red-50 text-red-600 text-xs font-medium">
                <span aria-hidden>✕</span> {summary?.incorrect ?? 0} {t("test_check_incorrect_plural")}
              </span>
              <span className="text-xs text-slate-400">
                {t("test_check_score_label")}: {summary?.correct ?? 0} / {summary?.total ?? 0}
              </span>
            </div>
            {summary?.overall_comment && (
              <p className="text-sm text-slate-500 italic">"{summary.overall_comment}"</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 px-4 py-2.5 rounded-card border border-slate-300 text-sm font-medium text-slate-600 hover:bg-panel transition-colors"
          >
            {t("test_check_new_check")}
          </button>
        </div>

        {(!items || items.length === 0) ? (
          <div className="bg-white border border-slate-200 rounded-card shadow-card p-6 text-center text-sm text-slate-500">
            {t("test_check_empty_items")}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-card shadow-card border-l-4 overflow-hidden animate-[fadeIn_0.35s_ease-out_both] ${
                  item.is_correct ? "border-l-accent" : "border-l-red-400"
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        item.is_correct ? "bg-accent" : "bg-red-400"
                      }`}
                      aria-hidden
                    >
                      {item.is_correct ? "✓" : "✕"}
                    </span>
                    <p className="text-sm font-medium text-primary-dark leading-snug pt-0.5">
                      <span className="text-slate-400 mr-1">{item.number}.</span>
                      {item.question}
                    </p>
                    <span
                      className={`ml-auto shrink-0 px-2.5 py-1 rounded-card text-xs font-medium whitespace-nowrap ${
                        item.is_correct ? "bg-accent/10 text-accent-dark" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {item.is_correct ? t("test_check_correct") : t("test_check_incorrect")}
                    </span>
                  </div>

                  <div className="pl-10 flex flex-col gap-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-card text-xs ${
                          item.is_correct
                            ? "bg-panel text-slate-600"
                            : "bg-red-50 text-red-600 line-through decoration-red-300"
                        }`}
                      >
                        {t("test_check_given_answer")}: {item.given_answer || "—"}
                      </span>
                      {!item.is_correct && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-card text-xs bg-accent/10 text-accent-dark font-medium">
                          {t("test_check_correct_answer")}: {item.correct_answer}
                        </span>
                      )}
                    </div>
                    {item.explanation && (
                      <p className="text-slate-500 text-xs leading-relaxed flex gap-1.5">
                        <span aria-hidden>💡</span>
                        <span>{item.explanation}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-primary-dark mb-2">
          {t("test_check_upload_label")}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,application/pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />

        {!file ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full border-2 border-dashed rounded-card py-8 flex flex-col items-center gap-2 transition-colors ${
              isDragging
                ? "border-accent bg-accent/5 text-accent-dark"
                : "border-slate-300 text-slate-500 hover:border-accent hover:text-accent-dark hover:bg-panel"
            }`}
          >
            <span className="text-3xl" aria-hidden>
              📄
            </span>
            <span className="text-sm font-medium">{t("test_check_upload_label")}</span>
            <span className="text-xs text-slate-400">{t("test_check_drop_hint")}</span>
            <span className="text-xs text-slate-400">{t("test_check_upload_hint")}</span>
          </button>
        ) : previewUrl ? (
          <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="preview"
              className="max-h-64 w-auto rounded-card border border-slate-200 object-contain"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="self-start text-xs font-medium text-accent-dark hover:underline"
            >
              {t("test_check_upload_change")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 border border-slate-200 rounded-card p-4">
            <span className="text-3xl shrink-0" aria-hidden>
              {isPdf ? "📕" : "📄"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-dark truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 text-xs font-medium text-accent-dark hover:underline"
            >
              {t("test_check_upload_change")}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-xs text-slate-400 uppercase">{t("test_check_or")}</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-dark mb-2">
          {t("test_check_text_label")}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("test_check_text_placeholder")}
          rows={6}
          className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent whitespace-pre-wrap"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-card bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
        >
          {t("test_check_submit")}
        </button>
      </div>

      <p className="text-xs text-slate-400">{t("test_check_privacy_note")}</p>
    </section>
  );
}
