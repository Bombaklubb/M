"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";
import type { ModuleProgress, Stage } from "@/lib/types";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  kind: "grammar" | "reading" | "spelling" | "wordsearch" | "crossword";
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

  const kindLabel =
    kind === "grammar" ? "📝 Grammatik"
    : kind === "reading" ? "📖 Läsning"
    : kind === "spelling" ? "✏️ Stavning"
    : kind === "wordsearch" ? "🔍 Ordsökning"
    : "🔠 Korsord";

  if (locked) {
    return (
      <div
        className="rounded-2xl border-3 border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 opacity-50 cursor-not-allowed select-none"
        style={{
          boxShadow: "0 3px 0 0 rgba(99, 102, 241, 0.1), inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)"
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-gray-700 flex items-center justify-center text-lg flex-shrink-0 border-2 border-indigo-100 dark:border-gray-600">
            🔒
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

  // ── Final Test special card ──────────────────────────────────────────────────
  if (isFinalTest) {
    return (
      <Link href={href} className="block group">
        {/* Animated gradient border via wrapper technique – avoids z-index issues */}
        <div
          className="rounded-3xl p-[3px] transition-all duration-200 group-hover:-translate-y-1 cursor-pointer"
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
          {/* Card inner */}
          <div
            className={`rounded-[22px] px-5 py-5 ${
              progress?.completed
                ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/80 dark:to-yellow-950/60"
                : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-850"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Trophy icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 border-3 ${
                  progress?.completed
                    ? "bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-300 text-white"
                    : "bg-gradient-to-br from-amber-200 to-yellow-200 dark:from-amber-700/60 dark:to-yellow-700/40 border-amber-300 dark:border-amber-600"
                }`}
                style={{
                  boxShadow: progress?.completed
                    ? "0 4px 0 0 rgba(180,83,9,0.4), inset 0 2px 4px 0 rgba(255,255,255,0.4)"
                    : "0 3px 0 0 rgba(245,158,11,0.35), inset 0 2px 4px 0 rgba(255,255,255,0.6)",
                }}
              >
                {progress?.completed ? "✓" : "🏆"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-amber-900 dark:text-amber-100 text-base">{title}</h3>
                  {progress?.completed ? (
                    <span
                      className="badge bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300 text-xs flex-shrink-0 border-2 border-amber-300 dark:border-amber-600 font-bold"
                      style={{ boxShadow: "0 2px 0 0 rgba(180,83,9,0.2)" }}
                    >
                      ✓ Klar
                    </span>
                  ) : (
                    <span className="badge bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs flex-shrink-0 border-2 border-amber-300 dark:border-amber-700 font-bold">
                      SLUTTEST
                    </span>
                  )}
                </div>

                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 font-medium">{description}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar
                      value={pct}
                      colorClass="bg-gradient-to-r from-amber-400 to-yellow-400"
                    />
                  </div>
                  {progress && (
                    <span className="text-sm text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">
                      ⭐ {progress.points}p
                    </span>
                  )}
                  {!progress && (
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

  // ── Standard card ─────────────────────────────────────────────────────────
  return (
    <Link href={href} className="block group">
      <MagicCard
        gradientColor={`${beamColors[0]}18`}
        className={`rounded-3xl border-3 bg-white dark:bg-gray-800 px-5 py-4 transition-all duration-200 group-hover:-translate-y-1 cursor-pointer relative overflow-hidden ${
          progress?.completed
            ? `${stage.borderClass} bg-gradient-to-br from-white to-indigo-50/50`
            : "border-indigo-100 dark:border-gray-700 group-hover:border-indigo-200"
        }`}
        style={{
          boxShadow: progress?.completed
            ? "0 5px 0 0 rgba(34, 197, 94, 0.25), 0 8px 16px -4px rgba(34, 197, 94, 0.15), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
            : "0 4px 0 0 rgba(99, 102, 241, 0.15), 0 8px 16px -4px rgba(99, 102, 241, 0.1), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
        } as React.CSSProperties}
      >
        {/* BorderBeam on completed modules */}
        {progress?.completed && (
          <BorderBeam
            size={180}
            duration={10}
            colorFrom={beamColors[0]}
            colorTo={beamColors[1]}
            borderWidth={2}
          />
        )}

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 border-3 ${
              progress?.completed
                ? stage.colorClass + " text-white border-white/30"
                : "bg-indigo-50 dark:bg-gray-700 border-indigo-100 dark:border-gray-600"
            }`}
            style={{
              boxShadow: progress?.completed
                ? "0 3px 0 0 rgba(0, 0, 0, 0.2), inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)"
                : "0 3px 0 0 rgba(99, 102, 241, 0.15), inset 0 2px 4px 0 rgba(255, 255, 255, 0.8)"
            }}
          >
            {progress?.completed ? "✓" : icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-indigo-900 dark:text-gray-100 text-base truncate">{title}</h3>
              {progress?.completed && (
                <span
                  className="badge bg-emerald-100 text-emerald-700 text-xs flex-shrink-0 border-2 border-emerald-200"
                  style={{ boxShadow: "0 2px 0 0 rgba(16, 185, 129, 0.2)" }}
                >
                  ✓ Klar
                </span>
              )}
              <span
                className="badge bg-indigo-50 dark:bg-gray-700 text-indigo-400 dark:text-gray-400 text-xs ml-auto flex-shrink-0 border-2 border-indigo-100 dark:border-gray-600"
              >
                {kindLabel}
              </span>
            </div>

            <p className="text-sm text-indigo-400 dark:text-gray-400 mt-1 truncate font-medium">{description}</p>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar
                  value={pct}
                  colorClass={
                    stage.id === "lagstadiet"
                      ? "bg-gradient-to-r from-jungle-400 to-jungle-500"
                      : stage.id === "mellanstadiet"
                      ? "bg-gradient-to-r from-city-400 to-city-500"
                      : stage.id === "hogstadiet"
                      ? "bg-gradient-to-r from-global-400 to-global-500"
                      : "bg-gradient-to-r from-summit-500 to-summit-600"
                  }
                />
              </div>
              {progress && (
                <span className="text-sm text-amber-600 dark:text-amber-400 font-bold flex-shrink-0 flex items-center gap-1">
                  ⭐ {progress.points}p
                </span>
              )}
              {!progress && (
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
