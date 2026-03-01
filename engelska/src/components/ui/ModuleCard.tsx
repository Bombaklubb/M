"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";
import type { ModuleProgress, Stage } from "@/lib/types";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  kind: "grammar" | "reading";
  stage: Stage;
  progress: ModuleProgress | null;
  locked: boolean;
  prevModuleTitle: string | null;
}

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

  if (locked) {
    return (
      <div className="card opacity-60 cursor-not-allowed select-none">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
            🔒
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-500">{title}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
            {prevModuleTitle && (
              <p className="text-xs text-gray-400 mt-2">
                Klara &quot;{prevModuleTitle}&quot; först för att låsa upp den här.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={href} className="block group">
      <div
        className={`card border-2 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 ${
          progress?.completed
            ? `${stage.borderClass} bg-gradient-to-br from-white to-gray-50`
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${
              progress?.completed ? stage.colorClass + " text-white" : "bg-gray-100"
            }`}
          >
            {progress?.completed ? "✓" : icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {progress?.completed && (
                <span className="badge bg-green-100 text-green-700 text-xs">
                  ✓ Klar
                </span>
              )}
              <span className="badge bg-gray-100 text-gray-600 text-xs ml-auto">
                {kind === "grammar" ? "📝 Grammatik" : "📖 Läsning"}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{description}</p>

            {/* Progress */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar
                  value={pct}
                  colorClass={
                    stage.id === "lagstadiet"
                      ? "bg-jungle-500"
                      : stage.id === "mellanstadiet"
                      ? "bg-city-500"
                      : stage.id === "hogstadiet"
                      ? "bg-global-500"
                      : "bg-summit-600"
                  }
                />
              </div>
              {progress && (
                <span className="text-xs text-amber-600 font-medium flex-shrink-0">
                  ⭐ {progress.points}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
