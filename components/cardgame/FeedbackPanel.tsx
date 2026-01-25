import React from 'react';
import { Feedback } from '../../types';

interface FeedbackPanelProps {
  feedback: Feedback;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>💬</span>
        Feedback
      </h3>

      <div className="space-y-6">
        {/* Styrkor */}
        <div>
          <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
            <span>💪</span>
            Styrkor
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
              <strong>1.</strong> {feedback.styrka1}
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
              <strong>2.</strong> {feedback.styrka2}
            </div>
          </div>
        </div>

        {/* Nästa steg */}
        <div>
          <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
            <span>🎯</span>
            Nästa steg
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
              <strong>1.</strong> {feedback.nastaSteg1}
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
              <strong>2.</strong> {feedback.nastaSteg2}
            </div>
          </div>
        </div>

        {/* Mikro-övning */}
        <div>
          <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
            <span>⚡</span>
            Mikro-övning (30 sekunder)
          </h4>
          <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
            <p className="text-sm text-orange-800 font-medium">
              {feedback.mikroOvning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
