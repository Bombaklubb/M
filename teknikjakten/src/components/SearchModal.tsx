import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ALL_CHAPTERS, AREAS } from '../data/areas';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (areaId: string, chapterId: string) => void;
}

interface SearchResult {
  term: string;
  definition: string;
  chapterTitle: string;
  chapterId: string;
  areaId: string;
  areaEmoji: string;
  areaName: string;
}

export default function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const hits: SearchResult[] = [];

    for (const chapter of ALL_CHAPTERS) {
      if (!chapter.summary?.concepts) continue;
      const area = AREAS.find(a => a.id === chapter.areaId);
      if (!area) continue;

      for (const concept of chapter.summary.concepts) {
        if (
          concept.term.toLowerCase().includes(q) ||
          concept.definition.toLowerCase().includes(q)
        ) {
          hits.push({
            term: concept.term,
            definition: concept.definition,
            chapterTitle: chapter.title,
            chapterId: chapter.id,
            areaId: area.id,
            areaEmoji: area.emoji,
            areaName: area.name,
          });
          if (hits.length >= 20) return hits;
        }
      }
    }
    return hits;
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sök begrepp"
    >
      <div
        className="bg-white on-light rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Sök på ett begrepp..."
            className="flex-1 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400 placeholder:font-normal"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 cursor-pointer"
            aria-label="Stäng"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <p className="text-sm text-gray-400 text-center py-10 font-semibold">
              Sök på ett begrepp...
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10 font-semibold">
              Inga begrepp hittades.
            </p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => { onSelect(r.areaId, r.chapterId); onClose(); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0 mt-0.5">{r.areaEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{r.term}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5 line-clamp-2">
                          {r.definition.length > 80 ? r.definition.slice(0, 80) + '…' : r.definition}
                        </p>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {r.chapterTitle}
                          <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            {r.areaName}
                          </span>
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
