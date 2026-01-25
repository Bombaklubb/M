import React from 'react';
import { Disposition } from '../../types';

interface DispositionPanelProps {
  disposition: Disposition;
}

export const DispositionPanel: React.FC<DispositionPanelProps> = ({
  disposition
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>📋</span>
        Disposition - så här kan du bygga din text
      </h3>

      <div className="space-y-3">
        {/* Rubrik */}
        <div className="flex items-start gap-3">
          <div className="w-24 shrink-0">
            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
              Rubrik
            </span>
          </div>
          <p className="text-sm text-slate-600">{disposition.rubrik}</p>
        </div>

        {/* Inledning */}
        <div className="flex items-start gap-3">
          <div className="w-24 shrink-0">
            <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded">
              Inledning
            </span>
          </div>
          <p className="text-sm text-slate-600">{disposition.inledning}</p>
        </div>

        {/* Stycken */}
        {disposition.stycken.map((stycke, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-24 shrink-0">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                {stycke.startsWith('Steg') ? stycke.split(':')[0] :
                  stycke.startsWith('Material') ? 'Material' :
                    stycke.startsWith('Tips') ? 'Tips' :
                      `Del ${index + 1}`}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {stycke.includes(':') ? stycke.split(':').slice(1).join(':').trim() : stycke}
            </p>
          </div>
        ))}

        {/* Avslut */}
        <div className="flex items-start gap-3">
          <div className="w-24 shrink-0">
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
              Avslut
            </span>
          </div>
          <p className="text-sm text-slate-600">{disposition.avslut}</p>
        </div>
      </div>
    </div>
  );
};
