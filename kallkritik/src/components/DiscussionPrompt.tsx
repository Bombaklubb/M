import React from 'react';
import { MessagesSquare } from 'lucide-react';

/**
 * Samtalsfråga som visas efter varje avslöjat svar.
 * Används i EPA-arbetssättet: eleven svarar enskilt, diskuterar sedan i par/grupp.
 */
export function DiscussionPrompt({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-2 bg-violet-50 border-2 border-violet-200 rounded-2xl p-3">
      <MessagesSquare className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
      <div>
        <div className="text-[10px] font-extrabold text-violet-500 uppercase tracking-wide mb-0.5">
          Samtalsfråga – prata med en kompis
        </div>
        <p className="text-xs text-violet-700 font-semibold leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
