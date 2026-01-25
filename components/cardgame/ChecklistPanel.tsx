import React from 'react';

interface ChecklistPanelProps {
  checklist: string[];
  completedItems?: number[];
}

export const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  checklist,
  completedItems = []
}) => {
  const completedCount = completedItems.length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      {/* Header */}
      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span>✅</span>
        Checklista
      </h3>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Krav uppfyllda</span>
          <span className="font-bold">{completedCount}/{totalCount}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <ul className="space-y-2">
        {checklist.map((item, index) => {
          const isCompleted = completedItems.includes(index);
          return (
            <li
              key={index}
              className={`flex items-start gap-2 text-sm ${
                isCompleted ? 'text-green-600' : 'text-slate-600'
              }`}
            >
              <span className="mt-0.5 shrink-0">
                {isCompleted ? '✅' : '⬜'}
              </span>
              <span className={isCompleted ? 'line-through opacity-70' : ''}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
