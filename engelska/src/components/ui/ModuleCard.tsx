"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";
import type { ModuleProgress, Stage } from "@/lib/types";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  kind: "grammar" | "reading" | "spelling" | "wordsearch" | "spel";
  stage: Stage;
  progress: ModuleProgress | null;
  locked: boolean;
  prevModuleTitle: string | null;
  isFinalTest?: boolean;
}

const stageBeamColors: Record<string, [string, string]> = {
  lagstadiet:    ["#4ade80", "#22c55e"],
  mellanstadiet: ["#60a5fa", "#3b82f6"],
  hogstadiet:    ["#c084fc", "#a855f7"],
  gymnasiet:     ["#9ca3af", "#6b7280"],
};

function IconCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconLock({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconTrophy({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M12 17c-4 0-7-3-7-7V5h14v5c0 4-3 7-7 7z" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const kindLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  grammar: {
    label: "Grammatik",
    icon: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  },
  reading: {
    label: "Läsning",
    icon: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
  spelling: {
    label: "Stavning",
    icon: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  },
  wordsearch: {
    label: "Ordsökning",
    icon: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  },
  spel: {
    label: "Spel",
    icon: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
};

export default function ModuleCard({
  id,
  title,
  description,
  icon,
  kind,
  stage,
  progress,
  locked,
  prevModuleTitle,
  isFinalTest = false,
}: ModuleCardProps) {
  const href = `/world/${stage.id}/${kind}/${id}`;
  const pct = progress?.completed ? 100 : 0;
  const beamColors = stageBeamColors[stage.id] ?? ["#6366f1", "#a855f7"];
  const kindInfo = kindLabels[kind];

  // ── Locked ───────────────────────────────────────────────────────────────────
  if (locked) {
    return (
      <div
        className="h-full rounded-2xl border-3 border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 opacity-50 cursor-not-allowed select-none"
        style={{ boxShadow: "0 3px 0 0 rgba(99, 102, 241, 0.1), inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-indigo-100 dark:border-gray-600 text-indigo-300">
            <IconLock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-indigo-300 dark:text-gray-400 text-sm">{title}</h3>
            {prevModuleTitle && (
              <p className="text-xs text-indigo-300 dark:text-gray-500 mt-0.5 font-medium">
                Klara &quot;{prevModuleTitle}&quot; först
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Final Test ────────────────────────────────────────────────────────────────
  if (isFinalTest) {
    return (
      <Link href={href} className="block group h-full">
        <div
          className="h-full rounded-3xl p-[3px] transition-all duration-200 group-hover:-translate-y-1 cursor-pointer"
          style={{
            background: progress?.completed
              ? "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316, #eab308, #f59e0b)"
              : "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #fbbf24)",
            backgroundSize: "300% 300%",
            animation: "gradient 3s ease infinite",
            boxShadow: progress?.completed
              ? "0 6px 0 0 rgba(245,158,11,0.4), 0 10px 28px -4px rgba(245,158,11,0.3)"
              : "0 4px 0 0 rgba(245,158,11,0.25), 0 8px 20px -4px rgba(245,158,11,0.2)",
          }}
        >
          <div
            className={`h-full rounded-[22px] px-5 py-4 ${
              progress?.completed
                ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/80 dark:to-yellow-950/60"
                : "bg-gradient-to-br from-amber-50 via-yellow-50/70 to-orange-50 dark:from-gray-800 dark:via-amber-950/20 dark:to-gray-850"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Trophy icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 border-3 ${
                  progress?.completed
                    ? "bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-300 text-white"
                    : "bg-gradient-to-br from-amber-200 to-yellow-200 dark:from-amber-700/60 dark:to-yellow-700/40 border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-300"
                }`}
                style={{
                  boxShadow: progress?.completed
                    ? "0 4px 0 0 rgba(180,83,9,0.4), inset 0 2px 4px 0 rgba(255,255,255,0.4)"
                    : "0 3px 0 0 rgba(245,158,11,0.35), inset 0 2px 4px 0 rgba(255,255,255,0.6)",
                }}
              >
                {progress?.completed
                  ? <IconCheck className="w-8 h-8" />
                  : <IconTrophy className="w-7 h-7" />
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-amber-900 dark:text-amber-100 text-base">{title}</h3>
                  {progress?.completed ? (
                    <span
                      className="badge bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300 text-xs flex-shrink-0 border-2 border-amber-300 dark:border-amber-600 font-bold flex items-center gap-1"
                      style={{ boxShadow: "0 2px 0 0 rgba(180,83,9,0.2)" }}
                    >
                      <IconCheck className="w-3 h-3" /> Klar
                    </span>
                  ) : (
                    <span className="badge bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs flex-shrink-0 border-2 border-amber-300 dark:border-amber-700 font-black tracking-wide">
                      SLUTTEST
                    </span>
                  )}
                </div>

                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 font-medium">{description}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={pct} colorClass="bg-gradient-to-r from-amber-400 to-yellow-400" />
                  </div>
                  {progress ? (
                    <span className="text-sm text-amber-600 dark:text-amber-400 font-bold flex-shrink-0 flex items-center gap-1">
                      <IconStar className="w-3.5 h-3.5" />
                      <NumberTicker value={progress.points} duration={600} suffix="p" />
                    </span>
                  ) : (
                    <span className="text-sm font-bold flex-shrink-0 text-amber-600 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors">
                      Testa dig →
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Standard card ─────────────────────────────────────────────────────────────
  return (
    <Link href={href} className="block group h-full">
      <MagicCard
        gradientColor={`${beamColors[0]}18`}
        className={`h-full rounded-3xl border-3 px-5 py-4 transition-all duration-200 group-hover:-translate-y-1 cursor-pointer relative overflow-hidden ${
          progress?.completed
            ? `${stage.borderClass} bg-white dark:bg-gray-800`
            : "bg-white dark:bg-gray-800 border-indigo-100 dark:border-gray-700 group-hover:border-indigo-200"
        }`}
        style={{
          boxShadow: progress?.completed
            ? "0 5px 0 0 rgba(34, 197, 94, 0.2), 0 8px 16px -4px rgba(34, 197, 94, 0.1)"
            : "0 4px 0 0 rgba(99, 102, 241, 0.15), 0 8px 16px -4px rgba(99, 102, 241, 0.1), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
        } as React.CSSProperties}
      >
        {progress?.completed && (
          <BorderBeam size={180} duration={10} colorFrom={beamColors[0]} colorTo={beamColors[1]} borderWidth={2} />
        )}

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 border-3 relative ${
              progress?.completed
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700"
                : "bg-indigo-50 dark:bg-gray-700 border-indigo-100 dark:border-gray-600"
            }`}
            style={{
              boxShadow: progress?.completed
                ? "0 3px 0 0 rgba(16,185,129,0.25), inset 0 2px 4px 0 rgba(255,255,255,0.5)"
                : "0 3px 0 0 rgba(99,102,241,0.15), inset 0 2px 4px 0 rgba(255,255,255,0.8)"
            }}
          >
            <span>{icon}</span>
            {progress?.completed && (
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                <IconCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-indigo-900 dark:text-gray-100 text-base truncate">{title}</h3>
              {progress?.completed && (
                <span
                  className="badge bg-emerald-100 text-emerald-700 text-xs flex-shrink-0 border-2 border-emerald-200 flex items-center gap-1"
                  style={{ boxShadow: "0 2px 0 0 rgba(16,185,129,0.2)" }}
                >
                  <IconCheck className="w-3 h-3" /> Klar
                </span>
              )}
              <span className="badge bg-indigo-50 dark:bg-gray-700 text-indigo-400 dark:text-gray-400 text-xs ml-auto flex-shrink-0 border-2 border-indigo-100 dark:border-gray-600 flex items-center gap-1">
                {kindInfo?.icon}
                <span>{kindInfo?.label}</span>
              </span>
            </div>

            <p className={`text-sm mt-1 truncate font-medium ${progress?.completed ? "text-emerald-700 dark:text-emerald-300" : "text-indigo-400 dark:text-gray-400"}`}>{description}</p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar
                  value={pct}
                  colorClass={
                    stage.id === "lagstadiet"    ? "bg-gradient-to-r from-jungle-400 to-jungle-500"
                    : stage.id === "mellanstadiet" ? "bg-gradient-to-r from-city-400 to-city-500"
                    : stage.id === "hogstadiet"    ? "bg-gradient-to-r from-global-400 to-global-500"
                    : "bg-gradient-to-r from-summit-500 to-summit-600"
                  }
                />
              </div>
              {progress ? (
                <span className="text-sm text-amber-600 dark:text-amber-400 font-bold flex-shrink-0 flex items-center gap-1">
                  <IconStar className="w-3.5 h-3.5" />
                  <NumberTicker value={progress.points} duration={600} suffix="p" />
                </span>
              ) : (
                <span className="text-sm font-bold flex-shrink-0 text-indigo-400 dark:text-gray-500 group-hover:text-indigo-600 transition-colors">
                  Starta →
                </span>
              )}
            </div>
          </div>
        </div>
      </MagicCard>
    </Link>
  );
}
