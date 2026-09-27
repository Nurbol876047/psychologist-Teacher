"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { getMoodLevel, MOOD_LEVELS } from "@/data/moodLevels";
import { MoodEntry, getEntriesInRange, toDateKey } from "@/lib/moodStorage";
import { formatShortDate } from "@/lib/dateFormat";
import MoodStats from "@/components/MoodStats";

interface MoodChartProps {
  entries: MoodEntry[];
}

type Range = "week" | "month";

const WIDTH = 640;
const HEIGHT = 250;
const PAD_LEFT = 34;
const PAD_RIGHT = 16;
const PAD_TOP = 22;
const PAD_BOTTOM = 30;

export default function MoodChart({ entries }: MoodChartProps) {
  const { t, lang } = useTranslation();
  const [range, setRange] = useState<Range>("week");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const days = range === "week" ? 7 : 30;
  const filtered = useMemo(() => getEntriesInRange(entries, days), [entries, days]);

  const rangeStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (days - 1));
    return d.getTime();
  }, [days]);
  const rangeEnd = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const baseline = HEIGHT - PAD_BOTTOM;

  const xForTs = (ts: number) => {
    const span = Math.max(rangeEnd - rangeStart, 1);
    const ratio = (ts - rangeStart) / span;
    return PAD_LEFT + ratio * innerW;
  };
  const xForDate = (dateKey: string) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    return xForTs(new Date(y, m - 1, d).getTime());
  };
  const yForLevel = (level: number) => {
    const ratio = (level - 1) / 4;
    return PAD_TOP + (1 - ratio) * innerH;
  };

  const points = useMemo(
    () => filtered.map((e) => ({ x: xForDate(e.date), y: yForLevel(e.level), entry: e })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, rangeStart, rangeEnd]
  );
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD =
    points.length >= 2
      ? `M ${points[0].x.toFixed(1)} ${baseline} ` +
        points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
        ` L ${points[points.length - 1].x.toFixed(1)} ${baseline} Z`
      : "";

  const xTicks = useMemo(() => {
    // Белгілерді нақты күнтізбелік күндерге туралаймыз (уақыт аралығын тең
    // бөліктерге бөлу бөлшек күндерге әкеліп, қайталанатын белгілер тудырады).
    const desiredCount = range === "week" ? days : 6;
    const step = Math.max(1, Math.round((days - 1) / Math.max(desiredCount - 1, 1)));
    const offsets: number[] = [];
    for (let offset = 0; offset < days; offset += step) {
      offsets.push(offset);
    }
    const lastOffset = days - 1;
    if (offsets[offsets.length - 1] !== lastOffset) {
      offsets.push(lastOffset);
    }
    return offsets.map((offset) => {
      const d = new Date(rangeStart);
      d.setDate(d.getDate() + offset);
      const key = toDateKey(d);
      return { x: xForTs(d.getTime()), label: formatShortDate(key) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, days, rangeStart]);

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    let nearest = 0;
    let bestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - loc.x);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  };

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <section className="bg-white border border-slate-200 rounded-card shadow-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-primary-dark">{t("mood_chart_title")}</h2>
        <div className="flex gap-1 bg-panel rounded-card p-1">
          {(["week", "month"] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRange(r);
                setHoverIdx(null);
              }}
              className={`px-3 py-1.5 rounded-card text-xs font-medium transition-colors ${
                range === r ? "bg-white text-primary shadow-card" : "text-slate-500 hover:text-primary"
              }`}
            >
              {r === "week" ? t("mood_range_week") : t("mood_range_month")}
            </button>
          ))}
        </div>
      </div>

      <MoodStats rangeEntries={filtered} allEntries={entries} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1.5 py-10 text-center">
          <span className="text-2xl" aria-hidden>
            🌤️
          </span>
          <p className="text-sm text-slate-400 max-w-xs">{t("mood_empty")}</p>
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-[250px] touch-none"
          onPointerMove={handleMove}
          onPointerLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="moodAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2FA6A6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2FA6A6" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="moodGlowGradient">
              <stop offset="0%" stopColor="#2FA6A6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2FA6A6" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect
            x={PAD_LEFT - 6}
            y={PAD_TOP - 8}
            width={innerW + 12}
            height={innerH + 16}
            rx={10}
            fill="#F5F7FA"
          />

          {MOOD_LEVELS.map((m) => {
            const y = yForLevel(m.level);
            return (
              <g key={m.level}>
                <line x1={PAD_LEFT} y1={y} x2={WIDTH - PAD_RIGHT} y2={y} stroke="#E2E8F0" strokeWidth={1} />
                <text x={PAD_LEFT - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#94A3B8">
                  {m.emoji}
                </text>
              </g>
            );
          })}

          {xTicks.map((tick, i) => {
            const anchor = i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle";
            return (
              <text key={i} x={tick.x} y={HEIGHT - 8} textAnchor={anchor} fontSize="10" fill="#94A3B8">
                {tick.label}
              </text>
            );
          })}

          {points.length === 1 && (
            <circle cx={points[0].x} cy={points[0].y} r={26} fill="url(#moodGlowGradient)" />
          )}

          {areaD && <path d={areaD} fill="url(#moodAreaGradient)" stroke="none" />}
          <path d={pathD} fill="none" stroke="#2FA6A6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <g key={p.entry.date}>
              <circle cx={p.x} cy={p.y} r={5} fill="#2FA6A6" stroke="#FFFFFF" strokeWidth={2} />
              {i === points.length - 1 && (
                <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="16">
                  {getMoodLevel(p.entry.level).emoji}
                </text>
              )}
            </g>
          ))}

          {hovered &&
            (() => {
              const boxW = 132;
              const boxH = 46;
              let bx = hovered.x - boxW / 2;
              bx = Math.max(PAD_LEFT, Math.min(WIDTH - PAD_RIGHT - boxW, bx));
              let by = hovered.y - boxH - 14;
              if (by < 2) by = hovered.y + 14;
              const lvl = getMoodLevel(hovered.entry.level);
              const label = lang === "kk" ? lvl.label_kk : lvl.label_ru;
              return (
                <g>
                  <line
                    x1={hovered.x}
                    y1={PAD_TOP}
                    x2={hovered.x}
                    y2={baseline}
                    stroke="#94A3B8"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <circle cx={hovered.x} cy={hovered.y} r={7} fill="#2FA6A6" stroke="#FFFFFF" strokeWidth={2} />
                  <rect x={bx} y={by} width={boxW} height={boxH} rx={6} fill="#1E3A5F" opacity={0.95} />
                  <text x={bx + boxW / 2} y={by + 18} textAnchor="middle" fontSize="11" fill="#FFFFFF" fontWeight={600}>
                    {formatShortDate(hovered.entry.date)} · {lvl.emoji}
                  </text>
                  <text x={bx + boxW / 2} y={by + 34} textAnchor="middle" fontSize="10" fill="#CBD5E1">
                    {label}
                  </text>
                </g>
              );
            })()}
        </svg>
      )}
    </section>
  );
}
