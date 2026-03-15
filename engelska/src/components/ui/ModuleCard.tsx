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
