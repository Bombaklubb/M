"use client";

import Link from "next/link";
import Header from "@/components/ui/Header";
import type { StudentData } from "@/lib/types";

/**
 * Visas i stället för ett snabbspel när eleven inte klarat något kapitel idag.
 *
 * Spel-fliken döljer redan spellänkarna, men ett spel kan fortfarande öppnas
 * via ett bokmärke eller webbläsarens bakåtknapp. Då gick spelet att spela men
 * gav tyst noll poäng, vilket såg ut som en bugg. Nu står det varför.
 */
export default function GameDayLock({ stageId, student }: { stageId: string; student: StudentData | null }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="card">
          <p className="text-5xl mb-3" aria-hidden="true">🔒</p>
          <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">
            Spelen öppnas när du klarat ett kapitel idag
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Gör klart ett kapitel under Grammatik, Stavning eller Ordsökning, så är
            spelen öppna resten av dagen.
          </p>
          <Link
            prefetch={false}
            href={`/world/${stageId}?tab=grammar`}
            className="btn-primary bg-en-600 hover:bg-en-700 mt-6 w-full"
          >
            Till kapitlen →
          </Link>
        </div>
      </main>
    </div>
  );
}
