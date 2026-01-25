import React from 'react';
import { QuickCheck, CheckStatus, CheckResult } from '../../types';

interface QuickCheckPanelProps {
  quickCheck: QuickCheck;
  isAnalyzing?: boolean;
}

const STATUS_ICONS: Record<CheckStatus, string> = {
  [CheckStatus.FULFILLED]: '✅',
  [CheckStatus.ALMOST]: '🟡',
  [CheckStatus.MISSING]: '❌'
};

const STATUS_COLORS: Record<CheckStatus, string> = {
  [CheckStatus.FULFILLED]: 'text-green-700 bg-green-50',
  [CheckStatus.ALMOST]: 'text-yellow-700 bg-yellow-50',
  [CheckStatus.MISSING]: 'text-red-700 bg-red-50'
};

const CheckRow: React.FC<{ check: CheckResult }> = ({ check }) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg ${STATUS_COLORS[check.status]}`}>
    <span className="text-lg shrink-0">{STATUS_ICONS[check.status]}</span>
    <div className="flex-1">
      <div className="font-bold text-sm">{check.label}</div>
      <div className="text-sm opacity-80">{check.comment}</div>
    </div>
  </div>
);

export const QuickCheckPanel: React.FC<QuickCheckPanelProps> = ({
  quickCheck,
  isAnalyzing = false
}) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Analyserar din text...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>🔍</span>
        Snabbcheck
      </h3>

      <div className="space-y-2">
        {/* Basic checks */}
        <CheckRow check={quickCheck.rubrik} />
        <CheckRow check={quickCheck.stycken} />
        <CheckRow check={quickCheck.meningar} />
        <CheckRow check={quickCheck.sambandsord} />

        {/* Factual text: ämnesord */}
        {quickCheck.amnesord && (
          <CheckRow check={quickCheck.amnesord} />
        )}

        {/* Argumentative text: argument checks */}
        {quickCheck.argumentDrag && (
          <>
            <div className="mt-4 mb-2">
              <h4 className="text-sm font-bold text-slate-600">Argumenterande drag</h4>
            </div>
            <CheckRow check={quickCheck.argumentDrag.tes} />
            <CheckRow check={quickCheck.argumentDrag.argument} />
            {quickCheck.argumentDrag.motargument && (
              <CheckRow check={quickCheck.argumentDrag.motargument} />
            )}
            <CheckRow check={quickCheck.argumentDrag.uppmaning} />
          </>
        )}
      </div>
    </div>
  );
};
